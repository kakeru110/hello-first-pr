# こんにちは最初のPR

はじめてのPull Request（PR）を練習するためのリポジトリです。

## これは何？

GitHubでのコード変更の提案（Pull Request）の流れを学ぶための、小さな練習用プロジェクトです。

## 麻雀点数自動計算アプリ

手牌の写真をアップロードすると、Claudeの画像認識で牌を読み取り、点数（翻・符・点数）を自動計算するWebアプリです。
クイタン・赤ドラなどのルールは事前に設定でき、ブラウザに保存されます。

### セットアップ

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# .env に ANTHROPIC_API_KEY を設定する
```

### 起動

```bash
python app.py
```

`http://localhost:5000` にアクセスすると使用できます。

### 使い方

1. 「ルール設定」でクイタンあり/なしなどを設定する（設定はブラウザに保存され、次回以降も引き継がれます）
2. 手牌14枚が写った写真をアップロードし、「この写真から牌を読み取る」を押す
3. 読み取り結果を確認し、上がり牌や鳴いた面子があれば該当欄に振り分ける
4. ツモ/ロン、リーチ、場風・自風、ドラ表示牌などの和了状況を入力する
5. 「点数を計算する」を押すと、翻・符・点数・成立した役が表示される

写真からの牌認識はAIによる推定のため、誤読することがあります。計算前に手牌の内容を必ず確認してください。

### デプロイ（Render.comの例・無料枠あり）

1. [Render](https://render.com/) にGitHubアカウントでサインアップする
2. ダッシュボードで「New +」→「Web Service」を選び、このリポジトリを接続する
3. ブランチに `claude/mahjong-score-automation-29dbsl`（またはマージ後は `main`）を選ぶ
4. `render.yaml` を自動検出するので、設定はそのままでOK（Build: `pip install -r requirements.txt` / Start: `gunicorn app:app --bind 0.0.0.0:$PORT`）
5. 環境変数 `ANTHROPIC_API_KEY` に自分のAPIキーを設定する
6. 「Create Web Service」でデプロイすると、`https://<サービス名>.onrender.com` のようなURLが発行される

無料プランはしばらくアクセスがないとスリープし、次のアクセス時に起動まで数十秒かかります。
