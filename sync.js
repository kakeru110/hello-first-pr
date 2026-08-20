// GitHubのContents APIを介した同期の共通処理。index.html / exercises.html の両方から使う。
window.MuscleSync = (function () {
  "use strict";

  const GITHUB_TOKEN_KEY = "muscleLog.githubToken";
  const GITHUB_OWNER = "kakeru110";
  const GITHUB_REPO = "hello-first-pr";
  const GITHUB_BRANCH = "main";

  function getToken() {
    return localStorage.getItem(GITHUB_TOKEN_KEY) || "";
  }

  function setToken(token) {
    if (token) {
      localStorage.setItem(GITHUB_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(GITHUB_TOKEN_KEY);
    }
  }

  function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  function base64ToUtf8(b64) {
    return decodeURIComponent(escape(atob(b64.replace(/\n/g, ""))));
  }

  function nowTime() {
    return new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
  }

  function headers(token) {
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
  }

  async function getFile(token, path) {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
    const res = await fetch(url, { headers: headers(token) });
    if (res.status === 404) {
      return { exists: false, sha: null, data: null };
    }
    if (!res.ok) {
      throw new Error(`取得エラー (${res.status})`);
    }
    const body = await res.json();
    return { exists: true, sha: body.sha, data: JSON.parse(base64ToUtf8(body.content)) };
  }

  async function putFile(token, path, data, sha, message) {
    const body = {
      message: message || "Update data",
      content: utf8ToBase64(JSON.stringify(data, null, 2)),
      branch: GITHUB_BRANCH,
    };
    if (sha) body.sha = sha;
    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, {
      method: "PUT",
      headers: Object.assign({ "Content-Type": "application/json" }, headers(token)),
      body: JSON.stringify(body),
    });
    if (res.status === 409) {
      const err = new Error("conflict");
      err.conflict = true;
      throw err;
    }
    if (!res.ok) {
      throw new Error(`保存エラー (${res.status})`);
    }
    const respBody = await res.json();
    return respBody.content.sha;
  }

  const CARDIO_PATTERN = /バイク|ジャンプ|ラン|エアロ|有酸素/;

  function isCardioExercise(name) {
    return CARDIO_PATTERN.test(name);
  }

  // 種目名の並び順: 有酸素系(バイク・ジャンプなど)は種類が違うので、
  // 五十音順ではなく常に一覧の最後にまとめる。それ以外は五十音順。
  function compareExerciseNames(a, b) {
    const aCardio = isCardioExercise(a);
    const bCardio = isCardioExercise(b);
    if (aCardio !== bCardio) return aCardio ? 1 : -1;
    return a.localeCompare(b, "ja");
  }

  // 種目名から部位を推測する(記録画面のセレクトのグループ分け、種目管理画面での
  // 追加時のプレビュー、2週間平均のグラフ集計など、複数箇所で共通して使う)。
  // 判定は上から優先度順、どれにも当てはまらなければ null(=「その他」)を返す。
  const MUSCLE_GROUPS = [
    { key: "cardio", label: "有酸素", test: isCardioExercise },
    { key: "chest", label: "胸", test: (n) => /ベンチ|チェストプレス|フライ/.test(n) },
    { key: "back", label: "背中", test: (n) => /ロー|ラットプル|プルダウン|デッドリフト|懸垂/.test(n) },
    { key: "shoulder", label: "肩", test: (n) => /ミリタリー|ショルダー/.test(n) },
    { key: "arm", label: "腕", test: (n) => /カール|トライセプス/.test(n) },
    { key: "leg", label: "脚", test: (n) => /スクワット|レッグ|ランジ/.test(n) },
  ];

  function muscleGroupForExercise(name) {
    return MUSCLE_GROUPS.find((g) => g.test(name)) || null;
  }

  // ライト/ダークの手動切り替え。未設定(""）ならOS設定(prefers-color-scheme)に従う。
  // <head>内のインラインスクリプトで先に data-theme を反映しているため、ここでは
  // トグルボタンの見た目と切り替え処理だけを担当する。
  const THEME_KEY = "muscleLog.theme";
  const SUN_ICON =
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="3.2"/><path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3.1 3.1l1.1 1.1M11.8 11.8l1.1 1.1M3.1 12.9l1.1-1.1M11.8 4.2l1.1-1.1"/></svg>';
  const MOON_ICON =
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 9.5A6 6 0 1 1 6.5 2.5a5 5 0 0 0 7 7Z"/></svg>';

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || "";
  }

  function setTheme(theme) {
    if (theme === "light" || theme === "dark") {
      localStorage.setItem(THEME_KEY, theme);
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      localStorage.removeItem(THEME_KEY);
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function effectiveTheme() {
    const stored = getTheme();
    if (stored) return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function initThemeToggle(buttonEl) {
    if (!buttonEl) return;
    function render() {
      const eff = effectiveTheme();
      buttonEl.innerHTML = eff === "dark" ? SUN_ICON : MOON_ICON;
      buttonEl.setAttribute("aria-label", eff === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え");
    }
    buttonEl.addEventListener("click", function () {
      setTheme(effectiveTheme() === "dark" ? "light" : "dark");
      render();
    });
    render();
  }

  // ホーム画面に追加してオフラインでも開けるようにするService Worker登録。
  // 対応ブラウザのみ、ページ読み込み完了後に登録する(失敗してもアプリ自体は動く)。
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function (err) {
        console.error("service worker registration failed", err);
      });
    });
  }

  return {
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_BRANCH,
    getToken,
    setToken,
    nowTime,
    getFile,
    putFile,
    isCardioExercise,
    compareExerciseNames,
    muscleGroupForExercise,
    getTheme,
    setTheme,
    effectiveTheme,
    initThemeToggle,
  };
})();
