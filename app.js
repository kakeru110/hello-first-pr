(function () {
  "use strict";

  const STORAGE_KEY = "muscleLog.records";

  /** @type {{id:string,date:string,exercise:string,weight:number,reps:number,sets:number,memo:string}[]} */
  let records = loadRecords();

  const form = document.getElementById("record-form");
  const dateInput = document.getElementById("date");
  const exerciseInput = document.getElementById("exercise");
  const weightInput = document.getElementById("weight");
  const repsInput = document.getElementById("reps");
  const setsInput = document.getElementById("sets");
  const memoInput = document.getElementById("memo");
  const exerciseOptions = document.getElementById("exercise-options");
  const filterExercise = document.getElementById("filter-exercise");
  const chartExercise = document.getElementById("chart-exercise");
  const historyList = document.getElementById("history-list");
  const statTiles = document.getElementById("stat-tiles");
  const chartSvg = document.getElementById("progress-chart");
  const chartEmpty = document.getElementById("chart-empty");
  const chartTooltip = document.getElementById("chart-tooltip");
  const chartContainer = document.getElementById("chart-container");

  dateInput.value = todayISO();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const record = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random(),
      date: dateInput.value,
      exercise: exerciseInput.value.trim(),
      weight: parseFloat(weightInput.value),
      reps: parseInt(repsInput.value, 10),
      sets: parseInt(setsInput.value, 10),
      memo: memoInput.value.trim(),
    };
    if (!record.date || !record.exercise || isNaN(record.weight) || isNaN(record.reps) || isNaN(record.sets)) {
      return;
    }
    records.push(record);
    saveRecords();

    const keepExercise = exerciseInput.value;
    form.reset();
    dateInput.value = record.date;
    exerciseInput.value = keepExercise;
    setsInput.value = "1";

    renderAll({ selectExerciseForChart: record.exercise });
  });

  historyList.addEventListener("click", function (e) {
    const target = e.target.closest(".delete-btn");
    if (!target) return;
    const id = target.dataset.id;
    records = records.filter((r) => r.id !== id);
    saveRecords();
    renderAll();
  });

  filterExercise.addEventListener("change", renderHistory);
  chartExercise.addEventListener("change", renderChart);

  function loadRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function saveRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  function todayISO() {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 10);
  }

  function getExerciseNames() {
    const set = new Set(records.map((r) => r.exercise));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ja"));
  }

  function renderAll(opts) {
    opts = opts || {};
    renderExerciseOptions(opts.selectExerciseForChart);
    renderStats();
    renderHistory();
    renderChart();
  }

  function renderExerciseOptions(preferredForChart) {
    const names = getExerciseNames();

    exerciseOptions.innerHTML = names.map((n) => `<option value="${escapeHtml(n)}"></option>`).join("");

    const prevFilter = filterExercise.value;
    filterExercise.innerHTML =
      '<option value="">すべての種目</option>' + names.map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join("");
    if (names.includes(prevFilter)) filterExercise.value = prevFilter;

    const prevChart = chartExercise.value;
    chartExercise.innerHTML = names.map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join("");
    if (preferredForChart && names.includes(preferredForChart)) {
      chartExercise.value = preferredForChart;
    } else if (names.includes(prevChart)) {
      chartExercise.value = prevChart;
    } else if (names.length) {
      chartExercise.value = names[names.length - 1];
    }
  }

  function renderStats() {
    const totalRecords = records.length;
    const exerciseCount = getExerciseNames().length;

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
        const items = byDate
          .get(date)
          .slice()
          .reverse()
          .map(
            (r) => `
          <div class="record-item">
            <div class="record-main">
              <span class="record-exercise">${escapeHtml(r.exercise)}</span>
              <span class="record-detail">${r.weight}kg × ${r.reps}回 × ${r.sets}セット</span>
              ${r.memo ? `<span class="record-memo">${escapeHtml(r.memo)}</span>` : ""}
            </div>
            <button class="delete-btn" data-id="${r.id}" aria-label="削除">削除</button>
          </div>
        `
          )
          .join("");
        return `
          <div class="day-group">
            <h3>${formatDate(date)}</h3>
            ${items}
          </div>
        `;
      })
      .join("");
  }

  function renderChart() {
    const exercise = chartExercise.value;
    const points = records
      .filter((r) => r.exercise === exercise)
      .reduce((acc, r) => {
        const existing = acc.find((p) => p.date === r.date);
        if (existing) {
          existing.weight = Math.max(existing.weight, r.weight);
        } else {
          acc.push({ date: r.date, weight: r.weight });
        }
        return acc;
      }, [])
      .sort((a, b) => a.date.localeCompare(b.date));

    if (points.length < 1) {
      chartSvg.style.display = "none";
      chartEmpty.style.display = "block";
      chartSvg.innerHTML = "";
      return;
    }

    chartEmpty.style.display = "none";
    chartSvg.style.display = "block";

    const width = 640;
    const height = 260;
    const margin = { top: 16, right: 16, bottom: 32, left: 40 };
    const plotW = width - margin.left - margin.right;
    const plotH = height - margin.top - margin.bottom;

    const weights = points.map((p) => p.weight);
    let minW = Math.min(...weights);
    let maxW = Math.max(...weights);
    if (minW === maxW) {
      minW -= 1;
      maxW += 1;
    }
    const pad = (maxW - minW) * 0.15;
    minW -= pad;
    maxW += pad;

    const xFor = (i) => (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
    const yFor = (w) => plotH - ((w - minW) / (maxW - minW)) * plotH;

    const gridCount = 4;
    let gridlines = "";
    let axisLabels = "";
    for (let i = 0; i <= gridCount; i++) {
      const w = minW + ((maxW - minW) * i) / gridCount;
      const y = yFor(w);
      gridlines += `<line class="chart-gridline" x1="0" y1="${y}" x2="${plotW}" y2="${y}"></line>`;
      axisLabels += `<text class="chart-axis-label" x="-8" y="${y + 3}" text-anchor="end">${w.toFixed(1)}</text>`;
    }

    const pathD = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(i).toFixed(1)} ${yFor(p.weight).toFixed(1)}`)
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
        (p, i) => `<circle class="chart-point" cx="${xFor(i).toFixed(1)}" cy="${yFor(p.weight).toFixed(1)}" r="4"
          data-date="${p.date}" data-weight="${p.weight}"></circle>`
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
    const date = circle.getAttribute("data-date");
    const weight = circle.getAttribute("data-weight");
    const svgRect = chartSvg.getBoundingClientRect();
    const cx = parseFloat(circle.getAttribute("cx"));
    const cy = parseFloat(circle.getAttribute("cy"));
    const margin = { left: 40, top: 16 };
    const scaleX = svgRect.width / 640;
    const scaleY = svgRect.height / 260;

    chartTooltip.textContent = `${formatDate(date)}: ${weight}kg`;
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
