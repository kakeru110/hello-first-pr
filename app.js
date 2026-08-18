(function () {
  "use strict";

  const STORAGE_KEY = "muscleLog.records";
  const EXERCISES_KEY = "muscleLog.exercises";
  const RECORDS_PATH = "data/records.json";
  const EXERCISES_PATH = "data/exercises.json";

  // このブラウザに記録がまだ無いときだけ、初回に読み込まれる過去分の記録。
  const SEED_RECORDS = [{"id":"seed-1","date":"2026-08-15","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"seed-2","date":"2026-08-15","exercise":"スミスベンチプレス","weight":65,"reps":8,"sets":1,"memo":""},{"id":"seed-3","date":"2026-08-15","exercise":"スミスベンチプレス","weight":70,"reps":3,"sets":1,"memo":""},{"id":"seed-4","date":"2026-08-15","exercise":"スミスベンチプレス","weight":75,"reps":2,"sets":1,"memo":""},{"id":"seed-5","date":"2026-08-15","exercise":"スミスサポーテッドロー","weight":35,"reps":8,"sets":3,"memo":""},{"id":"seed-6","date":"2026-08-15","exercise":"バイク","weight":7,"reps":10,"sets":1,"memo":"有酸素"},{"id":"seed-7","date":"2026-08-12","exercise":"バイク","weight":6,"reps":12,"sets":1,"memo":"有酸素"},{"id":"seed-8","date":"2026-08-12","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"seed-9","date":"2026-08-12","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"seed-10","date":"2026-08-12","exercise":"スミスベンチプレス","weight":70,"reps":4,"sets":1,"memo":""},{"id":"seed-11","date":"2026-08-12","exercise":"スミスベンチプレス","weight":70,"reps":5,"sets":1,"memo":""},{"id":"seed-12","date":"2026-08-12","exercise":"スミスベンチプレス","weight":70,"reps":4,"sets":1,"memo":""},{"id":"seed-13","date":"2026-08-12","exercise":"スミスサポーテッドロー","weight":30,"reps":8,"sets":3,"memo":""},{"id":"seed-14","date":"2026-08-12","exercise":"スミスアームカール","weight":20,"reps":10,"sets":1,"memo":""},{"id":"seed-15","date":"2026-08-12","exercise":"スミスアームカール","weight":25,"reps":10,"sets":1,"memo":""},{"id":"seed-16","date":"2026-08-12","exercise":"スミスアームカール","weight":30,"reps":12,"sets":1,"memo":""},{"id":"seed-17","date":"2026-08-08","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"seed-18","date":"2026-08-08","exercise":"スミスベンチプレス","weight":65,"reps":8,"sets":1,"memo":""},{"id":"seed-19","date":"2026-08-08","exercise":"スミスベンチプレス","weight":65,"reps":5,"sets":1,"memo":""},{"id":"seed-20","date":"2026-08-08","exercise":"スミスベンチプレス","weight":60,"reps":10,"sets":1,"memo":""},{"id":"seed-21","date":"2026-08-08","exercise":"スミスベントオーバーロー","weight":52.5,"reps":8,"sets":3,"memo":""},{"id":"seed-22","date":"2026-08-05","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":2,"memo":""},{"id":"seed-23","date":"2026-08-05","exercise":"スミスベンチプレス","weight":60,"reps":6,"sets":1,"memo":""},{"id":"seed-24","date":"2026-08-05","exercise":"スミスベンチプレス","weight":60,"reps":4,"sets":1,"memo":""},{"id":"seed-25","date":"2026-08-05","exercise":"スミスベントオーバーロー","weight":52.5,"reps":8,"sets":3,"memo":""},{"id":"seed-26","date":"2026-08-05","exercise":"スミスアームカール","weight":20,"reps":10,"sets":2,"memo":""},{"id":"seed-27","date":"2026-08-02","exercise":"バイク","weight":5,"reps":10,"sets":1,"memo":"有酸素"},{"id":"seed-28","date":"2026-08-02","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"seed-29","date":"2026-08-02","exercise":"スミスベンチプレス","weight":65,"reps":8,"sets":1,"memo":""},{"id":"seed-30","date":"2026-08-02","exercise":"スミスベンチプレス","weight":65,"reps":5,"sets":1,"memo":""},{"id":"seed-31","date":"2026-08-02","exercise":"スミスベンチプレス","weight":62.5,"reps":8,"sets":1,"memo":""},{"id":"seed-32","date":"2026-08-02","exercise":"スミスベンチプレス","weight":62.5,"reps":2,"sets":1,"memo":""},{"id":"seed-33","date":"2026-08-02","exercise":"スミスベントオーバーロー","weight":52.5,"reps":8,"sets":3,"memo":""},{"id":"seed-34","date":"2026-08-02","exercise":"アームカール","weight":10,"reps":10,"sets":2,"memo":""},{"id":"seed-35","date":"2026-07-25","exercise":"バイク","weight":5,"reps":11,"sets":1,"memo":"有酸素"},{"id":"seed-36","date":"2026-07-25","exercise":"スミスベンチプレス","weight":50,"reps":5,"sets":1,"memo":""},{"id":"seed-37","date":"2026-07-25","exercise":"スミスベンチプレス","weight":65,"reps":7,"sets":1,"memo":""},{"id":"seed-38","date":"2026-07-25","exercise":"スミスベンチプレス","weight":70,"reps":3,"sets":1,"memo":""},{"id":"seed-39","date":"2026-07-25","exercise":"スミスベンチプレス","weight":62.5,"reps":6,"sets":1,"memo":""},{"id":"seed-40","date":"2026-07-25","exercise":"スミスベンチプレス","weight":60,"reps":7,"sets":1,"memo":""},{"id":"seed-41","date":"2026-07-25","exercise":"ジャンプ","weight":0,"reps":10,"sets":1,"memo":"有酸素"},{"id":"seed-42","date":"2026-07-25","exercise":"スミスベントオーバーロー","weight":50,"reps":8,"sets":3,"memo":""},{"id":"seed-43","date":"2026-07-25","exercise":"アームカール","weight":10,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-0","date":"2026-07-11","exercise":"ジャンプ","weight":0,"reps":10,"sets":3,"memo":"有酸素"},{"id":"bulk-msxsmniu-1","date":"2026-07-11","exercise":"アームカール","weight":9,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-2","date":"2026-07-11","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":4,"memo":""},{"id":"bulk-msxsmniu-3","date":"2026-07-11","exercise":"スミスベントオーバーロー","weight":50,"reps":8,"sets":3,"memo":""},{"id":"bulk-msxsmniu-4","date":"2026-07-11","exercise":"バイク","weight":6,"reps":6,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-5","date":"2026-07-08","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-6","date":"2026-07-08","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-7","date":"2026-07-08","exercise":"スミスベンチプレス","weight":65,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-8","date":"2026-07-08","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-9","date":"2026-07-08","exercise":"スミスベントオーバーロー","weight":50,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-10","date":"2026-07-08","exercise":"アームカール","weight":9,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-11","date":"2026-07-08","exercise":"ジャンプ","weight":0,"reps":10,"sets":3,"memo":"有酸素"},{"id":"bulk-msxsmniu-12","date":"2026-06-28","exercise":"チェストプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-13","date":"2026-06-28","exercise":"チェストプレス","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-14","date":"2026-06-28","exercise":"チェストプレス","weight":55,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-15","date":"2026-06-28","exercise":"チェストプレス","weight":55,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-16","date":"2026-06-28","exercise":"ベントオーバーロー","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-17","date":"2026-06-28","exercise":"シーテッドロー","weight":35,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-18","date":"2026-06-28","exercise":"シーテッドロー","weight":35,"reps":8,"sets":3,"memo":""},{"id":"bulk-msxsmniu-19","date":"2026-06-28","exercise":"アームカール","weight":8,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-20","date":"2026-06-28","exercise":"アームカール","weight":9,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-21","date":"2026-06-24","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":2,"memo":""},{"id":"bulk-msxsmniu-22","date":"2026-06-24","exercise":"スミスベンチプレス","weight":65,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-23","date":"2026-06-24","exercise":"スミスベンチプレス","weight":60,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-24","date":"2026-06-24","exercise":"スミスベンチプレス","weight":60,"reps":4,"sets":1,"memo":""},{"id":"bulk-msxsmniu-25","date":"2026-06-24","exercise":"スミスベントオーバーロー","weight":45,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-26","date":"2026-06-21","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-27","date":"2026-06-21","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-28","date":"2026-06-21","exercise":"スミスベンチプレス","weight":65,"reps":5,"sets":2,"memo":""},{"id":"bulk-msxsmniu-29","date":"2026-06-21","exercise":"スミスベンチプレス","weight":60,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-30","date":"2026-06-21","exercise":"スミスベントオーバーロー","weight":40,"reps":10,"sets":4,"memo":""},{"id":"bulk-msxsmniu-31","date":"2026-06-21","exercise":"アームカール","weight":8,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-32","date":"2026-06-21","exercise":"ラン","weight":8,"reps":2,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-33","date":"2026-06-21","exercise":"ラン","weight":3,"reps":5,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-34","date":"2026-06-14","exercise":"スミスベンチプレス","weight":50,"reps":3,"sets":1,"memo":""},{"id":"bulk-msxsmniu-35","date":"2026-06-14","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":3,"memo":""},{"id":"bulk-msxsmniu-36","date":"2026-06-14","exercise":"スミスベントオーバーロー","weight":35,"reps":10,"sets":4,"memo":""},{"id":"bulk-msxsmniu-37","date":"2026-06-14","exercise":"ラン","weight":10,"reps":5,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-38","date":"2026-06-07","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-39","date":"2026-06-07","exercise":"スミスベンチプレス","weight":62.5,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-40","date":"2026-06-07","exercise":"スミスベンチプレス","weight":62.5,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-41","date":"2026-06-07","exercise":"スミスベンチプレス","weight":60,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-42","date":"2026-06-07","exercise":"スミススクワット","weight":60,"reps":8,"sets":2,"memo":""},{"id":"bulk-msxsmniu-43","date":"2026-06-07","exercise":"バイク","weight":8,"reps":2,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-44","date":"2026-06-07","exercise":"バイク","weight":4,"reps":5,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-45","date":"2026-05-31","exercise":"スミスベンチプレス","weight":50,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-46","date":"2026-05-31","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-47","date":"2026-05-31","exercise":"スミスベンチプレス","weight":62.5,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-48","date":"2026-05-31","exercise":"スミスベンチプレス","weight":62.5,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-49","date":"2026-05-31","exercise":"スミスベントオーバーロー","weight":30,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-50","date":"2026-05-31","exercise":"スミスミリタリー","weight":30,"reps":8,"sets":3,"memo":""},{"id":"bulk-msxsmniu-51","date":"2026-05-24","exercise":"バイク","weight":5,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-52","date":"2026-05-24","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-53","date":"2026-05-24","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":2,"memo":""},{"id":"bulk-msxsmniu-54","date":"2026-05-24","exercise":"スミスベンチプレス","weight":62.5,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-55","date":"2026-05-24","exercise":"スミスミリタリー","weight":30,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-56","date":"2026-05-10","exercise":"スミスベンチプレス","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-57","date":"2026-05-10","exercise":"スミスベンチプレス","weight":60,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-58","date":"2026-05-10","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-59","date":"2026-05-10","exercise":"スミスベンチプレス","weight":60,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-60","date":"2026-05-10","exercise":"スミスベントオーバーロー","weight":30,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-61","date":"2026-05-10","exercise":"バイク","weight":4,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-62","date":"2026-05-06","exercise":"スミスベンチプレス","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-63","date":"2026-05-06","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":2,"memo":""},{"id":"bulk-msxsmniu-64","date":"2026-05-06","exercise":"スミスベンチプレス","weight":65,"reps":3,"sets":1,"memo":""},{"id":"bulk-msxsmniu-65","date":"2026-05-06","exercise":"デッドリフト","weight":50,"reps":8,"sets":2,"memo":""},{"id":"bulk-msxsmniu-66","date":"2026-05-06","exercise":"デッドリフト","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-67","date":"2026-05-06","exercise":"ミリタリープレス","weight":30,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-68","date":"2026-05-06","exercise":"バイク","weight":4,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-69","date":"2026-05-03","exercise":"スミスベンチプレス","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-70","date":"2026-05-03","exercise":"スミスベンチプレス","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-71","date":"2026-05-03","exercise":"スミスベンチプレス","weight":60,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-72","date":"2026-05-03","exercise":"スミスベンチプレス","weight":57.5,"reps":6,"sets":3,"memo":""},{"id":"bulk-msxsmniu-73","date":"2026-05-03","exercise":"スミスミリタリー","weight":30,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-74","date":"2026-05-03","exercise":"スミススクワット","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-75","date":"2026-05-03","exercise":"スミススクワット","weight":40,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-76","date":"2026-04-26","exercise":"スミスベンチプレス","weight":59,"reps":2,"sets":1,"memo":""},{"id":"bulk-msxsmniu-77","date":"2026-04-26","exercise":"スミスベンチプレス","weight":53,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-78","date":"2026-04-26","exercise":"スミスベンチプレス","weight":53,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-79","date":"2026-04-26","exercise":"スミスベンチプレス","weight":48,"reps":8,"sets":2,"memo":""},{"id":"bulk-msxsmniu-80","date":"2026-04-26","exercise":"スミスベンチプレス","weight":48,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-81","date":"2026-04-26","exercise":"懸垂","weight":19,"reps":6,"sets":3,"memo":""},{"id":"bulk-msxsmniu-82","date":"2026-04-26","exercise":"レッグプレス","weight":55,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-83","date":"2026-04-26","exercise":"バイク","weight":8,"reps":15,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-84","date":"2026-04-18","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-85","date":"2026-04-18","exercise":"スミスベンチプレス","weight":55,"reps":8,"sets":2,"memo":""},{"id":"bulk-msxsmniu-86","date":"2026-04-18","exercise":"スミスベンチプレス","weight":55,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-87","date":"2026-04-18","exercise":"レッグプレス","weight":60,"reps":8,"sets":2,"memo":""},{"id":"bulk-msxsmniu-88","date":"2026-04-18","exercise":"バイク","weight":8,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-89","date":"2026-03-28","exercise":"スミスミリタリー","weight":25,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-90","date":"2026-03-28","exercise":"スミスミリタリー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-91","date":"2026-03-28","exercise":"スミスミリタリー","weight":32.5,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-92","date":"2026-03-28","exercise":"スミスミリタリー","weight":32.5,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-93","date":"2026-03-28","exercise":"バイク","weight":8,"reps":15,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-94","date":"2026-03-24","exercise":"ベンチプレス","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-95","date":"2026-03-24","exercise":"ベンチプレス","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-96","date":"2026-03-24","exercise":"ベンチプレス","weight":60,"reps":6,"sets":2,"memo":""},{"id":"bulk-msxsmniu-97","date":"2026-03-24","exercise":"ベンチプレス","weight":70,"reps":1,"sets":1,"memo":""},{"id":"bulk-msxsmniu-98","date":"2026-03-24","exercise":"ベンチプレス","weight":75,"reps":1,"sets":1,"memo":""},{"id":"bulk-msxsmniu-99","date":"2026-03-24","exercise":"チェストプレス","weight":60,"reps":3,"sets":1,"memo":""},{"id":"bulk-msxsmniu-100","date":"2026-03-24","exercise":"チェストプレス","weight":50,"reps":8,"sets":2,"memo":""},{"id":"bulk-msxsmniu-101","date":"2026-03-24","exercise":"チェストプレス","weight":50,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-102","date":"2026-03-24","exercise":"懸垂","weight":19,"reps":5,"sets":3,"memo":""},{"id":"bulk-msxsmniu-103","date":"2026-03-24","exercise":"バイク","weight":8,"reps":6,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-104","date":"2026-03-20","exercise":"ベンチプレス","weight":50,"reps":9,"sets":1,"memo":""},{"id":"bulk-msxsmniu-105","date":"2026-03-20","exercise":"ベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-106","date":"2026-03-20","exercise":"ベンチプレス","weight":50,"reps":9,"sets":1,"memo":""},{"id":"bulk-msxsmniu-107","date":"2026-03-20","exercise":"ベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-108","date":"2026-03-20","exercise":"スクワット","weight":70,"reps":5,"sets":3,"memo":""},{"id":"bulk-msxsmniu-109","date":"2026-03-20","exercise":"チェストプレス","weight":60,"reps":8,"sets":3,"memo":""},{"id":"bulk-msxsmniu-110","date":"2026-03-17","exercise":"スミスベンチプレス","weight":55,"reps":8,"sets":2,"memo":""},{"id":"bulk-msxsmniu-111","date":"2026-03-17","exercise":"スミスベンチプレス","weight":55,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-112","date":"2026-03-17","exercise":"スミスベンチプレス","weight":50,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-113","date":"2026-03-17","exercise":"ラットプルダウン","weight":55,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-114","date":"2026-03-17","exercise":"ラットプルダウン","weight":57.5,"reps":8,"sets":3,"memo":""},{"id":"bulk-msxsmniu-115","date":"2026-03-17","exercise":"ペクトラルフライ","weight":37.5,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-116","date":"2026-03-14","exercise":"ダンベルベンチ","weight":18,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-117","date":"2026-03-14","exercise":"ダンベルベンチ","weight":20,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-118","date":"2026-03-14","exercise":"スクワット","weight":70,"reps":8,"sets":3,"memo":""},{"id":"bulk-msxsmniu-119","date":"2026-03-14","exercise":"チェストプレス","weight":45,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-120","date":"2026-03-14","exercise":"チェストプレス","weight":45,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-121","date":"2026-03-10","exercise":"ラットプルダウン","weight":42.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-122","date":"2026-03-10","exercise":"ラットプルダウン","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-123","date":"2026-03-10","exercise":"ラットプルダウン","weight":52.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-124","date":"2026-03-10","exercise":"ラットプルダウン","weight":55,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-125","date":"2026-03-10","exercise":"ラットプルダウン","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-126","date":"2026-03-10","exercise":"ダンベルベンチ","weight":16,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-127","date":"2026-03-10","exercise":"ダンベルベンチ","weight":18,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-128","date":"2026-03-10","exercise":"バイク","weight":8,"reps":12,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-129","date":"2026-03-10","exercise":"ベンチプレス","weight":50,"reps":8,"sets":2,"memo":""},{"id":"bulk-msxsmniu-130","date":"2026-03-10","exercise":"ベンチプレス","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-131","date":"2026-03-06","exercise":"スミスベンチプレス","weight":52.5,"reps":8,"sets":3,"memo":""},{"id":"bulk-msxsmniu-132","date":"2026-03-06","exercise":"スクワット","weight":70,"reps":5,"sets":2,"memo":""},{"id":"bulk-msxsmniu-133","date":"2026-03-06","exercise":"バイク","weight":8,"reps":12,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-134","date":"2026-03-02","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":4,"memo":""},{"id":"bulk-msxsmniu-135","date":"2026-03-02","exercise":"ラットプルダウン","weight":52.5,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-136","date":"2026-03-02","exercise":"チェストプレス","weight":45,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-137","date":"2026-03-02","exercise":"チェストプレス","weight":45,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-138","date":"2026-02-27","exercise":"チェストプレス","weight":40,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-139","date":"2026-02-27","exercise":"ショルダープレス","weight":20,"reps":8,"sets":2,"memo":""},{"id":"bulk-msxsmniu-140","date":"2026-02-27","exercise":"ショルダープレス","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-141","date":"2026-02-27","exercise":"スクワット","weight":70,"reps":8,"sets":3,"memo":""},{"id":"bulk-msxsmniu-142","date":"2026-02-27","exercise":"バイク","weight":8,"reps":4,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-143","date":"2026-02-24","exercise":"チェストプレス","weight":45,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-144","date":"2026-02-24","exercise":"チェストプレス","weight":45,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-145","date":"2026-02-24","exercise":"チェストプレス","weight":40,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-146","date":"2026-02-24","exercise":"ラットプルダウン","weight":50,"reps":10,"sets":4,"memo":""},{"id":"bulk-msxsmniu-147","date":"2026-02-24","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-148","date":"2026-02-24","exercise":"スミスベンチプレス","weight":50,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-149","date":"2026-02-24","exercise":"スミスベンチプレス","weight":45,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-150","date":"2026-02-17","exercise":"スクワット","weight":70,"reps":8,"sets":3,"memo":""},{"id":"bulk-msxsmniu-151","date":"2026-02-17","exercise":"チェストプレス","weight":45,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-152","date":"2026-02-17","exercise":"バイク","weight":10,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-153","date":"2026-02-13","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":3,"memo":""},{"id":"bulk-msxsmniu-154","date":"2026-02-13","exercise":"スミスベンチプレス","weight":50,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-155","date":"2026-02-13","exercise":"デッドリフト","weight":55,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-156","date":"2026-02-13","exercise":"バイク","weight":10,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-157","date":"2026-02-10","exercise":"スクワット","weight":65,"reps":8,"sets":2,"memo":""},{"id":"bulk-msxsmniu-158","date":"2026-02-10","exercise":"スクワット","weight":65,"reps":9,"sets":1,"memo":""},{"id":"bulk-msxsmniu-159","date":"2026-02-10","exercise":"チェストプレス","weight":42.5,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-160","date":"2026-02-10","exercise":"バイク","weight":8,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-161","date":"2026-02-06","exercise":"デッドリフト","weight":50,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-162","date":"2026-02-06","exercise":"デッドリフト","weight":50,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-163","date":"2026-02-06","exercise":"スミスミリタリー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-164","date":"2026-02-06","exercise":"スミスミリタリー","weight":32.5,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-165","date":"2026-02-06","exercise":"スミスミリタリー","weight":32.5,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-166","date":"2026-02-06","exercise":"バイク","weight":8,"reps":11,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-167","date":"2026-02-03","exercise":"スクワット","weight":65,"reps":8,"sets":3,"memo":""},{"id":"bulk-msxsmniu-168","date":"2026-02-03","exercise":"チェストプレス","weight":35,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-169","date":"2026-02-03","exercise":"チェストプレス","weight":42.5,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-170","date":"2026-02-03","exercise":"チェストプレス","weight":42.5,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-171","date":"2026-01-27","exercise":"レッグプレス","weight":103,"reps":10,"sets":5,"memo":""},{"id":"bulk-msxsmniu-172","date":"2026-01-27","exercise":"ショルダープレス","weight":17.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-173","date":"2026-01-27","exercise":"ショルダープレス","weight":20,"reps":10,"sets":4,"memo":""},{"id":"bulk-msxsmniu-174","date":"2026-01-27","exercise":"スミスベンチプレス","weight":45,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-175","date":"2026-01-27","exercise":"スミスベンチプレス","weight":45,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-176","date":"2026-01-27","exercise":"スミスベンチプレス","weight":45,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-177","date":"2026-01-27","exercise":"スミスベンチプレス","weight":40,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-178","date":"2026-01-21","exercise":"スミスベンチプレス","weight":45,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-179","date":"2026-01-21","exercise":"スミスベンチプレス","weight":45,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-180","date":"2026-01-21","exercise":"ショルダープレス","weight":17.5,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-181","date":"2026-01-21","exercise":"ショルダープレス","weight":17.5,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-182","date":"2026-01-21","exercise":"ラットプルダウン","weight":42.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-183","date":"2026-01-21","exercise":"ラットプルダウン","weight":50,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-184","date":"2026-01-21","exercise":"ラットプルダウン","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-185","date":"2026-01-16","exercise":"ベンチプレス","weight":40,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-186","date":"2026-01-16","exercise":"ベンチプレス","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-187","date":"2026-01-16","exercise":"ベンチプレス","weight":50,"reps":8,"sets":2,"memo":""},{"id":"bulk-msxsmniu-188","date":"2026-01-16","exercise":"ベンチプレス","weight":50,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-189","date":"2026-01-16","exercise":"ショルダープレス","weight":20,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-190","date":"2026-01-16","exercise":"ショルダープレス","weight":15,"reps":10,"sets":5,"memo":""},{"id":"bulk-msxsmniu-191","date":"2026-01-16","exercise":"アームカール","weight":20,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-192","date":"2026-01-10","exercise":"スクワット","weight":65,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-193","date":"2026-01-10","exercise":"スミスベンチプレス","weight":50,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-194","date":"2026-01-10","exercise":"スミスベンチプレス","weight":45,"reps":8,"sets":2,"memo":""},{"id":"bulk-msxsmniu-195","date":"2026-01-10","exercise":"スミスベンチプレス","weight":45,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-196","date":"2026-01-10","exercise":"ショルダープレス","weight":10,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-197","date":"2026-01-10","exercise":"ショルダープレス","weight":15,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-198","date":"2026-01-10","exercise":"ショルダープレス","weight":15,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-199","date":"2026-01-10","exercise":"ショルダープレス","weight":15,"reps":9,"sets":1,"memo":""},{"id":"bulk-msxsmniu-200","date":"2026-01-02","exercise":"スミスベンチプレス","weight":40,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-201","date":"2026-01-02","exercise":"スミスベンチプレス","weight":50,"reps":10,"sets":2,"memo":""},{"id":"bulk-msxsmniu-202","date":"2026-01-02","exercise":"スミスベンチプレス","weight":50,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-203","date":"2026-01-02","exercise":"スミスベンチプレス","weight":40,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-204","date":"2026-01-02","exercise":"アームカール","weight":20,"reps":10,"sets":3,"memo":""},{"id":"bulk-msxsmniu-205","date":"2026-01-02","exercise":"スクワット","weight":60,"reps":10,"sets":3,"memo":""}];
  const SEED_EXERCISES = ["アームカール", "シーテッドロー", "ショルダープレス", "スクワット", "スミスアームカール", "スミスサポーテッドロー", "スミススクワット", "スミスベンチプレス", "スミスベントオーバーロー", "スミスミリタリー", "ダンベルベンチ", "チェストプレス", "デッドリフト", "ペクトラルフライ", "ベンチプレス", "ベントオーバーロー", "ミリタリープレス", "ラットプルダウン", "レッグプレス", "懸垂", "ジャンプ", "バイク", "ラン"];

  const CHART_WIDTH = 640;
  const CHART_MARGIN = { top: 14, right: 12, left: 40 };

  // 種目名から部位を推定する(2週間平均を部位単位でまとめて見せるため)。
  // 判定は上から優先度順、どれにも当てはまらなければ「その他」としてその種目単独で扱う。
  const MUSCLE_GROUPS = [
    { key: "cardio", label: "有酸素", test: MuscleSync.isCardioExercise },
    { key: "chest", label: "胸", test: (n) => /ベンチ|チェストプレス|フライ/.test(n) },
    { key: "back", label: "背中", test: (n) => /ロー|ラットプル|プルダウン|デッドリフト|懸垂/.test(n) },
    { key: "shoulder", label: "肩", test: (n) => /ミリタリー|ショルダー/.test(n) },
    { key: "arm", label: "腕", test: (n) => /カール|トライセプス/.test(n) },
    { key: "leg", label: "脚", test: (n) => /スクワット|レッグ|ランジ/.test(n) },
  ];

  function categoryForExercise(name) {
    const found = MUSCLE_GROUPS.find((g) => g.test(name));
    return found ? { key: found.key, label: found.label } : { key: `other:${name}`, label: name };
  }

  // 種目選択セレクトを部位ごとにグルーピングする表示順。分類できない種目は
  // (2週間平均のときと違い)ばらばらの単独グループにせず「その他」にまとめ、
  // 有酸素は常に一番最後に表示する。
  const SELECT_GROUP_ORDER = ["chest", "back", "shoulder", "arm", "leg", "other", "cardio"];
  const SELECT_GROUP_LABELS = { chest: "胸", back: "背中", shoulder: "肩", arm: "腕", leg: "脚", other: "その他", cardio: "有酸素" };

  function groupExerciseNamesForSelect(names) {
    const buckets = new Map();
    names.forEach((n) => {
      const found = MUSCLE_GROUPS.find((g) => g.test(n));
      const key = found ? found.key : "other";
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(n);
    });
    return SELECT_GROUP_ORDER.filter((k) => buckets.has(k)).map((k) => ({ label: SELECT_GROUP_LABELS[k], names: buckets.get(k) }));
  }

  function renderGroupedOptionsHtml(names) {
    return groupExerciseNamesForSelect(names)
      .map(
        (g) =>
          `<optgroup label="${escapeHtml(g.label)}">${g.names
            .map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`)
            .join("")}</optgroup>`
      )
      .join("");
  }

  /** @type {{id:string,date:string,exercise:string,weight:number,reps:number,sets:number,memo:string}[]} */
  let records = loadRecords();
  /** @type {string[]} */
  let exercises = loadExercises().sort(MuscleSync.compareExerciseNames);
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
  const chartRange = document.getElementById("chart-range");
  const historyList = document.getElementById("history-list");
  const chartPanels = document.getElementById("chart-panels");
  const chartWeightRepsSvg = document.getElementById("chart-weight-reps");
  const chartVolumeSvg = document.getElementById("chart-volume");
  const chartVolumeAvgSvg = document.getElementById("chart-volume-avg");
  const volumeAvgCategoryLabel = document.getElementById("volume-avg-category");
  const chartEmpty = document.getElementById("chart-empty");
  const chartDetail = document.getElementById("chart-detail");
  const CHART_DETAIL_PLACEHOLDER = "グラフの点をタップすると詳細が表示されます";
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
    const record = records.find((r) => r.id === id);
    if (!record) return;
    const confirmed = window.confirm(
      `この記録を削除しますか？\n\n${formatDate(record.date)}　${record.exercise}\n${setLabel(record)}`
    );
    if (!confirmed) return;
    records = records.filter((r) => r.id !== id);
    saveRecords();
    pushToGithub({ type: "delete", id });
    renderAll();
  });

  filterExercise.addEventListener("change", renderHistory);
  chartExercise.addEventListener("change", renderChart);
  chartRange.addEventListener("change", renderChart);

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
        exercises = exercises.concat(newNames).sort(MuscleSync.compareExerciseNames);
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

        const isCardio = MuscleSync.isCardioExercise(exercise);
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
        exercises = result.data.slice().sort(MuscleSync.compareExerciseNames);
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
          exercises = applyPendingExerciseChange(result.data, pendingChange).sort(MuscleSync.compareExerciseNames);
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

  // 記録画面の追加フォーム用: 種目管理ページで登録されている種目のみ
  // (ここから削除すると、過去の記録は残ったまま今後の入力では選べなくなる)
  function getRegisteredExerciseNames() {
    return exercises.slice().sort(MuscleSync.compareExerciseNames);
  }

  // 概要・絞り込み・グラフ用: 実際に記録がある種目のみ
  function getUsedExerciseNames() {
    const set = new Set(records.map((r) => r.exercise));
    return Array.from(set).sort(MuscleSync.compareExerciseNames);
  }

  function renderAll(opts) {
    opts = opts || {};
    renderExerciseOptions(opts);
    renderHistory();
    renderChart();
  }

  function renderExerciseOptions(opts) {
    opts = opts || {};
    const allNames = getRegisteredExerciseNames();
    const prevFormValue = opts.keepFormExercise !== undefined ? opts.keepFormExercise : exerciseInput.value;

    noExerciseHint.hidden = allNames.length > 0;
    addRecordBtn.disabled = allNames.length === 0;
    exerciseInput.disabled = allNames.length === 0;

    const placeholder = allNames.length
      ? '<option value="" disabled>種目を選択</option>'
      : '<option value="" disabled>まず種目を追加してください</option>';
    exerciseInput.innerHTML = placeholder + renderGroupedOptionsHtml(allNames);
    exerciseInput.value = allNames.includes(prevFormValue) ? prevFormValue : "";

    const usedNames = getUsedExerciseNames();

    const prevFilter = filterExercise.value;
    filterExercise.innerHTML = '<option value="">すべての種目</option>' + renderGroupedOptionsHtml(usedNames);
    if (usedNames.includes(prevFilter)) filterExercise.value = prevFilter;

    const prevChart = chartExercise.value;
    chartExercise.innerHTML = renderGroupedOptionsHtml(usedNames);
    if (opts.selectExerciseForChart && usedNames.includes(opts.selectExerciseForChart)) {
      chartExercise.value = opts.selectExerciseForChart;
    } else if (usedNames.includes(prevChart)) {
      chartExercise.value = prevChart;
    } else if (usedNames.length) {
      chartExercise.value = usedNames[usedNames.length - 1];
    }
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
      .map((date, dateIndex) => {
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
                <button class="set-chip-delete" data-id="${r.id}" aria-label="この記録を削除">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>
                </button>
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
          <details class="day-card"${dateIndex === 0 ? " open" : ""}>
            <summary class="day-card-header">
              <h3>${formatDate(date)}</h3>
              ${dayVolume > 0 ? `<span class="volume-badge volume-badge-day">合計Vol ${Math.round(dayVolume)}</span>` : ""}
            </summary>
            ${exerciseGroups}
          </details>
        `;
      })
      .join("");
  }

  // 日付ごとに、その日行った個々のセット(重量・回数の組)を配列で保持する。
  // sets:3 の記録は同じ重量・回数を3個に展開し、実際に行ったセット数と1対1にする。
  function computeChartData(exercise) {
    const byDate = new Map();
    records
      .filter((r) => r.exercise === exercise)
      .forEach((r) => {
        if (!byDate.has(r.date)) {
          byDate.set(r.date, { date: r.date, sets: [], volume: 0, segments: [] });
        }
        const entry = byDate.get(r.date);
        for (let i = 0; i < r.sets; i++) {
          entry.sets.push({ weight: r.weight, reps: r.reps });
        }
        entry.volume += r.weight * r.reps * r.sets;
        entry.segments.push(setLabel(r));
      });
    return Array.from(byDate.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e, dateIndex) => Object.assign({ dateIndex, totalSets: e.sets.length }, e));
  }

  // computeChartData と同じ形の日別データを作るが、1種目ではなく同じ部位(category)に
  // 属する全種目のボリュームをまとめて合算する。2週間平均を「胸」「背中」などで
  // 種目をまたいで見たいという要望向け。
  function computeCategoryChartData(category) {
    const byDate = new Map();
    records
      .filter((r) => categoryForExercise(r.exercise).key === category.key)
      .forEach((r) => {
        if (!byDate.has(r.date)) {
          byDate.set(r.date, { date: r.date, volume: 0 });
        }
        byDate.get(r.date).volume += r.weight * r.reps * r.sets;
      });
    return Array.from(byDate.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e, dateIndex) => Object.assign({ dateIndex }, e));
  }

  function addDays(iso, n) {
    const d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }

  // 期間セレクタの選択値をもとに、日付配列を「直近N日」に絞り込む。
  // 基準は「今日」ではなく、その種目の最新記録日(points内の最終日)にする。
  // そうしないと最近サボっているときに空のグラフになってしまうため。
  function rangeCutoffDate(points) {
    const rangeValue = chartRange.value;
    if (rangeValue === "all" || !points.length) return null;
    const latestDate = points[points.length - 1].date;
    return addDays(latestDate, -(parseInt(rangeValue, 10) - 1));
  }

  function renderChart() {
    const exercise = chartExercise.value;
    const points = computeChartData(exercise);
    chartDetail.textContent = CHART_DETAIL_PLACEHOLDER;

    if (!points.length) {
      chartPanels.style.display = "none";
      chartEmpty.style.display = "block";
      return;
    }

    chartEmpty.style.display = "none";
    chartPanels.style.display = "flex";

    const cutoff = rangeCutoffDate(points);
    const visiblePoints = cutoff ? points.filter((p) => p.date >= cutoff) : points;
    currentChartPoints = visiblePoints;

    const category = categoryForExercise(exercise);
    const categoryPoints = computeCategoryChartData(category);
    volumeAvgCategoryLabel.textContent = category.key.startsWith("other:") ? "" : category.label;

    renderWeightRepsPanel(chartWeightRepsSvg, visiblePoints, 130);
    renderVolumePanel(chartVolumeSvg, visiblePoints, 130);
    renderVolumeAvgPanel(chartVolumeAvgSvg, categoryPoints, 130, cutoff);
  }

  function xForPanel(i, count, plotW) {
    return count === 1 ? plotW / 2 : (i / (count - 1)) * plotW;
  }

  // 縦軸の目盛り線とラベルをまとめて作る。単位(unit)を付け、四捨五入した結果が
  // 直前の目盛りと同じ値になる場合はそのラインごと省略する(値の幅が狭いと重複表示になるため)。
  function renderValueAxis(plotW, minV, maxV, gridCount, yFor, unit) {
    let gridlines = "";
    let axisLabels = "";
    let lastLabel = null;
    for (let i = 0; i <= gridCount; i++) {
      const v = minV + ((maxV - minV) * i) / gridCount;
      const rounded = Math.round(v);
      if (rounded === lastLabel) continue;
      lastLabel = rounded;
      const y = yFor(v);
      gridlines += `<line class="chart-gridline" x1="0" y1="${y}" x2="${plotW}" y2="${y}"></line>`;
      axisLabels += `<text class="chart-axis-label" x="-8" y="${y + 3}" text-anchor="end">${rounded}${unit}</text>`;
    }
    return gridlines + axisLabels;
  }

  function renderDateLabels(points, xFor, plotH) {
    const labelStep = Math.max(1, Math.ceil(points.length / 6));
    let dateLabels = "";
    points.forEach((p, i) => {
      if (i % labelStep === 0 || i === points.length - 1) {
        dateLabels += `<text class="chart-axis-label" x="${xFor(i)}" y="${plotH + 16}" text-anchor="middle">${formatShortDate(p.date)}</text>`;
      }
    });
    return dateLabels;
  }

  // 回数を縦位置(日をまたいだ推移が見えるように)、重量は点の大きさではなく
  // 点の中の数字でそのまま表示する(大きさの見分けづらさの指摘への対応)。
  // 同じ日の複数セットは横に少しずらして並べるので、1セットずつが点として見える。
  function renderWeightRepsPanel(svgEl, points, height) {
    const plotW = CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;
    const plotH = height - CHART_MARGIN.top - 20;

    const plainR = 4; // 重量のない(有酸素の回数のみなど)セット用の小さい点
    const gap = 2;
    // 円の大きさは重量の意味付けではなく、中に書く数字(例: "62.5")が収まる
    // ための最低限のサイズにすぎない(桁数が多いほど少し大きくなる)。
    const rForWeight = (weight) => (weight > 0 ? Math.max(7, 3.5 + String(weight).length * 2.1) : plainR);

    const allReps = points.flatMap((p) => p.sets.map((s) => s.reps));
    const maxReps = Math.max(...allReps) * 1.15;

    const xFor = (i) => xForPanel(i, points.length, plotW);
    const yFor = (reps) => plotH - (reps / maxReps) * plotH;
    // 隣の日付の列にはみ出さないよう、1日分のクラスタ幅の上限を列間隔の92%に抑える。
    // 数字入りの円をぴったり並べてもその幅に収まらない日は、その日だけ数字なしの
    // 小さい点に切り替える(無理に詰めて数字が読めなくなるより、タップで詳細を
    // 見てもらう方が確実なため)。
    const columnSpacing = points.length > 1 ? plotW / (points.length - 1) : plotW;
    const maxClusterWidth = columnSpacing * 0.92;

    const axis = renderValueAxis(plotW, 0, maxReps, 3, yFor, "回");

    let dots = "";
    points.forEach((p, dateIndex) => {
      const baseX = xFor(dateIndex);
      const n = p.sets.length;

      let useChip = true;
      let radii = p.sets.map((s) => rForWeight(s.weight));
      let totalWidth = radii.reduce((sum, r) => sum + r * 2, 0) + gap * (n - 1);
      if (totalWidth > maxClusterWidth) {
        useChip = false;
        radii = p.sets.map(() => plainR);
        totalWidth = radii.reduce((sum, r) => sum + r * 2, 0) + gap * (n - 1);
      }
      // それでも収まらない極端な密集日は、点そのものを縮めて必ず日付間の枠内に収める
      // (タップ領域は別途 hitSize で最低24pxを確保しているので、押しにくくはならない)。
      let clusterGap = gap;
      if (totalWidth > maxClusterWidth && totalWidth > 0) {
        const scale = maxClusterWidth / totalWidth;
        radii = radii.map((r) => r * scale);
        clusterGap = gap * scale;
        totalWidth = maxClusterWidth;
      }

      let cursor = baseX - totalWidth / 2;
      p.sets.forEach((s, setIndex) => {
        const r = radii[setIndex];
        const x = cursor + r;
        cursor += r * 2 + clusterGap;
        const y = yFor(s.reps);
        const hasWeight = s.weight > 0 && useChip;
        const hitSize = Math.max(24, r * 2 + 4);
        const label = hasWeight
          ? `<text class="scatter-dot-label" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="central">${s.weight}</text>`
          : "";
        dots += `
          <g class="chart-mark" data-date-index="${dateIndex}" data-set-index="${setIndex}">
            <circle class="scatter-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}"></circle>
            ${label}
            <rect class="chart-hit" x="${(x - hitSize / 2).toFixed(1)}" y="${(y - hitSize / 2).toFixed(1)}" width="${hitSize}" height="${hitSize}"></rect>
          </g>
        `;
      });
    });

    const dateLabels = renderDateLabels(points, xFor, plotH);

    svgEl.innerHTML = `
      <g transform="translate(${CHART_MARGIN.left},${CHART_MARGIN.top})">
        ${axis}
        <line class="chart-baseline" x1="0" y1="${plotH}" x2="${plotW}" y2="${plotH}"></line>
        ${dots}
        ${dateLabels}
      </g>
    `;

    svgEl.querySelectorAll(".chart-mark").forEach((mark) => {
      mark.addEventListener("mouseenter", showSetTooltip);
      mark.addEventListener("mousemove", showSetTooltip);
      mark.addEventListener("touchstart", showSetTooltip, { passive: true });
    });
  }

  // ボリューム(重量×回数×セット)を棒グラフで表示するパネル。上のパネルと同じ
  // x位置(=同じ日付)を共有しているので、縦に見比べれば実質「同じグラフ」として読める。
  function renderVolumePanel(svgEl, points, height) {
    const plotW = CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;
    const plotH = height - CHART_MARGIN.top - 20;

    let maxV = Math.max(...points.map((p) => p.volume), 1) * 1.15;

    const xFor = (i) => xForPanel(i, points.length, plotW);
    const yFor = (v) => plotH - (v / maxV) * plotH;
    const barWidth = Math.min(22, (plotW / points.length) * 0.55);

    const axis = renderValueAxis(plotW, 0, maxV, 3, yFor, "kg");

    const bars = points
      .map((p, i) => {
        const x = xFor(i);
        const y = yFor(p.volume);
        // 両端の棒は軸ラベルやグラフ端にはみ出さないよう、中心位置は保ちつつ内側にクランプする
        const barLeft = Math.max(0, x - barWidth / 2);
        const barRight = Math.min(plotW, x + barWidth / 2);
        return `
          <g class="chart-mark" data-date-index="${i}">
            <rect class="volume-bar" x="${barLeft.toFixed(1)}" y="${y.toFixed(1)}" width="${(barRight - barLeft).toFixed(1)}" height="${(plotH - y).toFixed(1)}"></rect>
            <rect class="chart-hit" x="${x - 16}" y="0" width="32" height="${plotH}"></rect>
          </g>
        `;
      })
      .join("");

    const dateLabels = renderDateLabels(points, xFor, plotH);

    svgEl.innerHTML = `
      <g transform="translate(${CHART_MARGIN.left},${CHART_MARGIN.top})">
        ${axis}
        <line class="chart-baseline" x1="0" y1="${plotH}" x2="${plotW}" y2="${plotH}"></line>
        ${bars}
        ${dateLabels}
      </g>
    `;

    svgEl.querySelectorAll(".chart-mark").forEach((mark) => {
      mark.addEventListener("mouseenter", showVolumeTooltip);
      mark.addEventListener("mousemove", showVolumeTooltip);
      mark.addEventListener("touchstart", showVolumeTooltip, { passive: true });
    });
  }

  function daysBetween(fromIso, toIso) {
    return (new Date(toIso + "T00:00:00") - new Date(fromIso + "T00:00:00")) / 86400000;
  }

  // 各記録日について、その日を含む直近14日間(trailing)のボリューム平均を求める。
  // トレーニング日は不定期なので「暦日」ではなく「記録がある日」だけを対象に平均する。
  function computeRollingVolumeAvg(points, windowDays) {
    return points.map((p) => {
      const windowPoints = points.filter((q) => {
        const diff = daysBetween(q.date, p.date);
        return diff >= 0 && diff < windowDays;
      });
      const avg = windowPoints.reduce((sum, q) => sum + q.volume, 0) / windowPoints.length;
      return { date: p.date, avg, windowCount: windowPoints.length };
    });
  }

  // ボリュームの14日移動平均を折れ線で表示するパネル。上の日次ボリューム棒グラフと
  // 同じx位置(=同じ日付)を共有しているので、縦に見比べれば実質「同じグラフ」として読める。
  // 移動平均自体は部位の全履歴(points)から計算してから期間で絞り込む。そうしないと
  // 表示範囲の先頭付近の平均が「直近14日分」に満たない不正確な値になってしまうため。
  function renderVolumeAvgPanel(svgEl, points, height, cutoff) {
    const plotW = CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;
    const plotH = height - CHART_MARGIN.top - 20;

    const fullAvgPoints = computeRollingVolumeAvg(points, 14);
    const avgPoints = cutoff ? fullAvgPoints.filter((p) => p.date >= cutoff) : fullAvgPoints;

    let minV = Math.min(...avgPoints.map((p) => p.avg));
    let maxV = Math.max(...avgPoints.map((p) => p.avg));
    if (minV === maxV) {
      minV -= 1;
      maxV += 1;
    }
    const pad = (maxV - minV) * 0.15;
    minV -= pad;
    maxV += pad;

    const xFor = (i) => xForPanel(i, avgPoints.length, plotW);
    const yFor = (v) => plotH - ((v - minV) / (maxV - minV)) * plotH;

    const axis = renderValueAxis(plotW, minV, maxV, 3, yFor, "kg");

    const pathD = avgPoints
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(i).toFixed(1)} ${yFor(p.avg).toFixed(1)}`)
      .join(" ");

    const marks = avgPoints
      .map((p, i) => {
        const x = xFor(i);
        const y = yFor(p.avg);
        return `
          <g class="chart-mark" data-date-index="${i}">
            <circle class="avg-point" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"></circle>
            <rect class="chart-hit" x="${x - 14}" y="0" width="28" height="${plotH}"></rect>
          </g>
        `;
      })
      .join("");

    const dateLabels = renderDateLabels(avgPoints, xFor, plotH);

    svgEl.innerHTML = `
      <g transform="translate(${CHART_MARGIN.left},${CHART_MARGIN.top})">
        ${axis}
        <line class="chart-baseline" x1="0" y1="${plotH}" x2="${plotW}" y2="${plotH}"></line>
        <path class="avg-line" d="${pathD}"></path>
        ${marks}
        ${dateLabels}
      </g>
    `;

    svgEl.querySelectorAll(".chart-mark").forEach((mark) => {
      mark.addEventListener("mouseenter", showAvgTooltip);
      mark.addEventListener("mousemove", showAvgTooltip);
      mark.addEventListener("touchstart", showAvgTooltip, { passive: true });
    });

    svgEl.__avgPoints = avgPoints;
  }

  // タップ/ホバーした点の詳細は、グラフに重ねるポップアップではなく
  // グラフの上に常設した detail 欄に表示する(ポップアップがグラフを覆って
  // 邪魔になるという指摘への対応)。表示位置の計算が不要になる分シンプルにもなる。
  function showSetTooltip(e) {
    const mark = e.currentTarget;
    const dateIndex = parseInt(mark.getAttribute("data-date-index"), 10);
    const setIndex = parseInt(mark.getAttribute("data-set-index"), 10);
    const p = currentChartPoints[dateIndex];
    const s = p && p.sets[setIndex];
    if (!s) return;

    chartDetail.innerHTML = `
      <div class="tooltip-date">${formatDate(p.date)}</div>
      <div class="tooltip-row">${s.weight}kg × ${s.reps}回（${setIndex + 1}/${p.totalSets}セット目）</div>
      <div class="tooltip-detail">この日: ${escapeHtml(p.segments.join(", "))}</div>
    `;
  }

  function showVolumeTooltip(e) {
    const mark = e.currentTarget;
    const dateIndex = parseInt(mark.getAttribute("data-date-index"), 10);
    const p = currentChartPoints[dateIndex];
    if (!p) return;

    chartDetail.innerHTML = `
      <div class="tooltip-date">${formatDate(p.date)}</div>
      <div class="tooltip-row">ボリューム: ${Math.round(p.volume)}kg／${p.totalSets}セット</div>
      <div class="tooltip-detail">${escapeHtml(p.segments.join(", "))}</div>
    `;
  }

  function showAvgTooltip(e) {
    const mark = e.currentTarget;
    const svg = mark.closest("svg");
    const dateIndex = parseInt(mark.getAttribute("data-date-index"), 10);
    const avgPoints = svg.__avgPoints || [];
    const p = avgPoints[dateIndex];
    if (!p) return;

    chartDetail.innerHTML = `
      <div class="tooltip-date">${formatDate(p.date)}</div>
      <div class="tooltip-row">14日移動平均: ${Math.round(p.avg)}kg</div>
      <div class="tooltip-detail">直近${p.windowCount}回の記録の平均</div>
    `;
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
