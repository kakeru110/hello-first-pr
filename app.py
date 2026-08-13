"""麻雀点数自動計算アプリのサーバー。

写真から Claude の画像認識で牌を読み取り、mahjong_score.py の
点数計算ロジックに渡す。ルール（クイタンあり/なし等）はリクエストごとに
フロントエンドから渡す。
"""

import base64
import json
import os
import re

from anthropic import Anthropic
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory

from mahjong_score import ScoreError, calculate_score

load_dotenv()

app = Flask(__name__, static_folder="static", static_url_path="")

ANTHROPIC_MODEL = "claude-sonnet-5"
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}

TILE_NOTATION_GUIDE = (
    "麻雀牌の表記は「数字+アルファベット1文字」です。"
    "m=萬子, p=筒子, s=索子, z=字牌。萬子・筒子・索子は1〜9、"
    "ただし赤5は0で表します（例: 0s = 赤5索）。"
    "字牌は 1z=東 2z=南 3z=西 4z=北 5z=白 6z=發 7z=中 です。"
)


@app.get("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.post("/api/recognize")
def recognize():
    if "image" not in request.files:
        return jsonify(error="画像が送信されていません"), 400

    file = request.files["image"]
    image_bytes = file.read()
    if not image_bytes:
        return jsonify(error="画像が空です"), 400

    media_type = file.mimetype if file.mimetype in ALLOWED_IMAGE_TYPES else "image/jpeg"

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return jsonify(error="サーバーに ANTHROPIC_API_KEY が設定されていません"), 500

    prompt = (
        "この画像に写っている麻雀牌をすべて読み取ってください。\n"
        + TILE_NOTATION_GUIDE
        + "\n読み取った牌を画像内の並び順のまま、JSONのみで"
        ' {"tiles": ["1m", "2m", ...]} の形式で出力してください。'
        "前後に説明文やコードブロック記号を付けないでください。"
    )

    try:
        client = Anthropic(api_key=api_key)
        message = client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": base64.b64encode(image_bytes).decode("ascii"),
                            },
                        },
                        {"type": "text", "text": prompt},
                    ],
                }
            ],
        )
    except Exception as exc:  # noqa: BLE001 - 外部APIエラーをそのままユーザーに伝える
        return jsonify(error=f"画像認識に失敗しました: {exc}"), 502

    text = "".join(block.text for block in message.content if block.type == "text")
    tiles = _extract_tiles(text)
    if tiles is None:
        return jsonify(error="牌の読み取り結果を解析できませんでした", raw=text), 502

    return jsonify(tiles=tiles)


def _extract_tiles(text):
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return None
    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError:
        return None

    tiles = data.get("tiles")
    if not isinstance(tiles, list):
        return None

    valid = [t for t in tiles if isinstance(t, str) and len(t) == 2 and t[1] in "mpsz" and t[0].isdigit()]
    return valid


@app.post("/api/score")
def score():
    payload = request.get_json(silent=True) or {}
    try:
        result = calculate_score(payload)
    except ScoreError as exc:
        return jsonify(error=str(exc)), 400
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
