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
  };
})();
