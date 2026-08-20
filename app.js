(function () {
  "use strict";

  const STORAGE_KEY = "muscleLog.records";
  const EXERCISES_KEY = "muscleLog.exercises";
  const BODYWEIGHT_KEY = "muscleLog.bodyweight";
  const RECORDS_PATH = "data/records.json";
  const EXERCISES_PATH = "data/exercises.json";
  const BODYWEIGHT_PATH = "data/bodyweight.json";

  // このブラウザに記録がまだ無いときだけ、初回に読み込まれる過去分の記録。
  const SEED_RECORDS = [{"id":"seed-1","date":"2026-08-15","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"seed-2","date":"2026-08-15","exercise":"スミスベンチプレス","weight":65,"reps":8,"sets":1,"memo":""},{"id":"seed-3","date":"2026-08-15","exercise":"スミスベンチプレス","weight":70,"reps":3,"sets":1,"memo":""},{"id":"seed-4","date":"2026-08-15","exercise":"スミスベンチプレス","weight":75,"reps":2,"sets":1,"memo":""},{"id":"seed-5-split-0","date":"2026-08-15","exercise":"スミスサポーテッドロー","weight":35,"reps":8,"sets":1,"memo":""},{"id":"seed-5-split-1","date":"2026-08-15","exercise":"スミスサポーテッドロー","weight":35,"reps":8,"sets":1,"memo":""},{"id":"seed-5-split-2","date":"2026-08-15","exercise":"スミスサポーテッドロー","weight":35,"reps":8,"sets":1,"memo":""},{"id":"seed-6","date":"2026-08-15","exercise":"バイク","weight":7,"reps":10,"sets":1,"memo":"有酸素"},{"id":"seed-7","date":"2026-08-12","exercise":"バイク","weight":6,"reps":12,"sets":1,"memo":"有酸素"},{"id":"seed-8","date":"2026-08-12","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"seed-9","date":"2026-08-12","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"seed-10","date":"2026-08-12","exercise":"スミスベンチプレス","weight":70,"reps":4,"sets":1,"memo":""},{"id":"seed-11","date":"2026-08-12","exercise":"スミスベンチプレス","weight":70,"reps":5,"sets":1,"memo":""},{"id":"seed-12","date":"2026-08-12","exercise":"スミスベンチプレス","weight":70,"reps":4,"sets":1,"memo":""},{"id":"seed-13-split-0","date":"2026-08-12","exercise":"スミスサポーテッドロー","weight":30,"reps":8,"sets":1,"memo":""},{"id":"seed-13-split-1","date":"2026-08-12","exercise":"スミスサポーテッドロー","weight":30,"reps":8,"sets":1,"memo":""},{"id":"seed-13-split-2","date":"2026-08-12","exercise":"スミスサポーテッドロー","weight":30,"reps":8,"sets":1,"memo":""},{"id":"seed-14","date":"2026-08-12","exercise":"スミスアームカール","weight":20,"reps":10,"sets":1,"memo":""},{"id":"seed-15","date":"2026-08-12","exercise":"スミスアームカール","weight":25,"reps":10,"sets":1,"memo":""},{"id":"seed-16","date":"2026-08-12","exercise":"スミスアームカール","weight":30,"reps":12,"sets":1,"memo":""},{"id":"seed-17","date":"2026-08-08","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"seed-18","date":"2026-08-08","exercise":"スミスベンチプレス","weight":65,"reps":8,"sets":1,"memo":""},{"id":"seed-19","date":"2026-08-08","exercise":"スミスベンチプレス","weight":65,"reps":5,"sets":1,"memo":""},{"id":"seed-20","date":"2026-08-08","exercise":"スミスベンチプレス","weight":60,"reps":10,"sets":1,"memo":""},{"id":"seed-21-split-0","date":"2026-08-08","exercise":"スミスベントオーバーロー","weight":52.5,"reps":8,"sets":1,"memo":""},{"id":"seed-21-split-1","date":"2026-08-08","exercise":"スミスベントオーバーロー","weight":52.5,"reps":8,"sets":1,"memo":""},{"id":"seed-21-split-2","date":"2026-08-08","exercise":"スミスベントオーバーロー","weight":52.5,"reps":8,"sets":1,"memo":""},{"id":"seed-22-split-0","date":"2026-08-05","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"seed-22-split-1","date":"2026-08-05","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"seed-23","date":"2026-08-05","exercise":"スミスベンチプレス","weight":60,"reps":6,"sets":1,"memo":""},{"id":"seed-24","date":"2026-08-05","exercise":"スミスベンチプレス","weight":60,"reps":4,"sets":1,"memo":""},{"id":"seed-25-split-0","date":"2026-08-05","exercise":"スミスベントオーバーロー","weight":52.5,"reps":8,"sets":1,"memo":""},{"id":"seed-25-split-1","date":"2026-08-05","exercise":"スミスベントオーバーロー","weight":52.5,"reps":8,"sets":1,"memo":""},{"id":"seed-25-split-2","date":"2026-08-05","exercise":"スミスベントオーバーロー","weight":52.5,"reps":8,"sets":1,"memo":""},{"id":"seed-26-split-0","date":"2026-08-05","exercise":"スミスアームカール","weight":20,"reps":10,"sets":1,"memo":""},{"id":"seed-26-split-1","date":"2026-08-05","exercise":"スミスアームカール","weight":20,"reps":10,"sets":1,"memo":""},{"id":"seed-27","date":"2026-08-02","exercise":"バイク","weight":5,"reps":10,"sets":1,"memo":"有酸素"},{"id":"seed-28","date":"2026-08-02","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"seed-29","date":"2026-08-02","exercise":"スミスベンチプレス","weight":65,"reps":8,"sets":1,"memo":""},{"id":"seed-30","date":"2026-08-02","exercise":"スミスベンチプレス","weight":65,"reps":5,"sets":1,"memo":""},{"id":"seed-31","date":"2026-08-02","exercise":"スミスベンチプレス","weight":62.5,"reps":8,"sets":1,"memo":""},{"id":"seed-32","date":"2026-08-02","exercise":"スミスベンチプレス","weight":62.5,"reps":2,"sets":1,"memo":""},{"id":"seed-33-split-0","date":"2026-08-02","exercise":"スミスベントオーバーロー","weight":52.5,"reps":8,"sets":1,"memo":""},{"id":"seed-33-split-1","date":"2026-08-02","exercise":"スミスベントオーバーロー","weight":52.5,"reps":8,"sets":1,"memo":""},{"id":"seed-33-split-2","date":"2026-08-02","exercise":"スミスベントオーバーロー","weight":52.5,"reps":8,"sets":1,"memo":""},{"id":"seed-34-split-0","date":"2026-08-02","exercise":"アームカール","weight":10,"reps":10,"sets":1,"memo":""},{"id":"seed-34-split-1","date":"2026-08-02","exercise":"アームカール","weight":10,"reps":10,"sets":1,"memo":""},{"id":"seed-35","date":"2026-07-25","exercise":"バイク","weight":5,"reps":11,"sets":1,"memo":"有酸素"},{"id":"seed-36","date":"2026-07-25","exercise":"スミスベンチプレス","weight":50,"reps":5,"sets":1,"memo":""},{"id":"seed-37","date":"2026-07-25","exercise":"スミスベンチプレス","weight":65,"reps":7,"sets":1,"memo":""},{"id":"seed-38","date":"2026-07-25","exercise":"スミスベンチプレス","weight":70,"reps":3,"sets":1,"memo":""},{"id":"seed-39","date":"2026-07-25","exercise":"スミスベンチプレス","weight":62.5,"reps":6,"sets":1,"memo":""},{"id":"seed-40","date":"2026-07-25","exercise":"スミスベンチプレス","weight":60,"reps":7,"sets":1,"memo":""},{"id":"seed-41","date":"2026-07-25","exercise":"ジャンプ","weight":0,"reps":10,"sets":1,"memo":"有酸素"},{"id":"seed-42-split-0","date":"2026-07-25","exercise":"スミスベントオーバーロー","weight":50,"reps":8,"sets":1,"memo":""},{"id":"seed-42-split-1","date":"2026-07-25","exercise":"スミスベントオーバーロー","weight":50,"reps":8,"sets":1,"memo":""},{"id":"seed-42-split-2","date":"2026-07-25","exercise":"スミスベントオーバーロー","weight":50,"reps":8,"sets":1,"memo":""},{"id":"seed-43-split-0","date":"2026-07-25","exercise":"アームカール","weight":10,"reps":10,"sets":1,"memo":""},{"id":"seed-43-split-1","date":"2026-07-25","exercise":"アームカール","weight":10,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-0-split-0","date":"2026-07-11","exercise":"ジャンプ","weight":0,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-0-split-1","date":"2026-07-11","exercise":"ジャンプ","weight":0,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-0-split-2","date":"2026-07-11","exercise":"ジャンプ","weight":0,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-1-split-0","date":"2026-07-11","exercise":"アームカール","weight":9,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-1-split-1","date":"2026-07-11","exercise":"アームカール","weight":9,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-1-split-2","date":"2026-07-11","exercise":"アームカール","weight":9,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-2-split-0","date":"2026-07-11","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-2-split-1","date":"2026-07-11","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-2-split-2","date":"2026-07-11","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-2-split-3","date":"2026-07-11","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-3-split-0","date":"2026-07-11","exercise":"スミスベントオーバーロー","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-3-split-1","date":"2026-07-11","exercise":"スミスベントオーバーロー","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-3-split-2","date":"2026-07-11","exercise":"スミスベントオーバーロー","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-4","date":"2026-07-11","exercise":"バイク","weight":6,"reps":6,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-5","date":"2026-07-08","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-6","date":"2026-07-08","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-7","date":"2026-07-08","exercise":"スミスベンチプレス","weight":65,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-8","date":"2026-07-08","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-9-split-0","date":"2026-07-08","exercise":"スミスベントオーバーロー","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-9-split-1","date":"2026-07-08","exercise":"スミスベントオーバーロー","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-9-split-2","date":"2026-07-08","exercise":"スミスベントオーバーロー","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-10-split-0","date":"2026-07-08","exercise":"アームカール","weight":9,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-10-split-1","date":"2026-07-08","exercise":"アームカール","weight":9,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-10-split-2","date":"2026-07-08","exercise":"アームカール","weight":9,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-11-split-0","date":"2026-07-08","exercise":"ジャンプ","weight":0,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-11-split-1","date":"2026-07-08","exercise":"ジャンプ","weight":0,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-11-split-2","date":"2026-07-08","exercise":"ジャンプ","weight":0,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-12","date":"2026-06-28","exercise":"チェストプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-13","date":"2026-06-28","exercise":"チェストプレス","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-14-split-0","date":"2026-06-28","exercise":"チェストプレス","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-14-split-1","date":"2026-06-28","exercise":"チェストプレス","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-15","date":"2026-06-28","exercise":"チェストプレス","weight":55,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-16","date":"2026-06-28","exercise":"ベントオーバーロー","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-17","date":"2026-06-28","exercise":"シーテッドロー","weight":35,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-18-split-0","date":"2026-06-28","exercise":"シーテッドロー","weight":35,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-18-split-1","date":"2026-06-28","exercise":"シーテッドロー","weight":35,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-18-split-2","date":"2026-06-28","exercise":"シーテッドロー","weight":35,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-19","date":"2026-06-28","exercise":"アームカール","weight":8,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-20-split-0","date":"2026-06-28","exercise":"アームカール","weight":9,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-20-split-1","date":"2026-06-28","exercise":"アームカール","weight":9,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-21-split-0","date":"2026-06-24","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-21-split-1","date":"2026-06-24","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-22","date":"2026-06-24","exercise":"スミスベンチプレス","weight":65,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-23","date":"2026-06-24","exercise":"スミスベンチプレス","weight":60,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-24","date":"2026-06-24","exercise":"スミスベンチプレス","weight":60,"reps":4,"sets":1,"memo":""},{"id":"bulk-msxsmniu-25-split-0","date":"2026-06-24","exercise":"スミスベントオーバーロー","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-25-split-1","date":"2026-06-24","exercise":"スミスベントオーバーロー","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-25-split-2","date":"2026-06-24","exercise":"スミスベントオーバーロー","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-26","date":"2026-06-21","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-27","date":"2026-06-21","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-28-split-0","date":"2026-06-21","exercise":"スミスベンチプレス","weight":65,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-28-split-1","date":"2026-06-21","exercise":"スミスベンチプレス","weight":65,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-29","date":"2026-06-21","exercise":"スミスベンチプレス","weight":60,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-30-split-0","date":"2026-06-21","exercise":"スミスベントオーバーロー","weight":40,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-30-split-1","date":"2026-06-21","exercise":"スミスベントオーバーロー","weight":40,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-30-split-2","date":"2026-06-21","exercise":"スミスベントオーバーロー","weight":40,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-30-split-3","date":"2026-06-21","exercise":"スミスベントオーバーロー","weight":40,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-31-split-0","date":"2026-06-21","exercise":"アームカール","weight":8,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-31-split-1","date":"2026-06-21","exercise":"アームカール","weight":8,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-31-split-2","date":"2026-06-21","exercise":"アームカール","weight":8,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-32","date":"2026-06-21","exercise":"ラン","weight":8,"reps":2,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-33","date":"2026-06-21","exercise":"ラン","weight":3,"reps":5,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-34","date":"2026-06-14","exercise":"スミスベンチプレス","weight":50,"reps":3,"sets":1,"memo":""},{"id":"bulk-msxsmniu-35-split-0","date":"2026-06-14","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-35-split-1","date":"2026-06-14","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-35-split-2","date":"2026-06-14","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-36-split-0","date":"2026-06-14","exercise":"スミスベントオーバーロー","weight":35,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-36-split-1","date":"2026-06-14","exercise":"スミスベントオーバーロー","weight":35,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-36-split-2","date":"2026-06-14","exercise":"スミスベントオーバーロー","weight":35,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-36-split-3","date":"2026-06-14","exercise":"スミスベントオーバーロー","weight":35,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-37","date":"2026-06-14","exercise":"ラン","weight":10,"reps":5,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-38","date":"2026-06-07","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-39","date":"2026-06-07","exercise":"スミスベンチプレス","weight":62.5,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-40","date":"2026-06-07","exercise":"スミスベンチプレス","weight":62.5,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-41","date":"2026-06-07","exercise":"スミスベンチプレス","weight":60,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-42-split-0","date":"2026-06-07","exercise":"スミススクワット","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-42-split-1","date":"2026-06-07","exercise":"スミススクワット","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-43","date":"2026-06-07","exercise":"バイク","weight":8,"reps":2,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-44","date":"2026-06-07","exercise":"バイク","weight":4,"reps":5,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-45","date":"2026-05-31","exercise":"スミスベンチプレス","weight":50,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-46","date":"2026-05-31","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-47","date":"2026-05-31","exercise":"スミスベンチプレス","weight":62.5,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-48","date":"2026-05-31","exercise":"スミスベンチプレス","weight":62.5,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-49-split-0","date":"2026-05-31","exercise":"スミスベントオーバーロー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-49-split-1","date":"2026-05-31","exercise":"スミスベントオーバーロー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-49-split-2","date":"2026-05-31","exercise":"スミスベントオーバーロー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-50-split-0","date":"2026-05-31","exercise":"スミスミリタリー","weight":30,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-50-split-1","date":"2026-05-31","exercise":"スミスミリタリー","weight":30,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-50-split-2","date":"2026-05-31","exercise":"スミスミリタリー","weight":30,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-51","date":"2026-05-24","exercise":"バイク","weight":5,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-52","date":"2026-05-24","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-53-split-0","date":"2026-05-24","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-53-split-1","date":"2026-05-24","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-54","date":"2026-05-24","exercise":"スミスベンチプレス","weight":62.5,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-55-split-0","date":"2026-05-24","exercise":"スミスミリタリー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-55-split-1","date":"2026-05-24","exercise":"スミスミリタリー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-55-split-2","date":"2026-05-24","exercise":"スミスミリタリー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-56","date":"2026-05-10","exercise":"スミスベンチプレス","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-57","date":"2026-05-10","exercise":"スミスベンチプレス","weight":60,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-58","date":"2026-05-10","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-59","date":"2026-05-10","exercise":"スミスベンチプレス","weight":60,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-60-split-0","date":"2026-05-10","exercise":"スミスベントオーバーロー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-60-split-1","date":"2026-05-10","exercise":"スミスベントオーバーロー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-60-split-2","date":"2026-05-10","exercise":"スミスベントオーバーロー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-61","date":"2026-05-10","exercise":"バイク","weight":4,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-62","date":"2026-05-06","exercise":"スミスベンチプレス","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-63-split-0","date":"2026-05-06","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-63-split-1","date":"2026-05-06","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-64","date":"2026-05-06","exercise":"スミスベンチプレス","weight":65,"reps":3,"sets":1,"memo":""},{"id":"bulk-msxsmniu-65-split-0","date":"2026-05-06","exercise":"デッドリフト","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-65-split-1","date":"2026-05-06","exercise":"デッドリフト","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-66","date":"2026-05-06","exercise":"デッドリフト","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-67-split-0","date":"2026-05-06","exercise":"ミリタリープレス","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-67-split-1","date":"2026-05-06","exercise":"ミリタリープレス","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-67-split-2","date":"2026-05-06","exercise":"ミリタリープレス","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-68","date":"2026-05-06","exercise":"バイク","weight":4,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-69","date":"2026-05-03","exercise":"スミスベンチプレス","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-70","date":"2026-05-03","exercise":"スミスベンチプレス","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-71","date":"2026-05-03","exercise":"スミスベンチプレス","weight":60,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-72-split-0","date":"2026-05-03","exercise":"スミスベンチプレス","weight":57.5,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-72-split-1","date":"2026-05-03","exercise":"スミスベンチプレス","weight":57.5,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-72-split-2","date":"2026-05-03","exercise":"スミスベンチプレス","weight":57.5,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-73-split-0","date":"2026-05-03","exercise":"スミスミリタリー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-73-split-1","date":"2026-05-03","exercise":"スミスミリタリー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-73-split-2","date":"2026-05-03","exercise":"スミスミリタリー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-74","date":"2026-05-03","exercise":"スミススクワット","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-75","date":"2026-05-03","exercise":"スミススクワット","weight":40,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-76","date":"2026-04-26","exercise":"スミスベンチプレス","weight":59,"reps":2,"sets":1,"memo":""},{"id":"bulk-msxsmniu-77","date":"2026-04-26","exercise":"スミスベンチプレス","weight":53,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-78","date":"2026-04-26","exercise":"スミスベンチプレス","weight":53,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-79-split-0","date":"2026-04-26","exercise":"スミスベンチプレス","weight":48,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-79-split-1","date":"2026-04-26","exercise":"スミスベンチプレス","weight":48,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-80","date":"2026-04-26","exercise":"スミスベンチプレス","weight":48,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-81-split-0","date":"2026-04-26","exercise":"懸垂","weight":19,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-81-split-1","date":"2026-04-26","exercise":"懸垂","weight":19,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-81-split-2","date":"2026-04-26","exercise":"懸垂","weight":19,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-82-split-0","date":"2026-04-26","exercise":"レッグプレス","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-82-split-1","date":"2026-04-26","exercise":"レッグプレス","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-82-split-2","date":"2026-04-26","exercise":"レッグプレス","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-83","date":"2026-04-26","exercise":"バイク","weight":8,"reps":15,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-84","date":"2026-04-18","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-85-split-0","date":"2026-04-18","exercise":"スミスベンチプレス","weight":55,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-85-split-1","date":"2026-04-18","exercise":"スミスベンチプレス","weight":55,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-86","date":"2026-04-18","exercise":"スミスベンチプレス","weight":55,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-87-split-0","date":"2026-04-18","exercise":"レッグプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-87-split-1","date":"2026-04-18","exercise":"レッグプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-88","date":"2026-04-18","exercise":"バイク","weight":8,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-89","date":"2026-03-28","exercise":"スミスミリタリー","weight":25,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-90","date":"2026-03-28","exercise":"スミスミリタリー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-91-split-0","date":"2026-03-28","exercise":"スミスミリタリー","weight":32.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-91-split-1","date":"2026-03-28","exercise":"スミスミリタリー","weight":32.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-92","date":"2026-03-28","exercise":"スミスミリタリー","weight":32.5,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-93","date":"2026-03-28","exercise":"バイク","weight":8,"reps":15,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-94","date":"2026-03-24","exercise":"ベンチプレス","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-95","date":"2026-03-24","exercise":"ベンチプレス","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-96-split-0","date":"2026-03-24","exercise":"ベンチプレス","weight":60,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-96-split-1","date":"2026-03-24","exercise":"ベンチプレス","weight":60,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-97","date":"2026-03-24","exercise":"ベンチプレス","weight":70,"reps":1,"sets":1,"memo":""},{"id":"bulk-msxsmniu-98","date":"2026-03-24","exercise":"ベンチプレス","weight":75,"reps":1,"sets":1,"memo":""},{"id":"bulk-msxsmniu-99","date":"2026-03-24","exercise":"チェストプレス","weight":60,"reps":3,"sets":1,"memo":""},{"id":"bulk-msxsmniu-100-split-0","date":"2026-03-24","exercise":"チェストプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-100-split-1","date":"2026-03-24","exercise":"チェストプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-101","date":"2026-03-24","exercise":"チェストプレス","weight":50,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-102-split-0","date":"2026-03-24","exercise":"懸垂","weight":19,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-102-split-1","date":"2026-03-24","exercise":"懸垂","weight":19,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-102-split-2","date":"2026-03-24","exercise":"懸垂","weight":19,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-103","date":"2026-03-24","exercise":"バイク","weight":8,"reps":6,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-104","date":"2026-03-20","exercise":"ベンチプレス","weight":50,"reps":9,"sets":1,"memo":""},{"id":"bulk-msxsmniu-105","date":"2026-03-20","exercise":"ベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-106","date":"2026-03-20","exercise":"ベンチプレス","weight":50,"reps":9,"sets":1,"memo":""},{"id":"bulk-msxsmniu-107","date":"2026-03-20","exercise":"ベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-108-split-0","date":"2026-03-20","exercise":"スクワット","weight":70,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-108-split-1","date":"2026-03-20","exercise":"スクワット","weight":70,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-108-split-2","date":"2026-03-20","exercise":"スクワット","weight":70,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-109-split-0","date":"2026-03-20","exercise":"チェストプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-109-split-1","date":"2026-03-20","exercise":"チェストプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-109-split-2","date":"2026-03-20","exercise":"チェストプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-110-split-0","date":"2026-03-17","exercise":"スミスベンチプレス","weight":55,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-110-split-1","date":"2026-03-17","exercise":"スミスベンチプレス","weight":55,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-111","date":"2026-03-17","exercise":"スミスベンチプレス","weight":55,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-112","date":"2026-03-17","exercise":"スミスベンチプレス","weight":50,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-113","date":"2026-03-17","exercise":"ラットプルダウン","weight":55,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-114-split-0","date":"2026-03-17","exercise":"ラットプルダウン","weight":57.5,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-114-split-1","date":"2026-03-17","exercise":"ラットプルダウン","weight":57.5,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-114-split-2","date":"2026-03-17","exercise":"ラットプルダウン","weight":57.5,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-115-split-0","date":"2026-03-17","exercise":"ペクトラルフライ","weight":37.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-115-split-1","date":"2026-03-17","exercise":"ペクトラルフライ","weight":37.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-116","date":"2026-03-14","exercise":"ダンベルベンチ","weight":18,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-117-split-0","date":"2026-03-14","exercise":"ダンベルベンチ","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-117-split-1","date":"2026-03-14","exercise":"ダンベルベンチ","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-118-split-0","date":"2026-03-14","exercise":"スクワット","weight":70,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-118-split-1","date":"2026-03-14","exercise":"スクワット","weight":70,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-118-split-2","date":"2026-03-14","exercise":"スクワット","weight":70,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-119-split-0","date":"2026-03-14","exercise":"チェストプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-119-split-1","date":"2026-03-14","exercise":"チェストプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-120","date":"2026-03-14","exercise":"チェストプレス","weight":45,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-121","date":"2026-03-10","exercise":"ラットプルダウン","weight":42.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-122","date":"2026-03-10","exercise":"ラットプルダウン","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-123","date":"2026-03-10","exercise":"ラットプルダウン","weight":52.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-124-split-0","date":"2026-03-10","exercise":"ラットプルダウン","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-124-split-1","date":"2026-03-10","exercise":"ラットプルダウン","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-125","date":"2026-03-10","exercise":"ラットプルダウン","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-126","date":"2026-03-10","exercise":"ダンベルベンチ","weight":16,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-127-split-0","date":"2026-03-10","exercise":"ダンベルベンチ","weight":18,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-127-split-1","date":"2026-03-10","exercise":"ダンベルベンチ","weight":18,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-127-split-2","date":"2026-03-10","exercise":"ダンベルベンチ","weight":18,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-128","date":"2026-03-10","exercise":"バイク","weight":8,"reps":12,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-129-split-0","date":"2026-03-10","exercise":"ベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-129-split-1","date":"2026-03-10","exercise":"ベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-130","date":"2026-03-10","exercise":"ベンチプレス","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-131-split-0","date":"2026-03-06","exercise":"スミスベンチプレス","weight":52.5,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-131-split-1","date":"2026-03-06","exercise":"スミスベンチプレス","weight":52.5,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-131-split-2","date":"2026-03-06","exercise":"スミスベンチプレス","weight":52.5,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-132-split-0","date":"2026-03-06","exercise":"スクワット","weight":70,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-132-split-1","date":"2026-03-06","exercise":"スクワット","weight":70,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-133","date":"2026-03-06","exercise":"バイク","weight":8,"reps":12,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-134-split-0","date":"2026-03-02","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-134-split-1","date":"2026-03-02","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-134-split-2","date":"2026-03-02","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-134-split-3","date":"2026-03-02","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-135-split-0","date":"2026-03-02","exercise":"ラットプルダウン","weight":52.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-135-split-1","date":"2026-03-02","exercise":"ラットプルダウン","weight":52.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-135-split-2","date":"2026-03-02","exercise":"ラットプルダウン","weight":52.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-136-split-0","date":"2026-03-02","exercise":"チェストプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-136-split-1","date":"2026-03-02","exercise":"チェストプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-137","date":"2026-03-02","exercise":"チェストプレス","weight":45,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-138-split-0","date":"2026-02-27","exercise":"チェストプレス","weight":40,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-138-split-1","date":"2026-02-27","exercise":"チェストプレス","weight":40,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-138-split-2","date":"2026-02-27","exercise":"チェストプレス","weight":40,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-139-split-0","date":"2026-02-27","exercise":"ショルダープレス","weight":20,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-139-split-1","date":"2026-02-27","exercise":"ショルダープレス","weight":20,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-140","date":"2026-02-27","exercise":"ショルダープレス","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-141-split-0","date":"2026-02-27","exercise":"スクワット","weight":70,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-141-split-1","date":"2026-02-27","exercise":"スクワット","weight":70,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-141-split-2","date":"2026-02-27","exercise":"スクワット","weight":70,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-142","date":"2026-02-27","exercise":"バイク","weight":8,"reps":4,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-143-split-0","date":"2026-02-24","exercise":"チェストプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-143-split-1","date":"2026-02-24","exercise":"チェストプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-144","date":"2026-02-24","exercise":"チェストプレス","weight":45,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-145","date":"2026-02-24","exercise":"チェストプレス","weight":40,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-146-split-0","date":"2026-02-24","exercise":"ラットプルダウン","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-146-split-1","date":"2026-02-24","exercise":"ラットプルダウン","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-146-split-2","date":"2026-02-24","exercise":"ラットプルダウン","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-146-split-3","date":"2026-02-24","exercise":"ラットプルダウン","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-147","date":"2026-02-24","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-148","date":"2026-02-24","exercise":"スミスベンチプレス","weight":50,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-149","date":"2026-02-24","exercise":"スミスベンチプレス","weight":45,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-150-split-0","date":"2026-02-17","exercise":"スクワット","weight":70,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-150-split-1","date":"2026-02-17","exercise":"スクワット","weight":70,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-150-split-2","date":"2026-02-17","exercise":"スクワット","weight":70,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-151-split-0","date":"2026-02-17","exercise":"チェストプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-151-split-1","date":"2026-02-17","exercise":"チェストプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-151-split-2","date":"2026-02-17","exercise":"チェストプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-152","date":"2026-02-17","exercise":"バイク","weight":10,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-153-split-0","date":"2026-02-13","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-153-split-1","date":"2026-02-13","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-153-split-2","date":"2026-02-13","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-154","date":"2026-02-13","exercise":"スミスベンチプレス","weight":50,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-155-split-0","date":"2026-02-13","exercise":"デッドリフト","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-155-split-1","date":"2026-02-13","exercise":"デッドリフト","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-155-split-2","date":"2026-02-13","exercise":"デッドリフト","weight":55,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-156","date":"2026-02-13","exercise":"バイク","weight":10,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-157-split-0","date":"2026-02-10","exercise":"スクワット","weight":65,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-157-split-1","date":"2026-02-10","exercise":"スクワット","weight":65,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-158","date":"2026-02-10","exercise":"スクワット","weight":65,"reps":9,"sets":1,"memo":""},{"id":"bulk-msxsmniu-159-split-0","date":"2026-02-10","exercise":"チェストプレス","weight":42.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-159-split-1","date":"2026-02-10","exercise":"チェストプレス","weight":42.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-159-split-2","date":"2026-02-10","exercise":"チェストプレス","weight":42.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-160","date":"2026-02-10","exercise":"バイク","weight":8,"reps":10,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-161-split-0","date":"2026-02-06","exercise":"デッドリフト","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-161-split-1","date":"2026-02-06","exercise":"デッドリフト","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-161-split-2","date":"2026-02-06","exercise":"デッドリフト","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-162","date":"2026-02-06","exercise":"デッドリフト","weight":50,"reps":5,"sets":1,"memo":""},{"id":"bulk-msxsmniu-163","date":"2026-02-06","exercise":"スミスミリタリー","weight":30,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-164-split-0","date":"2026-02-06","exercise":"スミスミリタリー","weight":32.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-164-split-1","date":"2026-02-06","exercise":"スミスミリタリー","weight":32.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-165","date":"2026-02-06","exercise":"スミスミリタリー","weight":32.5,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-166","date":"2026-02-06","exercise":"バイク","weight":8,"reps":11,"sets":1,"memo":"有酸素"},{"id":"bulk-msxsmniu-167-split-0","date":"2026-02-03","exercise":"スクワット","weight":65,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-167-split-1","date":"2026-02-03","exercise":"スクワット","weight":65,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-167-split-2","date":"2026-02-03","exercise":"スクワット","weight":65,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-168-split-0","date":"2026-02-03","exercise":"チェストプレス","weight":35,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-168-split-1","date":"2026-02-03","exercise":"チェストプレス","weight":35,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-169-split-0","date":"2026-02-03","exercise":"チェストプレス","weight":42.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-169-split-1","date":"2026-02-03","exercise":"チェストプレス","weight":42.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-170","date":"2026-02-03","exercise":"チェストプレス","weight":42.5,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-171-split-0","date":"2026-01-27","exercise":"レッグプレス","weight":103,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-171-split-1","date":"2026-01-27","exercise":"レッグプレス","weight":103,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-171-split-2","date":"2026-01-27","exercise":"レッグプレス","weight":103,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-171-split-3","date":"2026-01-27","exercise":"レッグプレス","weight":103,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-171-split-4","date":"2026-01-27","exercise":"レッグプレス","weight":103,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-172","date":"2026-01-27","exercise":"ショルダープレス","weight":17.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-173-split-0","date":"2026-01-27","exercise":"ショルダープレス","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-173-split-1","date":"2026-01-27","exercise":"ショルダープレス","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-173-split-2","date":"2026-01-27","exercise":"ショルダープレス","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-173-split-3","date":"2026-01-27","exercise":"ショルダープレス","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-174-split-0","date":"2026-01-27","exercise":"スミスベンチプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-174-split-1","date":"2026-01-27","exercise":"スミスベンチプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-175","date":"2026-01-27","exercise":"スミスベンチプレス","weight":45,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-176","date":"2026-01-27","exercise":"スミスベンチプレス","weight":45,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-177","date":"2026-01-27","exercise":"スミスベンチプレス","weight":40,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-178-split-0","date":"2026-01-21","exercise":"スミスベンチプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-178-split-1","date":"2026-01-21","exercise":"スミスベンチプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-178-split-2","date":"2026-01-21","exercise":"スミスベンチプレス","weight":45,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-179","date":"2026-01-21","exercise":"スミスベンチプレス","weight":45,"reps":7,"sets":1,"memo":""},{"id":"bulk-msxsmniu-180-split-0","date":"2026-01-21","exercise":"ショルダープレス","weight":17.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-180-split-1","date":"2026-01-21","exercise":"ショルダープレス","weight":17.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-180-split-2","date":"2026-01-21","exercise":"ショルダープレス","weight":17.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-181","date":"2026-01-21","exercise":"ショルダープレス","weight":17.5,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-182","date":"2026-01-21","exercise":"ラットプルダウン","weight":42.5,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-183-split-0","date":"2026-01-21","exercise":"ラットプルダウン","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-183-split-1","date":"2026-01-21","exercise":"ラットプルダウン","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-184","date":"2026-01-21","exercise":"ラットプルダウン","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-185","date":"2026-01-16","exercise":"ベンチプレス","weight":40,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-186","date":"2026-01-16","exercise":"ベンチプレス","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-187-split-0","date":"2026-01-16","exercise":"ベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-187-split-1","date":"2026-01-16","exercise":"ベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-188","date":"2026-01-16","exercise":"ベンチプレス","weight":50,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-189","date":"2026-01-16","exercise":"ショルダープレス","weight":20,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-190-split-0","date":"2026-01-16","exercise":"ショルダープレス","weight":15,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-190-split-1","date":"2026-01-16","exercise":"ショルダープレス","weight":15,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-190-split-2","date":"2026-01-16","exercise":"ショルダープレス","weight":15,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-190-split-3","date":"2026-01-16","exercise":"ショルダープレス","weight":15,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-190-split-4","date":"2026-01-16","exercise":"ショルダープレス","weight":15,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-191-split-0","date":"2026-01-16","exercise":"アームカール","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-191-split-1","date":"2026-01-16","exercise":"アームカール","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-191-split-2","date":"2026-01-16","exercise":"アームカール","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-192-split-0","date":"2026-01-10","exercise":"スクワット","weight":65,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-192-split-1","date":"2026-01-10","exercise":"スクワット","weight":65,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-192-split-2","date":"2026-01-10","exercise":"スクワット","weight":65,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-193","date":"2026-01-10","exercise":"スミスベンチプレス","weight":50,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-194-split-0","date":"2026-01-10","exercise":"スミスベンチプレス","weight":45,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-194-split-1","date":"2026-01-10","exercise":"スミスベンチプレス","weight":45,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-195","date":"2026-01-10","exercise":"スミスベンチプレス","weight":45,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-196-split-0","date":"2026-01-10","exercise":"ショルダープレス","weight":10,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-196-split-1","date":"2026-01-10","exercise":"ショルダープレス","weight":10,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-197","date":"2026-01-10","exercise":"ショルダープレス","weight":15,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-198","date":"2026-01-10","exercise":"ショルダープレス","weight":15,"reps":8,"sets":1,"memo":""},{"id":"bulk-msxsmniu-199","date":"2026-01-10","exercise":"ショルダープレス","weight":15,"reps":9,"sets":1,"memo":""},{"id":"bulk-msxsmniu-200","date":"2026-01-02","exercise":"スミスベンチプレス","weight":40,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-201-split-0","date":"2026-01-02","exercise":"スミスベンチプレス","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-201-split-1","date":"2026-01-02","exercise":"スミスベンチプレス","weight":50,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-202","date":"2026-01-02","exercise":"スミスベンチプレス","weight":50,"reps":6,"sets":1,"memo":""},{"id":"bulk-msxsmniu-203","date":"2026-01-02","exercise":"スミスベンチプレス","weight":40,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-204-split-0","date":"2026-01-02","exercise":"アームカール","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-204-split-1","date":"2026-01-02","exercise":"アームカール","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-204-split-2","date":"2026-01-02","exercise":"アームカール","weight":20,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-205-split-0","date":"2026-01-02","exercise":"スクワット","weight":60,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-205-split-1","date":"2026-01-02","exercise":"スクワット","weight":60,"reps":10,"sets":1,"memo":""},{"id":"bulk-msxsmniu-205-split-2","date":"2026-01-02","exercise":"スクワット","weight":60,"reps":10,"sets":1,"memo":""},{"id":"00c64456-fb58-4610-87e8-034b3cbf5d8d","date":"2026-08-19","exercise":"スミスベンチプレス","weight":50,"reps":8,"sets":1,"memo":""},{"id":"c352d974-681b-46e9-a3a0-54f3ec0020ed","date":"2026-08-19","exercise":"スミスベンチプレス","weight":60,"reps":8,"sets":1,"memo":""},{"id":"85e10865-1c31-4ce9-9483-af2a2d20ad50","date":"2026-08-19","exercise":"スミスベンチプレス","weight":65,"reps":8,"sets":1,"memo":""},{"id":"758206c8-833a-4ced-bf43-935142bf0b92","date":"2026-08-19","exercise":"スミスベンチプレス","weight":67.5,"reps":5,"sets":1,"memo":""},{"id":"859aa7c7-8b6f-48ed-97d0-ab8692557039","date":"2026-08-19","exercise":"スミスベンチプレス","weight":62.5,"reps":8,"sets":1,"memo":""},{"id":"d5b692fe-c624-42db-882a-366ff69dff46","date":"2026-08-19","exercise":"スミスサポーテッドロー","weight":35,"reps":8,"sets":1,"memo":""},{"id":"3bdbc7bd-c68d-433f-913e-6a9f2d19763f","date":"2026-08-19","exercise":"スミスサポーテッドロー","weight":35,"reps":8,"sets":1,"memo":""},{"id":"b5c785db-0855-4641-b878-d22abdf54ab2","date":"2026-08-19","exercise":"スミスサポーテッドロー","weight":35,"reps":8,"sets":1,"memo":""},{"id":"0f8e31fd-7e1f-4ec6-829d-0f70772647f9","date":"2026-08-19","exercise":"アームカール","weight":10,"reps":10,"sets":1,"memo":""},{"id":"6761a694-2822-473c-b679-552bfcd112be","date":"2026-08-19","exercise":"アームカール","weight":10,"reps":10,"sets":1,"memo":""},{"id":"e3da01e0-2b6c-40a2-a0d1-1c791c7672a3","date":"2026-08-19","exercise":"アームカール","weight":10,"reps":10,"sets":1,"memo":""}];
  const SEED_EXERCISES = ["アームカール", "シーテッドロー", "ショルダープレス", "スクワット", "スミスアームカール", "スミスサポーテッドロー", "スミススクワット", "スミスベンチプレス", "スミスベントオーバーロー", "スミスミリタリー", "ダンベルベンチ", "チェストプレス", "デッドリフト", "ペクトラルフライ", "ベンチプレス", "ベントオーバーロー", "ミリタリープレス", "ラットプルダウン", "レッグプレス", "懸垂", "ジャンプ", "バイク", "ラン"];

  const CHART_WIDTH = 640;
  const CHART_MARGIN = { top: 14, right: 12, left: 54 };

  // 種目名から部位を推定する(2週間平均を部位単位でまとめて見せるため)。
  // 判定は sync.js の共通ロジックに委譲し、どれにも当てはまらなければ
  // 「その他」としてその種目単独で扱う。
  function categoryForExercise(name) {
    const found = MuscleSync.muscleGroupForExercise(name);
    return found ? { key: found.key, label: found.label } : { key: `other:${name}`, label: name };
  }

  // 種目選択セレクトを部位ごとにグルーピングする表示順。分類できない種目は
  // (2週間平均のときと違い)ばらばらの単独グループにせず「その他」にまとめ、
  // 有酸素は常に一番最後に表示する。
  const SELECT_GROUP_ORDER = ["chest", "back", "shoulder", "arm", "leg", "other", "cardio"];
  const SELECT_GROUP_LABELS = { chest: "胸", back: "背中", shoulder: "肩", arm: "腕", leg: "脚", other: "その他", cardio: "有酸素" };

  // 「スミス〜」種目を、同じグループ内にある素の種目(例: ベンチプレス)の
  // 直後に並べ替える(マシン違いだけの種目を選ぶときに隣で見比べられるように)。
  // 対応する素の種目が無い「スミス」種目(例: スミスサポーテッドロー)はそのまま。
  function smithBaseNameOf(name) {
    return name.startsWith("スミス") && name.length > 3 ? name.slice(3) : null;
  }

  function reorderSmithPairs(names) {
    const pairedBaseOf = new Map();
    names.forEach((n) => {
      const base = smithBaseNameOf(n);
      if (!base) return;
      const match = names.find((other) => other !== n && !smithBaseNameOf(other) && (other.includes(base) || base.includes(other)));
      if (match) pairedBaseOf.set(n, match);
    });

    const consumed = new Set();
    const result = [];
    names.forEach((n) => {
      if (consumed.has(n) || pairedBaseOf.has(n)) return;
      result.push(n);
      names.forEach((maybeSmith) => {
        if (pairedBaseOf.get(maybeSmith) === n && !consumed.has(maybeSmith)) {
          result.push(maybeSmith);
          consumed.add(maybeSmith);
        }
      });
    });
    return result;
  }

  // 各グループ内は五十音順ではなく、記録回数が多い(=よく使う)種目を先に表示する。
  // 使用回数が同じ場合は従来どおり五十音順にフォールバックする。
  function getExerciseUsageCounts() {
    const counts = new Map();
    records.forEach((r) => counts.set(r.exercise, (counts.get(r.exercise) || 0) + 1));
    return counts;
  }

  function groupExerciseNamesForSelect(names) {
    const usage = getExerciseUsageCounts();
    const buckets = new Map();
    names.forEach((n) => {
      const found = MuscleSync.muscleGroupForExercise(n);
      const key = found ? found.key : "other";
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(n);
    });
    buckets.forEach((list) => {
      list.sort((a, b) => (usage.get(b) || 0) - (usage.get(a) || 0) || MuscleSync.compareExerciseNames(a, b));
    });
    return SELECT_GROUP_ORDER.filter((k) => buckets.has(k)).map((k) => ({ label: SELECT_GROUP_LABELS[k], names: reorderSmithPairs(buckets.get(k)) }));
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
  /** @type {{id:string,date:string,weight:number}[]} */
  let bodyweights = loadBodyweights();
  let currentChartPoints = [];
  let recordsSha = null;
  let exercisesSha = null;
  let bodyweightsSha = null;

  const form = document.getElementById("record-form");
  const dateInput = document.getElementById("date");
  const exerciseInput = document.getElementById("exercise");
  const weightLabel = document.getElementById("weight-label");
  const repsLabel = document.getElementById("reps-label");
  const noExerciseHint = document.getElementById("no-exercise-hint");
  const addRecordBtn = document.getElementById("add-record-btn");
  const weightInput = document.getElementById("weight");
  const repsInput = document.getElementById("reps");
  const memoInput = document.getElementById("memo");
  const filterExercise = document.getElementById("filter-exercise");
  const historyRange = document.getElementById("history-range");
  const historySearch = document.getElementById("history-search");
  const chartExercise = document.getElementById("chart-exercise");
  const chartRange = document.getElementById("chart-range");
  const historyList = document.getElementById("history-list");
  const todaySection = document.getElementById("today-section");
  const todayList = document.getElementById("today-list");
  const chartPanels = document.getElementById("chart-panels");
  const chartWeightRepsSvg = document.getElementById("chart-weight-reps");
  const chartVolumeSvg = document.getElementById("chart-volume");
  const chartVolumeAvgSvg = document.getElementById("chart-volume-avg");
  const volumeAvgCategoryLabel = document.getElementById("volume-avg-category");
  const chartPrBadge = document.getElementById("chart-pr-badge");
  const chartPanelHint = document.getElementById("chart-panel-hint");
  const chartWeightRepsLabel = document.getElementById("chart-weight-reps-label");
  const chartVolumeLabel = document.getElementById("chart-volume-label");
  const chartEmpty = document.getElementById("chart-empty");
  const chartDetail = document.getElementById("chart-detail");
  const CHART_DETAIL_PLACEHOLDER = "グラフの点をタップすると詳細が表示されます";
  const bodyweightForm = document.getElementById("bodyweight-form");
  const bodyweightDateInput = document.getElementById("bodyweight-date");
  const bodyweightValueInput = document.getElementById("bodyweight-value");
  const addBodyweightBtn = document.getElementById("add-bodyweight-btn");
  const bodyweightEmpty = document.getElementById("bodyweight-empty");
  const chartBodyweightSvg = document.getElementById("chart-bodyweight");
  const bodyweightList = document.getElementById("bodyweight-list");
  const githubTokenInput = document.getElementById("github-token");
  const githubSaveBtn = document.getElementById("github-save-btn");
  const githubDisconnectBtn = document.getElementById("github-disconnect-btn");
  const syncStatus = document.getElementById("sync-status");

  MuscleSync.initThemeToggle(document.getElementById("theme-toggle"));

  dateInput.value = todayISO();
  bodyweightDateInput.value = todayISO();

  githubTokenInput.value = MuscleSync.getToken();
  if (githubTokenInput.value) {
    syncFromGithub();
    syncExercisesFromGithub();
    syncBodyweightFromGithub();
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
    bodyweightsSha = null;
    syncFromGithub();
    syncExercisesFromGithub();
    syncBodyweightFromGithub();
  });

  githubDisconnectBtn.addEventListener("click", function () {
    MuscleSync.setToken("");
    githubTokenInput.value = "";
    recordsSha = null;
    exercisesSha = null;
    bodyweightsSha = null;
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

  function handleDayCardDeleteClick(e) {
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
  }

  historyList.addEventListener("click", handleDayCardDeleteClick);
  todayList.addEventListener("click", handleDayCardDeleteClick);

  bodyweightForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random(),
      date: bodyweightDateInput.value,
      weight: parseFloat(bodyweightValueInput.value),
    };
    if (!entry.date || isNaN(entry.weight)) return;
    bodyweights.push(entry);
    bodyweights.sort((a, b) => a.date.localeCompare(b.date));
    saveBodyweights();
    pushBodyweightToGithub({ type: "add", entry });

    const keepDate = entry.date;
    bodyweightForm.reset();
    bodyweightDateInput.value = keepDate;
    renderBodyweight();
  });

  bodyweightList.addEventListener("click", function (e) {
    const deleteBtn = e.target.closest(".delete-btn");
    if (!deleteBtn) return;
    const id = deleteBtn.dataset.id;
    const entry = bodyweights.find((b) => b.id === id);
    if (!entry) return;
    const confirmed = window.confirm(`この体重記録を削除しますか？\n\n${formatDate(entry.date)}　${entry.weight}kg`);
    if (!confirmed) return;
    bodyweights = bodyweights.filter((b) => b.id !== id);
    saveBodyweights();
    pushBodyweightToGithub({ type: "delete", id });
    renderBodyweight();
  });

  filterExercise.addEventListener("change", renderHistory);
  historyRange.addEventListener("change", renderHistory);
  historySearch.addEventListener("input", renderHistory);
  chartExercise.addEventListener("change", renderChart);

  // 有酸素の種目を選んだときは、フォームのラベルを「重量・回数」から
  // 「強度・時間」に切り替える(バイクの負荷やランの時間などを入れやすくするため)。
  // 保存する項目自体はweight/repsのまま(グラフ・同期の仕組みを変えないため)。
  function updateWeightRepsLabels() {
    const isCardio = MuscleSync.isCardioExercise(exerciseInput.value);
    weightLabel.textContent = isCardio ? "強度" : "重量 (kg)";
    repsLabel.textContent = isCardio ? "時間 (分)" : "回数";
  }
  exerciseInput.addEventListener("change", updateWeightRepsLabels);
  chartRange.addEventListener("change", renderChart);

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

  function loadBodyweights() {
    try {
      const raw = localStorage.getItem(BODYWEIGHT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function saveBodyweights() {
    localStorage.setItem(BODYWEIGHT_KEY, JSON.stringify(bodyweights));
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

  async function syncBodyweightFromGithub() {
    const token = MuscleSync.getToken();
    if (!token) return;
    try {
      const result = await MuscleSync.getFile(token, BODYWEIGHT_PATH);
      if (!result.exists) {
        const sha = await MuscleSync.putFile(token, BODYWEIGHT_PATH, bodyweights, null, "Initial bodyweight sync");
        bodyweightsSha = sha;
      } else {
        bodyweights = result.data.slice().sort((a, b) => a.date.localeCompare(b.date));
        bodyweightsSha = result.sha;
        saveBodyweights();
        renderBodyweight();
      }
    } catch (err) {
      console.error("bodyweight sync failed", err);
    }
  }

  function applyPendingBodyweightChange(baseEntries, pendingChange) {
    if (!pendingChange) return baseEntries.slice();
    if (pendingChange.type === "add") {
      if (baseEntries.some((b) => b.id === pendingChange.entry.id)) return baseEntries.slice();
      return baseEntries.concat([pendingChange.entry]);
    }
    if (pendingChange.type === "delete") {
      return baseEntries.filter((b) => b.id !== pendingChange.id);
    }
    return baseEntries.slice();
  }

  async function pushBodyweightToGithub(pendingChange) {
    const token = MuscleSync.getToken();
    if (!token) return;
    try {
      const sha = await MuscleSync.putFile(token, BODYWEIGHT_PATH, bodyweights, bodyweightsSha, "Update bodyweight records");
      bodyweightsSha = sha;
    } catch (err) {
      if (err.conflict) {
        try {
          const result = await MuscleSync.getFile(token, BODYWEIGHT_PATH);
          bodyweights = applyPendingBodyweightChange(result.data, pendingChange).sort((a, b) => a.date.localeCompare(b.date));
          saveBodyweights();
          renderBodyweight();
          const sha2 = await MuscleSync.putFile(token, BODYWEIGHT_PATH, bodyweights, result.sha, "Update bodyweight records (merged)");
          bodyweightsSha = sha2;
        } catch (err2) {
          console.error("bodyweight sync failed", err2);
        }
      } else {
        console.error("bodyweight sync failed", err);
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
    renderTodaySection();
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
    updateWeightRepsLabels();

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

  // 1日分の記録を day-card の HTML に組み立てる(本日の記録欄・記録一覧の両方で使う共通処理)。
  function buildDayCardHtml(date, dayRecords, open) {
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
      <details class="day-card"${open ? " open" : ""}>
        <summary class="day-card-header">
          <h3>${formatDate(date)}</h3>
          ${dayVolume > 0 ? `<span class="volume-badge volume-badge-day">合計Vol ${Math.round(dayVolume)}</span>` : ""}
        </summary>
        ${exerciseGroups}
      </details>
    `;
  }

  function groupRecordsByDateDesc(recs) {
    const byDate = new Map();
    recs.forEach((r) => {
      if (!byDate.has(r.date)) byDate.set(r.date, []);
      byDate.get(r.date).push(r);
    });
    const dates = Array.from(byDate.keys()).sort((a, b) => b.localeCompare(a));
    return { byDate, dates };
  }

  // フォーム直下の「本日の記録」欄: 一番新しい日付の記録だけをすぐ確認できるように表示する。
  // 記録一覧(全期間)はグラフの下にあるので、ここは日々の入力確認用の軽量な表示。
  function renderTodaySection() {
    if (!records.length) {
      todaySection.hidden = true;
      todayList.innerHTML = "";
      return;
    }
    const { byDate, dates } = groupRecordsByDateDesc(records);
    const latestDate = dates[0];
    todaySection.hidden = false;
    todayList.innerHTML = buildDayCardHtml(latestDate, byDate.get(latestDate), true);
  }

  // 記録一覧の期間セレクタの基準は、絞り込み前の全記録のうち最新の日付にする
  // (グラフの期間セレクタと同じ考え方: 直近サボっていても空にならないように)。
  function historyRangeCutoffDate() {
    const rangeValue = historyRange.value;
    if (rangeValue === "all" || !records.length) return null;
    const latestDate = records.reduce((max, r) => (r.date > max ? r.date : max), records[0].date);
    return addDays(latestDate, -(parseInt(rangeValue, 10) - 1));
  }

  function renderHistory() {
    const cutoff = historyRangeCutoffDate();
    const term = historySearch.value.trim().toLowerCase();

    const filtered = records.filter((r) => {
      if (filterExercise.value && r.exercise !== filterExercise.value) return false;
      if (cutoff && r.date < cutoff) return false;
      if (term && !r.exercise.toLowerCase().includes(term) && !r.memo.toLowerCase().includes(term)) return false;
      return true;
    });

    if (!filtered.length) {
      historyList.innerHTML = '<p class="empty-message">記録がまだありません</p>';
      return;
    }

    const { byDate, dates } = groupRecordsByDateDesc(filtered);
    historyList.innerHTML = dates.map((date) => buildDayCardHtml(date, byDate.get(date), false)).join("");
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

  // 種目ごとの自己ベスト(全期間での最大重量)。期間セレクタでの絞り込みに関わらず、
  // 常に全記録から計算する(表示範囲を絞ったときにベストが消えてしまわないように)。
  function computePR(exercise) {
    const weights = records.filter((r) => r.exercise === exercise).map((r) => r.weight);
    return weights.length ? Math.max(...weights) : null;
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

    // 有酸素種目は「重量・回数」ではなく「強度・時間」で記録するため(フォームの
    // ラベル切り替えと同じ判定)、グラフ側のラベル・軸の単位もkg表記にしない。
    const isCardio = MuscleSync.isCardioExercise(exercise);
    chartPanelHint.textContent = isCardio
      ? "縦位置が強度、丸の中の数字が時間(分)。同じ日の複数セットは左から順に表示"
      : "縦位置が重量、丸の中の数字が回数。同じ日の複数セットは左から順に表示";
    chartWeightRepsLabel.textContent = isCardio ? "強度 ・ 時間(丸の中の数字・分)" : "重量(kg) ・ 回数(丸の中の数字)";
    chartVolumeLabel.textContent = isCardio ? "ボリューム (強度×時間×セット)" : "ボリューム (重量×回数×セット)";

    const pr = computePR(exercise);
    chartPrBadge.hidden = pr === null;
    if (pr !== null) chartPrBadge.textContent = isCardio ? `自己ベスト強度 ${pr}` : `自己ベスト ${pr}kg`;

    renderWeightRepsPanel(chartWeightRepsSvg, visiblePoints, 130, pr, isCardio);
    renderVolumePanel(chartVolumeSvg, visiblePoints, 130, isCardio);
    renderVolumeAvgPanel(chartVolumeAvgSvg, categoryPoints, 130, cutoff, category.key === "cardio");
  }

  // データ点をプロット幅いっぱい(0〜plotW)に配置すると、点数が少ない時に
  // 両端ぎりぎりに張り付いて不自然に見えるため、左右に少し余白を入れる。
  function xForPanel(i, count, plotW) {
    if (count === 1) return plotW / 2;
    const pad = Math.min(40, plotW * 0.08);
    return pad + (i / (count - 1)) * (plotW - pad * 2);
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
  function renderWeightRepsPanel(svgEl, points, height, pr, isCardio) {
    const plotW = CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;
    const plotH = height - CHART_MARGIN.top - 20;

    const gap = 2;
    // 円の大きさは意味づけではなく、中に書く回数の数字が収まるための最低限のサイズ。
    // 回数は常に整数で桁数も少ないため、以前(重量表示)より円がずっと揃いやすい。
    const rForReps = (reps) => Math.max(7, 3.5 + String(reps).length * 2.1);

    const allWeights = points.flatMap((p) => p.sets.map((s) => s.weight));
    const maxWeight = Math.max(...allWeights, 1) * 1.15;

    const xFor = (i) => xForPanel(i, points.length, plotW);
    const yFor = (weight) => plotH - (weight / maxWeight) * plotH;
    // 隣の日付の列にはみ出さないよう、1日分のクラスタ幅の上限を列間隔の92%に抑える。
    // 数字入りの円をぴったり並べてもその幅に収まらない日は、その日だけ数字なしの
    // 小さい点に切り替える(無理に詰めて数字が読めなくなるより、タップで詳細を
    // 見てもらう方が確実なため)。
    const columnSpacing = points.length > 1 ? plotW / (points.length - 1) : plotW;
    const maxClusterWidth = columnSpacing * 0.92;

    const axis = renderValueAxis(plotW, 0, maxWeight, 3, yFor, isCardio ? "" : "kg");

    let dots = "";
    // 日付の並び順に左から配置していき、直前の日のクラスタの右端より内側には
    // 絶対に置かない(=重ならない)ようにする。最初/最後の日付だけ特別扱いする
    // クランプ方式だと、隣の日との間隔を丸ごと使い切ってしまい重なりが起きたり、
    // 逆に余裕があるのに数字なし表示に切り替わってしまったりしたため。
    let prevRightEdge = -Infinity;
    points.forEach((p, dateIndex) => {
      const baseX = xFor(dateIndex);
      const n = p.sets.length;

      let useChip = true;
      let radii = p.sets.map((s) => rForReps(s.reps));
      let totalWidth = radii.reduce((sum, r) => sum + r * 2, 0) + gap * (n - 1);
      if (totalWidth > maxClusterWidth) {
        useChip = false;
        radii = p.sets.map(() => 4);
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
      cursor = Math.max(cursor, prevRightEdge + clusterGap); // 直前の日と重ねない
      cursor = Math.max(0, cursor); // プロット左端に収める
      // 右端をはみ出す場合は、直前の日と重なるほうへ戻すのではなく、この日の
      // クラスタ自体を残りスペースに収める。数字入りのままだと小さくなりすぎて
      // 読めなくなる場合は、先に数字なしの小さい点へ切り替えてから収める。
      if (cursor + totalWidth > plotW) {
        const available = Math.max(0, plotW - cursor);
        if (useChip && available < totalWidth) {
          useChip = false;
          radii = p.sets.map(() => 4);
          totalWidth = radii.reduce((sum, r) => sum + r * 2, 0) + gap * (n - 1);
          clusterGap = gap;
        }
        if (available < totalWidth) {
          const scale = totalWidth > 0 ? Math.max(0.4, available / totalWidth) : 1;
          radii = radii.map((r) => r * scale);
          clusterGap *= scale;
          totalWidth *= scale;
        }
      }
      prevRightEdge = cursor + totalWidth;

      p.sets.forEach((s, setIndex) => {
        const r = radii[setIndex];
        const x = cursor + r;
        cursor += r * 2 + clusterGap;
        const y = yFor(s.weight);
        const hitSize = Math.max(24, r * 2 + 4);
        const label = useChip
          ? `<text class="scatter-dot-label" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="central">${s.reps}</text>`
          : "";
        const isPr = pr !== null && pr !== undefined && s.weight === pr;
        dots += `
          <g class="chart-mark" data-date-index="${dateIndex}" data-set-index="${setIndex}">
            <circle class="scatter-dot${isPr ? " is-pr" : ""}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}"></circle>
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
  function renderVolumePanel(svgEl, points, height, isCardio) {
    const plotW = CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;
    const plotH = height - CHART_MARGIN.top - 20;

    let maxV = Math.max(...points.map((p) => p.volume), 1) * 1.15;

    const xFor = (i) => xForPanel(i, points.length, plotW);
    const yFor = (v) => plotH - (v / maxV) * plotH;
    const barWidth = Math.min(22, (plotW / points.length) * 0.55);

    const axis = renderValueAxis(plotW, 0, maxV, 3, yFor, isCardio ? "" : "kg");

    const bars = points
      .map((p, i) => {
        const x = xFor(i);
        const y = yFor(p.volume);
        // 両端の棒は軸ラベルやグラフ端にはみ出さないよう、幅は保ったまま内側にずらす
        // (幅だけ切り詰めると両端の棒が細く見えてしまうため)
        const barLeft = Math.max(0, Math.min(plotW - barWidth, x - barWidth / 2));
        return `
          <g class="chart-mark" data-date-index="${i}">
            <rect class="volume-bar" x="${barLeft.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${(plotH - y).toFixed(1)}"></rect>
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
  function renderVolumeAvgPanel(svgEl, points, height, cutoff, isCardio) {
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

    const axis = renderValueAxis(plotW, minV, maxV, 3, yFor, isCardio ? "" : "kg");

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
  function renderBodyweight() {
    const sorted = bodyweights.slice().sort((a, b) => a.date.localeCompare(b.date));

    if (!sorted.length) {
      bodyweightEmpty.style.display = "block";
      chartBodyweightSvg.hidden = true;
      bodyweightList.innerHTML = "";
      return;
    }

    bodyweightEmpty.style.display = "none";
    chartBodyweightSvg.hidden = false;
    renderBodyweightPanel(chartBodyweightSvg, sorted, 130);

    const recent = sorted.slice().reverse().slice(0, 5);
    bodyweightList.innerHTML = recent
      .map(
        (b) => `
      <div class="record-item">
        <div class="record-main">
          <span class="record-exercise">${formatDate(b.date)}　${b.weight}kg</span>
        </div>
        <div class="record-actions">
          <button class="delete-btn" data-id="${b.id}" aria-label="この体重記録を削除">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>
          </button>
        </div>
      </div>
    `
      )
      .join("");
  }

  // 体重は種目グラフと違って点数が少ないことが多いので、タップ詳細は付けず
  // 折れ線+下の直近一覧(数値そのまま)だけで十分読み取れるようにする。
  function renderBodyweightPanel(svgEl, points, height) {
    const plotW = CHART_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right;
    const plotH = height - CHART_MARGIN.top - 20;

    let minV = Math.min(...points.map((p) => p.weight));
    let maxV = Math.max(...points.map((p) => p.weight));
    if (minV === maxV) {
      minV -= 1;
      maxV += 1;
    }
    const pad = (maxV - minV) * 0.15;
    minV -= pad;
    maxV += pad;

    const xFor = (i) => xForPanel(i, points.length, plotW);
    const yFor = (v) => plotH - ((v - minV) / (maxV - minV)) * plotH;

    const axis = renderValueAxis(plotW, minV, maxV, 3, yFor, "kg");

    const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(i).toFixed(1)} ${yFor(p.weight).toFixed(1)}`).join(" ");

    const marks = points
      .map((p, i) => `<circle class="avg-point" cx="${xFor(i).toFixed(1)}" cy="${yFor(p.weight).toFixed(1)}" r="3"></circle>`)
      .join("");

    const dateLabels = renderDateLabels(points, xFor, plotH);

    svgEl.innerHTML = `
      <g transform="translate(${CHART_MARGIN.left},${CHART_MARGIN.top})">
        ${axis}
        <line class="chart-baseline" x1="0" y1="${plotH}" x2="${plotW}" y2="${plotH}"></line>
        <path class="avg-line" d="${pathD}"></path>
        ${marks}
        ${dateLabels}
      </g>
    `;
  }

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
  renderBodyweight();
})();
