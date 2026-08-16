(function () {
  "use strict";

  const STORAGE_KEY = "muscleLog.records";
  const EXERCISES_KEY = "muscleLog.exercises";
  const RECORDS_PATH = "data/records.json";
  const EXERCISES_PATH = "data/exercises.json";

  // このブラウザに記録がまだ無いときだけ、初回に読み込まれる過去分の記録。
  const SEED_RECORDS = [{"id":"seed-1","date":"2026-08-15","exercise":"スミスベンチ","weight":60,"reps":8,"sets":1,"memo":""},{"id":"seed-2","date":"2026-08-15","exercise":"スミスベンチ","weight":65,"reps":8,"sets":1,"memo":""},{"id":"seed-3","date":"2026-08-15","exercise":"スミスベンチ","weight":70,"reps":3,"sets":1,"memo":""},{"id":"seed-4","date":"2026-08-15","exercise":"スミスベンチ","weight":75,"reps":2,"sets":1,"memo":""},{"id":"seed-5","date":"2026-08-15","exercise":"スミスサポーテッドロー","weight":35,"reps":8,"sets":3,"memo":""},{"id":"seed-6","date":"2026-08-15","exercise":"バイク","weight":7,"reps":10,"sets":1,"memo":"有酸素"},{"id":"seed-7","date":"2026-08-12","exercise":"バイク","weight":6,"reps":12,"sets":1,"memo":"有酸素"},{"id":"seed-8","date":"2026-08-12","exercise":"スミスベンチ","weight":50,"reps":8,"sets":1,"memo":""},{"id":"seed-9","date":"2026-08-12","exercise":"スミスベンチ","weight":60,"reps":8,"sets":1,"memo":""},{"id":"seed-10","date":"2026-08-12","exercise":"スミスベンチ","weight":70,"reps":4,"sets":1,"memo":""},{"id":"seed-11","date":"2026-08-12","exercise":"スミスベンチ","weight":70,"reps":5,"sets":1,"memo":""},{"id":"seed-12","date":"2026-08-12","exercise":"スミスベンチ","weight":70,"reps":4,"sets":1,"memo":""},{"id":"seed-13","date":"2026-08-12","exercise":"スミスサポーテッドロー","weight":30,"reps":8,"sets":3,"memo":""},{"id":"seed-14","date":"2026-08-12","exercise":"スミスアームカール","weight":20,"reps":10,"sets":1,"memo":""},{"id":"seed-15","date":"2026-08-12","exercise":"スミスアームカール","weight":25,"reps":10,"sets":1,"memo":""},{"id":"seed-16","date":"2026-08-12","exercise":"スミスアームカール","weight":30,"reps":12,"sets":1,"memo":""},{"id":"seed-17","date":"2026-08-08","exercise":"スミスベンチ","weight":50,"reps":8,"sets":1,"memo":""},{"id":"seed-18","date":"2026-08-08","exercise":"スミスベンチ","weight":65,"reps":8,"sets":1,"memo":""},{"id":"seed-19","date":"2026-08-08","exercise":"スミスベンチ","weight":65,"reps":5,"sets":1,"memo":""},{"id":"seed-20","date":"2026-08-08","exercise":"スミスベンチ","weight":60,"reps":10,"sets":1,"memo":""},{"id":"seed-21","date":"2026-08-08","exercise":"スミスベントオーバーロー","weight":52.5,"reps":8,"sets":3,"memo":""},{"id":"seed-22","date":"2026-08-05","exercise":"スミスベンチ","weight":60,"reps":8,"sets":2,"memo":""},{"id":"seed-23","date":"2026-08-05","exercise":"スミスベンチ","weight":60,"reps":6,"sets":1,"memo":""},{"id":"seed-24","date":"2026-08-05","exercise":"スミスベンチ","weight":60,"reps":4,"sets":1,"memo":""},{"id":"seed-25","date":"2026-08-05","exercise":"スミスベントオーバーロー","weight":52.5,"reps":8,"sets":3,"memo":""},{"id":"seed-26","date":"2026-08-05","exercise":"スミスアームカール","weight":20,"reps":10,"sets":2,"memo":""},{"id":"seed-27","date":"2026-08-02","exercise":"バイク","weight":5,"reps":10,"sets":1,"memo":"有酸素"},{"id":"seed-28","date":"2026-08-02","exercise":"スミスベンチ","weight":60,"reps":8,"sets":1,"memo":""},{"id":"seed-29","date":"2026-08-02","exercise":"スミスベンチ","weight":65,"reps":8,"sets":1,"memo":""},{"id":"seed-30","date":"2026-08-02","exercise":"スミスベンチ","weight":65,"reps":5,"sets":1,"memo":""},{"id":"seed-31","date":"2026-08-02","exercise":"スミスベンチ","weight":62.5,"reps":8,"sets":1,"memo":""},{"id":"seed-32","date":"2026-08-02","exercise":"スミスベンチ","weight":62.5,"reps":2,"sets":1,"memo":""},{"id":"seed-33","date":"2026-08-02","exercise":"スミスベントオーバーロー","weight":52.5,"reps":8,"sets":3,"memo":""},{"id":"seed-34","date":"2026-08-02","exercise":"アームカール","weight":10,"reps":10,"sets":2,"memo":""},{"id":"seed-35","date":"2026-07-25","exercise":"バイク","weight":5,"reps":11,"sets":1,"memo":"有酸素"},{"id":"seed-36","date":"2026-07-25","exercise":"スミスベンチ","weight":50,"reps":5,"sets":1,"memo":""},{"id":"seed-37","date":"2026-07-25","exercise":"スミスベンチ","weight":65,"reps":7,"sets":1,"memo":""},{"id":"seed-38","date":"2026-07-25","exercise":"スミスベンチ","weight":70,"reps":3,"sets":1,"memo":""},{"id":"seed-39","date":"2026-07-25","exercise":"スミスベンチ","weight":62.5,"reps":6,"sets":1,"memo":""},{"id":"seed-40","date":"2026-07-25","exercise":"スミスベンチ","weight":60,"reps":7,"sets":1,"memo":""},{"id":"seed-41","date":"2026-07-25","exercise":"ジャンプ","weight":0,"reps":10,"sets":1,"memo":"有酸素"},{"id":"seed-42","date":"2026-07-25","exercise":"スミスベントオーバーロー","weight":50,"reps":8,"sets":3,"memo":""},{"id":"seed-43","date":"2026-07-25","exercise":"アームカール","weight":10,"reps":10,"sets":2,"memo":""}];
  const SEED_EXERCISES = ["アームカール", "ジャンプ", "スミスアームカール", "スミスサポーテッドロー", "スミスベンチ", "スミスベントオーバーロー", "バイク"];

  const METRIC_CONFIG = {
    volume: { label: "ボリューム", unit: "kg", getValue: (p) => p.volume },
    weight: { label: "最大重量", unit: "kg", getValue: (p) => p.maxWeight },
    reps: { label: "総回数", unit: "回", getValue: (p) => p.totalReps },
    sets: { label: "総セット数", unit: "セット", getValue: (p) => p.totalSets },
  };

  /** @type {{id:string,date:string,exercise:string,weight:number,reps:number,sets:number,memo:string}[]} */
  let records = loadRecords();
  /** @type {string[]} */
  let exercises = loadExercises();
  let currentChartPoints = [];
  let recordsSha = null;
  let exercisesSha = null;

  const form = document.getElementById("record-form");
  const dateInput = document.getElementById("date");
  const exerciseInput = document.getElementById("exercise");
  const noExerciseHint = document.getElementById("no-exercise-hint");
  const addRecordBtn = document.getElementById("add-record-btn");
  const weightInput = document.getElementById("weight");
  const repsInput = document.getElementById("reps");
  const memoInput = document.getElementById("memo");
  const filterExercise = document.getElementById("filter-exercise");
  const chartExercise = document.getElementById("chart-exercise");
  const chartMetric = document.getElementById("chart-metric");
  const historyList = document.getElementById("history-list");
  const statTiles = document.getElementById("stat-tiles");
  const chartSvg = document.getElementById("progress-chart");
  const chartEmpty = document.getElementById("chart-empty");
  const chartTooltip = document.getElementById("chart-tooltip");
  const importText = document.getElementById("import-text");
  const importBtn = document.getElementById("import-btn");
  const importResult = document.getElementById("import-result");
  const githubTokenInput = document.getElementById("github-token");
  const githubSaveBtn = document.getElementById("github-save-btn");
  const githubDisconnectBtn = document.getElementById("github-disconnect-btn");
  const syncStatus = document.getElementById("sync-status");

  dateInput.value = todayISO();

  githubTokenInput.value = MuscleSync.getToken();
  if (githubTokenInput.value) {
    syncFromGithub();
    syncExercisesFromGithub();
  }

  githubSaveBtn.addEventListener("click", function () {
    const token = githubTokenInput.value.trim();
    if (!token) {
      setSyncStatus("トークンを入力してください", true);
      return;
    }
    MuscleSync.setToken(token);
    recordsSha = null;
    exercisesSha = null;
    syncFromGithub();
    syncExercisesFromGithub();
  });

  githubDisconnectBtn.addEventListener("click", function () {
    MuscleSync.setToken("");
    githubTokenInput.value = "";
    recordsSha = null;
    exercisesSha = null;
    setSyncStatus("GitHub同期: 無効（この端末内にのみ保存されます）");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const record = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random(),
      date: dateInput.value,
      exercise: exerciseInput.value,
      weight: parseFloat(weightInput.value),
      reps: parseInt(repsInput.value, 10),
      sets: 1,
      memo: memoInput.value.trim(),
    };
    if (!record.date || !record.exercise || isNaN(record.weight) || isNaN(record.reps)) {
      return;
    }
    records.push(record);
    saveRecords();
    pushToGithub({ type: "add", record });

    const keepExercise = record.exercise;
    form.reset();
    dateInput.value = record.date;

    renderAll({ selectExerciseForChart: record.exercise, keepFormExercise: keepExercise });
  });

  historyList.addEventListener("click", function (e) {
    const target = e.target.closest(".set-chip-delete");
    if (!target) return;
    const id = target.dataset.id;
    records = records.filter((r) => r.id !== id);
    saveRecords();
    pushToGithub({ type: "delete", id });
    renderAll();
  });

  filterExercise.addEventListener("change", renderHistory);
  chartExercise.addEventListener("change", renderChart);
  chartMetric.addEventListener("change", renderChart);

  importBtn.addEventListener("click", function () {
    const { parsed, warnings } = parseBulkLog(importText.value);
    if (parsed.length) {
      // exercises との比較は records に concat する前に行う
      // (records にはすでに反映済みという理由で登録漏れになるのを防ぐため)
      const existingNames = new Set(exercises);
      const newNames = Array.from(new Set(parsed.map((r) => r.exercise))).filter((n) => !existingNames.has(n));

      records = records.concat(parsed);
      saveRecords();
      pushToGithub({ type: "add-many", records: parsed });

      if (newNames.length) {
        exercises = exercises.concat(newNames);
        saveExercises();
        pushExercisesToGithub({ type: "add-many", names: newNames });
      }

      renderAll();
    }
    renderImportResult(parsed.length, warnings);
    if (parsed.length && !warnings.length) {
      importText.value = "";
    }
  });

  function renderImportResult(count, warnings) {
    importResult.hidden = false;
    const successHtml = count
      ? `<p class="import-success">${count}件を追加しました</p>`
      : `<p class="import-success" style="color:var(--status-critical)">取り込める記録が見つかりませんでした</p>`;
    const warningsHtml = warnings.length
      ? `<ul class="import-warnings">${warnings.map((w) => `<li>${escapeHtml(w)}</li>`).join("")}</ul>`
      : "";
    importResult.innerHTML = successHtml + warningsHtml;
  }

  // 「YYMMDD場所」の見出し行 + 「種目名 重量-回数, 重量-回数, .../」形式のテキストを
  // records と同じ形の配列にパースする。同じ重量・回数が連続する行は sets にまとめる。
  function parseBulkLog(text) {
    const parsed = [];
    const warnings = [];
    const blocks = text.trim().split(/\n\s*\n/).filter((b) => b.trim());

    blocks.forEach((block) => {
      const lines = block
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      if (!lines.length) return;

      const headerMatch = lines[0].match(/^(\d{2})(\d{2})(\d{2})/);
      if (!headerMatch) {
        warnings.push(`日付を認識できませんでした: "${lines[0]}"`);
        return;
      }
      const date = `20${headerMatch[1]}-${headerMatch[2]}-${headerMatch[3]}`;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].replace(/\/\s*$/, "").trim();
        if (!line) continue;

        const nameMatch = line.match(/^([^\d]+)/);
        if (!nameMatch) {
          warnings.push(`種目名を認識できませんでした: "${line}" (${date})`);
          continue;
        }
        const exercise = nameMatch[1].trim();
        const tokens = line
          .slice(nameMatch[0].length)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        if (!tokens.length) {
          warnings.push(`重量・回数を認識できませんでした: "${line}" (${date})`);
          continue;
        }

        const sets = [];
        tokens.forEach((tok) => {
          let m;
          if ((m = tok.match(/^(\d+(?:\.\d+)?)-(\d+)$/))) {
            sets.push({ weight: parseFloat(m[1]), reps: parseInt(m[2], 10) });
          } else if ((m = tok.match(/^(\d+(?:\.\d+)?)$/))) {
            sets.push({ weight: 0, reps: parseInt(m[1], 10) });
          } else {
            warnings.push(`認識できないデータを除外しました: "${exercise} ${tok}" (${date})`);
          }
        });

        const isCardio = /バイク|ジャンプ|ラン|エアロ|有酸素/.test(exercise);
        let idx = 0;
        while (idx < sets.length) {
          let end = idx + 1;
          while (end < sets.length && sets[end].weight === sets[idx].weight && sets[end].reps === sets[idx].reps) {
            end++;
          }
          parsed.push({
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}-${idx}`,
            date,
            exercise,
            weight: sets[idx].weight,
            reps: sets[idx].reps,
            sets: end - idx,
            memo: isCardio ? "有酸素" : "",
          });
          idx = end;
        }
      }
    });

    return { parsed, warnings };
  }

  function loadRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_RECORDS));
      return SEED_RECORDS.slice();
    } catch (err) {
      return [];
    }
  }

  function saveRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

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

  function saveExercises() {
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  }

  function nowTime() {
    return MuscleSync.nowTime();
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
      const result = await MuscleSync.getFile(token, RECORDS_PATH);
      if (!result.exists) {
        const sha = await MuscleSync.putFile(token, RECORDS_PATH, records, null, "Initial records sync");
        recordsSha = sha;
        setSyncStatus(`GitHub同期: 有効（この端末の記録で初期化しました・${nowTime()}）`, false, true);
      } else {
        records = result.data;
        recordsSha = result.sha;
        saveRecords();
        renderAll();
        setSyncStatus(`GitHub同期: 有効（最終同期 ${nowTime()}）`, false, true);
      }
    } catch (err) {
      setSyncStatus(`GitHub同期エラー: ${err.message}`, true);
    }
  }

  // 競合(409)時、直前の自分の変更(pendingChange)を最新のリモートに再適用してから
  // もう一度だけ保存を試みる。何もしないと自分がいま行った追加/削除が消えてしまうため。
  function applyPendingChange(baseRecords, pendingChange) {
    if (!pendingChange) return baseRecords.slice();
    if (pendingChange.type === "add") {
      if (baseRecords.some((r) => r.id === pendingChange.record.id)) return baseRecords.slice();
      return baseRecords.concat([pendingChange.record]);
    }
    if (pendingChange.type === "add-many") {
      const existingIds = new Set(baseRecords.map((r) => r.id));
      return baseRecords.concat(pendingChange.records.filter((r) => !existingIds.has(r.id)));
    }
    if (pendingChange.type === "delete") {
      return baseRecords.filter((r) => r.id !== pendingChange.id);
    }
    return baseRecords.slice();
  }

  async function pushToGithub(pendingChange) {
    const token = MuscleSync.getToken();
    if (!token) return;
    try {
      const sha = await MuscleSync.putFile(token, RECORDS_PATH, records, recordsSha, "Update muscle training records");
      recordsSha = sha;
      setSyncStatus(`GitHub同期: 有効（最終同期 ${nowTime()}）`, false, true);
    } catch (err) {
      if (err.conflict) {
        try {
          const result = await MuscleSync.getFile(token, RECORDS_PATH);
          records = applyPendingChange(result.data, pendingChange);
          saveRecords();
          renderAll();
          const sha2 = await MuscleSync.putFile(token, RECORDS_PATH, records, result.sha, "Update muscle training records (merged)");
          recordsSha = sha2;
          setSyncStatus(`GitHub同期: 有効（他の端末の更新と統合しました・${nowTime()}）`, false, true);
        } catch (err2) {
          setSyncStatus(`GitHub同期エラー: ${err2.message}`, true);
        }
      } else {
        setSyncStatus(`GitHub同期エラー: ${err.message}`, true);
      }
    }
  }

  async function syncExercisesFromGithub() {
    const token = MuscleSync.getToken();
    if (!token) return;
    try {
      const result = await MuscleSync.getFile(token, EXERCISES_PATH);
      if (!result.exists) {
        const sha = await MuscleSync.putFile(token, EXERCISES_PATH, exercises, null, "Initial exercise list sync");
        exercisesSha = sha;
      } else {
        exercises = result.data;
        exercisesSha = result.sha;
        saveExercises();
        renderAll();
      }
    } catch (err) {
      // 種目リストの同期エラーは記録の同期ステータス表示を上書きしないよう静かに失敗させる。
      console.error("exercises sync failed", err);
    }
  }

  function applyPendingExerciseChange(baseNames, pendingChange) {
    if (!pendingChange) return baseNames.slice();
    if (pendingChange.type === "add") {
      return baseNames.includes(pendingChange.name) ? baseNames.slice() : baseNames.concat([pendingChange.name]);
    }
    if (pendingChange.type === "add-many") {
      const existing = new Set(baseNames);
      return baseNames.concat(pendingChange.names.filter((n) => !existing.has(n)));
    }
    if (pendingChange.type === "delete") {
      return baseNames.filter((n) => n !== pendingChange.name);
    }
    return baseNames.slice();
  }

  async function pushExercisesToGithub(pendingChange) {
    const token = MuscleSync.getToken();
    if (!token) return;
    try {
      const sha = await MuscleSync.putFile(token, EXERCISES_PATH, exercises, exercisesSha, "Update exercise list");
      exercisesSha = sha;
    } catch (err) {
      if (err.conflict) {
        try {
          const result = await MuscleSync.getFile(token, EXERCISES_PATH);
          exercises = applyPendingExerciseChange(result.data, pendingChange);
          saveExercises();
          renderAll();
          const sha2 = await MuscleSync.putFile(token, EXERCISES_PATH, exercises, result.sha, "Update exercise list (merged)");
          exercisesSha = sha2;
        } catch (err2) {
          console.error("exercises sync failed", err2);
        }
      } else {
        console.error("exercises sync failed", err);
      }
    }
  }

  function todayISO() {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 10);
  }

  // 記録画面の追加フォーム用: 登録済み種目 と これまで記録した種目 の両方を含む
  function getAllExerciseNames() {
    const set = new Set(exercises);
    records.forEach((r) => set.add(r.exercise));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ja"));
  }

  // 概要・絞り込み・グラフ用: 実際に記録がある種目のみ
  function getUsedExerciseNames() {
    const set = new Set(records.map((r) => r.exercise));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ja"));
  }

  function renderAll(opts) {
    opts = opts || {};
    renderExerciseOptions(opts);
    renderStats();
    renderHistory();
    renderChart();
  }

  function renderExerciseOptions(opts) {
    opts = opts || {};
    const allNames = getAllExerciseNames();
    const prevFormValue = opts.keepFormExercise !== undefined ? opts.keepFormExercise : exerciseInput.value;

    noExerciseHint.hidden = allNames.length > 0;
    addRecordBtn.disabled = allNames.length === 0;
    exerciseInput.disabled = allNames.length === 0;

    const placeholder = allNames.length
      ? '<option value="" disabled>種目を選択</option>'
      : '<option value="" disabled>まず種目を追加してください</option>';
    exerciseInput.innerHTML = placeholder + allNames.map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join("");
    exerciseInput.value = allNames.includes(prevFormValue) ? prevFormValue : "";

    const usedNames = getUsedExerciseNames();

    const prevFilter = filterExercise.value;
    filterExercise.innerHTML =
      '<option value="">すべての種目</option>' + usedNames.map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join("");
    if (usedNames.includes(prevFilter)) filterExercise.value = prevFilter;

    const prevChart = chartExercise.value;
    chartExercise.innerHTML = usedNames.map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join("");
    if (opts.selectExerciseForChart && usedNames.includes(opts.selectExerciseForChart)) {
      chartExercise.value = opts.selectExerciseForChart;
    } else if (usedNames.includes(prevChart)) {
      chartExercise.value = prevChart;
    } else if (usedNames.length) {
      chartExercise.value = usedNames[usedNames.length - 1];
    }
  }

  function renderStats() {
    const totalRecords = records.length;
    const exerciseCount = getUsedExerciseNames().length;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const recentDates = new Set(
      records.filter((r) => new Date(r.date + "T00:00:00") >= sevenDaysAgo).map((r) => r.date)
    );

    statTiles.innerHTML = `
      <div class="stat-tile">
        <div class="value">${totalRecords}</div>
        <div class="label">総記録数</div>
      </div>
      <div class="stat-tile">
        <div class="value">${exerciseCount}</div>
        <div class="label">種目数</div>
      </div>
      <div class="stat-tile">
        <div class="value">${recentDates.size}</div>
        <div class="label">直近7日の実施日</div>
      </div>
    `;
  }

  function setLabel(r) {
    return `${r.weight}kg×${r.reps}回${r.sets > 1 ? `×${r.sets}set` : ""}`;
  }

  function renderHistory() {
    const filtered = filterExercise.value
      ? records.filter((r) => r.exercise === filterExercise.value)
      : records;

    if (!filtered.length) {
      historyList.innerHTML = '<p class="empty-message">記録がまだありません</p>';
      return;
    }

    const byDate = new Map();
    filtered.forEach((r) => {
      if (!byDate.has(r.date)) byDate.set(r.date, []);
      byDate.get(r.date).push(r);
    });

    const dates = Array.from(byDate.keys()).sort((a, b) => b.localeCompare(a));

    historyList.innerHTML = dates
      .map((date) => {
        const dayRecords = byDate.get(date);
        const dayVolume = dayRecords.reduce((sum, r) => sum + r.weight * r.reps * r.sets, 0);

        const byExercise = new Map();
        dayRecords.forEach((r) => {
          if (!byExercise.has(r.exercise)) byExercise.set(r.exercise, []);
          byExercise.get(r.exercise).push(r);
        });

        const exerciseGroups = Array.from(byExercise.entries())
          .map(([exercise, recs]) => {
            const chips = recs
              .map(
                (r) => `
              <span class="set-chip">
                <span class="set-chip-text">${setLabel(r)}</span>
                <button class="set-chip-delete" data-id="${r.id}" aria-label="この記録を削除">×</button>
              </span>
            `
              )
              .join("");
            const exerciseVolume = recs.reduce((sum, r) => sum + r.weight * r.reps * r.sets, 0);
            const memoRecord = recs.find((r) => r.memo);

            return `
              <div class="exercise-group">
                <div class="exercise-group-header">
                  <span class="exercise-group-name">${escapeHtml(exercise)}</span>
                  ${exerciseVolume > 0 ? `<span class="volume-badge">Vol ${Math.round(exerciseVolume)}</span>` : ""}
                </div>
                <div class="set-chip-row">${chips}</div>
                ${memoRecord ? `<span class="record-memo">${escapeHtml(memoRecord.memo)}</span>` : ""}
              </div>
            `;
          })
          .join("");

        return `
          <div class="day-card">
            <div class="day-card-header">
              <h3>${formatDate(date)}</h3>
              ${dayVolume > 0 ? `<span class="volume-badge volume-badge-day">合計Vol ${Math.round(dayVolume)}</span>` : ""}
            </div>
            ${exerciseGroups}
          </div>
        `;
      })
      .join("");
  }

  function computeChartData(exercise) {
    const byDate = new Map();
    records
      .filter((r) => r.exercise === exercise)
      .forEach((r) => {
        if (!byDate.has(r.date)) {
          byDate.set(r.date, { date: r.date, maxWeight: 0, totalReps: 0, totalSets: 0, volume: 0, segments: [] });
        }
        const entry = byDate.get(r.date);
        entry.maxWeight = Math.max(entry.maxWeight, r.weight);
        entry.totalReps += r.reps * r.sets;
        entry.totalSets += r.sets;
        entry.volume += r.weight * r.reps * r.sets;
        entry.segments.push(setLabel(r));
      });
    return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  function renderChart() {
    const exercise = chartExercise.value;
    const metricKey = chartMetric.value || "volume";
    const metric = METRIC_CONFIG[metricKey] || METRIC_CONFIG.volume;
    const points = computeChartData(exercise);
    currentChartPoints = points;

    if (!points.length) {
      chartSvg.style.display = "none";
      chartEmpty.style.display = "block";
      chartSvg.innerHTML = "";
      return;
    }

    chartEmpty.style.display = "none";
    chartSvg.style.display = "block";

    const width = 640;
    const height = 260;
    const margin = { top: 16, right: 16, bottom: 32, left: 48 };
    const plotW = width - margin.left - margin.right;
    const plotH = height - margin.top - margin.bottom;

    const values = points.map((p) => metric.getValue(p));
    let minV = Math.min(...values);
    let maxV = Math.max(...values);
    if (minV === maxV) {
      minV -= 1;
      maxV += 1;
    }
    const pad = (maxV - minV) * 0.15;
    minV -= pad;
    maxV += pad;

    const xFor = (i) => (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
    const yFor = (v) => plotH - ((v - minV) / (maxV - minV)) * plotH;

    const gridCount = 4;
    let gridlines = "";
    let axisLabels = "";
    for (let i = 0; i <= gridCount; i++) {
      const v = minV + ((maxV - minV) * i) / gridCount;
      const y = yFor(v);
      gridlines += `<line class="chart-gridline" x1="0" y1="${y}" x2="${plotW}" y2="${y}"></line>`;
      axisLabels += `<text class="chart-axis-label" x="-8" y="${y + 3}" text-anchor="end">${Math.round(v)}</text>`;
    }

    const pathD = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(i).toFixed(1)} ${yFor(metric.getValue(p)).toFixed(1)}`)
      .join(" ");

    const labelStep = Math.max(1, Math.ceil(points.length / 6));
    let dateLabels = "";
    points.forEach((p, i) => {
      if (i % labelStep === 0 || i === points.length - 1) {
        dateLabels += `<text class="chart-axis-label" x="${xFor(i)}" y="${plotH + 20}" text-anchor="middle">${formatShortDate(p.date)}</text>`;
      }
    });

    const circles = points
      .map(
        (p, i) => `<circle class="chart-point" cx="${xFor(i).toFixed(1)}" cy="${yFor(metric.getValue(p)).toFixed(1)}" r="4"
          data-index="${i}"></circle>`
      )
      .join("");

    chartSvg.innerHTML = `
      <g transform="translate(${margin.left},${margin.top})">
        ${gridlines}
        <line class="chart-baseline" x1="0" y1="${plotH}" x2="${plotW}" y2="${plotH}"></line>
        ${axisLabels}
        ${dateLabels}
        <path class="chart-line" d="${pathD}"></path>
        ${circles}
      </g>
    `;

    chartSvg.querySelectorAll(".chart-point").forEach((circle) => {
      circle.addEventListener("mouseenter", showTooltip);
      circle.addEventListener("mousemove", showTooltip);
      circle.addEventListener("mouseleave", hideTooltip);
      circle.addEventListener("touchstart", showTooltip, { passive: true });
    });
  }

  function showTooltip(e) {
    const circle = e.target;
    const index = parseInt(circle.getAttribute("data-index"), 10);
    const p = currentChartPoints[index];
    if (!p) return;

    const svgRect = chartSvg.getBoundingClientRect();
    const cx = parseFloat(circle.getAttribute("cx"));
    const cy = parseFloat(circle.getAttribute("cy"));
    const margin = { left: 48, top: 16 };
    const scaleX = svgRect.width / 640;
    const scaleY = svgRect.height / 260;

    chartTooltip.innerHTML = `
      <div class="tooltip-date">${formatDate(p.date)}</div>
      <div class="tooltip-row">ボリューム: ${Math.round(p.volume)}kg</div>
      <div class="tooltip-row">最大重量: ${p.maxWeight}kg／総回数: ${p.totalReps}回／総セット: ${p.totalSets}</div>
      <div class="tooltip-detail">${escapeHtml(p.segments.join(", "))}</div>
    `;
    chartTooltip.style.left = `${(cx + margin.left) * scaleX}px`;
    chartTooltip.style.top = `${(cy + margin.top) * scaleY}px`;
    chartTooltip.hidden = false;
  }

  function hideTooltip() {
    chartTooltip.hidden = true;
  }

  function formatDate(iso) {
    const [y, m, d] = iso.split("-");
    return `${y}/${m}/${d}`;
  }

  function formatShortDate(iso) {
    const [, m, d] = iso.split("-");
    return `${m}/${d}`;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  renderAll();
})();
