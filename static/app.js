const RULES_STORAGE_KEY = "mahjongRules";

const ruleKuitan = document.getElementById("rule-kuitan");
const ruleAkaDora = document.getElementById("rule-aka-dora");
const ruleKazoeLimit = document.getElementById("rule-kazoe-limit");

const imageInput = document.getElementById("image-input");
const imagePreview = document.getElementById("image-preview");
const recognizeBtn = document.getElementById("recognize-btn");
const recognizeStatus = document.getElementById("recognize-status");

const concealedTilesInput = document.getElementById("concealed-tiles");
const winTileInput = document.getElementById("win-tile");
const meldsContainer = document.getElementById("melds-container");
const addMeldBtn = document.getElementById("add-meld-btn");
const meldTemplate = document.getElementById("meld-template");

const calculateBtn = document.getElementById("calculate-btn");
const resultEl = document.getElementById("result");

function loadRules() {
  const saved = JSON.parse(localStorage.getItem(RULES_STORAGE_KEY) || "{}");
  ruleKuitan.value = saved.kuitan ?? "true";
  ruleAkaDora.value = saved.akaDora ?? "true";
  ruleKazoeLimit.value = saved.kazoeLimit ?? "0";
}

function saveRules() {
  localStorage.setItem(
    RULES_STORAGE_KEY,
    JSON.stringify({
      kuitan: ruleKuitan.value,
      akaDora: ruleAkaDora.value,
      kazoeLimit: ruleKazoeLimit.value,
    })
  );
}

[ruleKuitan, ruleAkaDora, ruleKazoeLimit].forEach((el) => {
  el.addEventListener("change", saveRules);
});

loadRules();

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) {
    imagePreview.hidden = true;
    return;
  }
  imagePreview.src = URL.createObjectURL(file);
  imagePreview.hidden = false;
});

recognizeBtn.addEventListener("click", async () => {
  const file = imageInput.files[0];
  if (!file) {
    setStatus(recognizeStatus, "写真を選択してください", "error");
    return;
  }

  setStatus(recognizeStatus, "読み取り中...", "");
  recognizeBtn.disabled = true;

  try {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/recognize", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setStatus(recognizeStatus, data.error || "読み取りに失敗しました", "error");
      return;
    }

    concealedTilesInput.value = data.tiles.join(" ");
    setStatus(
      recognizeStatus,
      `${data.tiles.length}枚を読み取りました。上がり牌を「上がり牌」欄に移動してください。`,
      "ok"
    );
  } catch (err) {
    setStatus(recognizeStatus, `通信エラー: ${err.message}`, "error");
  } finally {
    recognizeBtn.disabled = false;
  }
});

function setStatus(el, message, kind) {
  el.textContent = message;
  el.className = "status" + (kind ? ` ${kind}` : "");
}

addMeldBtn.addEventListener("click", () => addMeldRow());

function addMeldRow() {
  const fragment = meldTemplate.content.cloneNode(true);
  const row = fragment.querySelector(".meld-row");
  row.querySelector(".remove-meld").addEventListener("click", () => row.remove());
  meldsContainer.appendChild(row);
}

function parseTiles(text) {
  return (text || "")
    .trim()
    .split(/[\s,、]+/)
    .filter(Boolean)
    .map((t) => t.toLowerCase());
}

function collectMelds() {
  return Array.from(meldsContainer.querySelectorAll(".meld-row")).map((row) => {
    const tiles = parseTiles(row.querySelector(".meld-tiles").value);
    const opened = row.querySelector(".meld-opened-checkbox").checked;
    return { tiles, opened };
  });
}

calculateBtn.addEventListener("click", async () => {
  const payload = {
    concealed_tiles: parseTiles(concealedTilesInput.value),
    win_tile: winTileInput.value.trim().toLowerCase(),
    melds: collectMelds(),
    rules: {
      kuitan: ruleKuitan.value === "true",
      aka_dora: ruleAkaDora.value === "true",
      kazoe_limit: Number(ruleKazoeLimit.value),
    },
    is_tsumo: document.getElementById("win-method").value === "tsumo",
    round_wind: document.getElementById("round-wind").value,
    seat_wind: document.getElementById("seat-wind").value,
    honba: Number(document.getElementById("honba").value) || 0,
    kyotaku: Number(document.getElementById("kyotaku").value) || 0,
    is_riichi: document.getElementById("is-riichi").checked,
    is_daburu_riichi: document.getElementById("is-daburu-riichi").checked,
    is_ippatsu: document.getElementById("is-ippatsu").checked,
    is_rinshan: document.getElementById("is-rinshan").checked,
    is_chankan: document.getElementById("is-chankan").checked,
    is_haitei: document.getElementById("is-haitei").checked,
    is_houtei: document.getElementById("is-houtei").checked,
    dora_indicators: parseTiles(document.getElementById("dora-indicators").value),
    ura_dora_indicators: parseTiles(document.getElementById("ura-dora-indicators").value),
  };

  resultEl.hidden = true;
  calculateBtn.disabled = true;

  try {
    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    renderResult(res.ok, data);
  } catch (err) {
    renderResult(false, { error: `通信エラー: ${err.message}` });
  } finally {
    calculateBtn.disabled = false;
  }
});

function renderResult(ok, data) {
  resultEl.hidden = false;
  if (!ok || data.error) {
    resultEl.className = "card result error";
    resultEl.innerHTML = `<h2>計算できませんでした</h2><p>${escapeHtml(data.error || "不明なエラー")}</p>`;
    return;
  }

  resultEl.className = "card result";
  const yakuList = data.yaku.map((y) => `<li>${escapeHtml(y)}</li>`).join("");
  const cost = data.cost;
  let breakdown = "";
  if (cost.main === cost.additional) {
    breakdown = `${cost.main}点 オール（合計 ${cost.total}点）`;
  } else if (cost.additional > 0) {
    breakdown = `${cost.main}点 / ${cost.additional}点 × 2（合計 ${cost.total}点）`;
  } else {
    breakdown = `合計 ${cost.total}点`;
  }

  resultEl.innerHTML = `
    <h2>結果</h2>
    <p class="points">${data.han}翻 ${data.fu}符</p>
    <p class="breakdown">${breakdown}</p>
    <ul class="yaku-list">${yakuList}</ul>
  `;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
