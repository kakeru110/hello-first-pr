(function () {
  "use strict";

  const EXERCISES_KEY = "muscleLog.exercises";
  const EXERCISES_PATH = "data/exercises.json";
  const SEED_EXERCISES = ["アームカール", "ジャンプ", "スミスアームカール", "スミスサポーテッドロー", "スミスベンチ", "スミスベントオーバーロー", "バイク"];

  let exercises = loadExercises();
  let exercisesSha = null;

  const form = document.getElementById("exercise-form");
  const nameInput = document.getElementById("new-exercise-name");
  const listEl = document.getElementById("exercise-list");
  const countEl = document.getElementById("exercise-count");
  const emptyEl = document.getElementById("exercise-empty");
  const syncStatus = document.getElementById("sync-status");

  render();

  if (MuscleSync.getToken()) {
    syncFromGithub();
  } else {
    setSyncStatus("GitHub同期: 無効（記録画面でトークンを登録すると同期されます）");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (!name) return;
    if (exercises.includes(name)) {
      setSyncStatus(`「${name}」はすでに登録されています`, true);
      return;
    }
    exercises.push(name);
    exercises.sort((a, b) => a.localeCompare(b, "ja"));
    save();
    pushToGithub({ type: "add", name });
    form.reset();
    render();
  });

  listEl.addEventListener("click", function (e) {
    const target = e.target.closest(".delete-btn");
    if (!target) return;
    const name = target.dataset.name;
    exercises = exercises.filter((n) => n !== name);
    save();
    pushToGithub({ type: "delete", name });
    render();
  });

  function loadExercises() {
    try {
      const raw = localStorage.getItem(EXERCISES_KEY);
      if (raw) return JSON.parse(raw);
      localStorage.setItem(EXERCISES_KEY, JSON.stringify(SEED_EXERCISES));
      return SEED_EXERCISES.slice();
    } catch (err) {
      return [];
    }
  }

  function save() {
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  }

  function render() {
    countEl.textContent = exercises.length;
    emptyEl.hidden = exercises.length > 0;
    listEl.innerHTML = exercises
      .map(
        (name) => `
      <div class="record-item">
        <div class="record-main">
          <span class="record-exercise">${escapeHtml(name)}</span>
        </div>
        <button class="delete-btn" data-name="${escapeHtml(name)}" aria-label="削除">削除</button>
      </div>
    `
      )
      .join("");
  }

  function setSyncStatus(text, isError, isOk) {
    syncStatus.textContent = text;
    syncStatus.classList.toggle("sync-error", !!isError);
    syncStatus.classList.toggle("sync-ok", !!isOk && !isError);
  }

  async function syncFromGithub() {
    const token = MuscleSync.getToken();
    if (!token) return;
    setSyncStatus("GitHub同期: 確認中...");
    try {
      const result = await MuscleSync.getFile(token, EXERCISES_PATH);
      if (!result.exists) {
        const sha = await MuscleSync.putFile(token, EXERCISES_PATH, exercises, null, "Initial exercise list sync");
        exercisesSha = sha;
        setSyncStatus(`GitHub同期: 有効（この端末の種目で初期化しました・${MuscleSync.nowTime()}）`, false, true);
      } else {
        exercises = result.data;
        exercisesSha = result.sha;
        save();
        render();
        setSyncStatus(`GitHub同期: 有効（最終同期 ${MuscleSync.nowTime()}）`, false, true);
      }
    } catch (err) {
      setSyncStatus(`GitHub同期エラー: ${err.message}`, true);
    }
  }

  function applyPendingChange(baseNames, pendingChange) {
    if (!pendingChange) return baseNames.slice();
    if (pendingChange.type === "add") {
      return baseNames.includes(pendingChange.name) ? baseNames.slice() : baseNames.concat([pendingChange.name]);
    }
    if (pendingChange.type === "delete") {
      return baseNames.filter((n) => n !== pendingChange.name);
    }
    return baseNames.slice();
  }

  async function pushToGithub(pendingChange) {
    const token = MuscleSync.getToken();
    if (!token) return;
    try {
      const sha = await MuscleSync.putFile(token, EXERCISES_PATH, exercises, exercisesSha, "Update exercise list");
      exercisesSha = sha;
      setSyncStatus(`GitHub同期: 有効（最終同期 ${MuscleSync.nowTime()}）`, false, true);
    } catch (err) {
      if (err.conflict) {
        try {
          const result = await MuscleSync.getFile(token, EXERCISES_PATH);
          exercises = applyPendingChange(result.data, pendingChange);
          exercises.sort((a, b) => a.localeCompare(b, "ja"));
          save();
          render();
          const sha2 = await MuscleSync.putFile(token, EXERCISES_PATH, exercises, result.sha, "Update exercise list (merged)");
          exercisesSha = sha2;
          setSyncStatus(`GitHub同期: 有効（他の端末の更新と統合しました・${MuscleSync.nowTime()}）`, false, true);
        } catch (err2) {
          setSyncStatus(`GitHub同期エラー: ${err2.message}`, true);
        }
      } else {
        setSyncStatus(`GitHub同期エラー: ${err.message}`, true);
      }
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
})();
