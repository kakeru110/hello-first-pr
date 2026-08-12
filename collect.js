import { readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Parser from "rss-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FEEDS_PATH = path.join(__dirname, "feeds.json");
const HOURS_WINDOW = 24;

const parser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; NewsDigestBot/1.0; +https://github.com/kakeru110)",
  },
});

async function loadFeeds() {
  const raw = await readFile(FEEDS_PATH, "utf-8");
  return JSON.parse(raw);
}

function normalizeItem(item, source) {
  return {
    title: (item.title ?? "").trim(),
    summary: (item.contentSnippet ?? item.content ?? "").trim(),
    link: item.link ?? "",
    source,
    pubDate: item.pubDate ?? item.isoDate ?? "",
  };
}

function isWithinWindow(pubDate, now, hours) {
  const published = new Date(pubDate);
  if (Number.isNaN(published.getTime())) return false;
  return now.getTime() - published.getTime() <= hours * 60 * 60 * 1000;
}

async function collectFeed(feed, now) {
  const parsed = await parser.parseURL(feed.url);
  return parsed.items
    .map((item) => normalizeItem(item, feed.source))
    .filter((item) => isWithinWindow(item.pubDate, now, HOURS_WINDOW));
}

export async function collect(now = new Date()) {
  const feeds = await loadFeeds();
  const results = await Promise.allSettled(
    feeds.map((feed) => collectFeed(feed, now))
  );

  const articles = [];
  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    } else {
      console.error(`[collect] failed to fetch ${feeds[i].source}: ${result.reason}`);
    }
  });

  return articles;
}

async function main() {
  const now = new Date();
  const articles = await collect(now);

  const dateStr = now.toISOString().slice(0, 10);
  const outDir = path.join(__dirname, "data", "raw");
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, `${dateStr}.json`);
  await writeFile(outPath, JSON.stringify(articles, null, 2), "utf-8");

  console.log(`[collect] ${articles.length} articles saved to ${outPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
