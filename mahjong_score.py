"""麻雀の点数計算ロジック。

牌は "1m"〜"9m"（萬子）, "1p"〜"9p"（筒子）, "1s"〜"9s"（索子）,
"0m"/"0p"/"0s"（赤5）, "1z"〜"7z"（字牌: 東南西北白發中）という
2文字の表記で表す。実際の点数計算は mahjong ライブラリに委譲する。
"""

from mahjong.constants import EAST, NORTH, SOUTH, WEST
from mahjong.hand_calculating.hand import HandCalculator
from mahjong.hand_calculating.hand_config import HandConfig, OptionalRules
from mahjong.meld import Meld
from mahjong.tile import TilesConverter

WIND_MAP = {"east": EAST, "south": SOUTH, "west": WEST, "north": NORTH}
SUIT_PARAM = {"m": "man", "p": "pin", "s": "sou", "z": "honors"}

YAKU_NAME_JA = {
    "Aka Dora": "赤ドラ",
    "Chankan": "槍槓",
    "Chantai": "チャンタ",
    "Chiihou": "地和",
    "Chiitoitsu": "七対子",
    "Chinitsu": "清一色",
    "Chinroutou": "清老頭",
    "Chuuren Poutou": "九蓮宝燈",
    "Daburu Chuuren Poutou": "純正九蓮宝燈",
    "Kokushi Musou Juusanmen Matchi": "国士無双十三面待ち",
    "Double Open Riichi": "ダブル開立直",
    "Double Riichi": "ダブルリーチ",
    "Daichisei": "大地星",
    "Daisangen": "大三元",
    "Daisharin": "大車輪",
    "Dai Suushii": "大四喜",
    "Dora": "ドラ",
    "Haitei Raoyue": "海底摸月",
    "Yakuhai (haku)": "役牌 白",
    "Yakuhai (hatsu)": "役牌 發",
    "Yakuhai (chun)": "役牌 中",
    "Honitsu": "混一色",
    "Honroutou": "混老頭",
    "Houtei Raoyui": "河底撈魚",
    "Iipeiko": "一盃口",
    "Ippatsu": "一発",
    "Ittsu": "一気通貫",
    "Junchan": "純チャン",
    "Kokushi Musou": "国士無双",
    "Nagashi Mangan": "流し満貫",
    "Open Riichi": "開立直",
    "Paarenchan": "パーレンチャン",
    "Pinfu": "平和",
    "Renhou": "人和",
    "Renhou (yakuman)": "人和（役満）",
    "Riichi": "リーチ",
    "Rinshan Kaihou": "嶺上開花",
    "Yakuhai (round wind east)": "役牌 場風東",
    "Yakuhai (round wind south)": "役牌 場風南",
    "Yakuhai (round wind west)": "役牌 場風西",
    "Yakuhai (round wind north)": "役牌 場風北",
    "Ryanpeikou": "二盃口",
    "Ryuuiisou": "緑一色",
    "San Ankou": "三暗刻",
    "San Kantsu": "三槓子",
    "Sanshoku Doujun": "三色同順",
    "Sanshoku Doukou": "三色同刻",
    "Sashikomi": "差し込み",
    "Yakuhai (seat wind east)": "役牌 自風東",
    "Yakuhai (seat wind south)": "役牌 自風南",
    "Yakuhai (seat wind west)": "役牌 自風西",
    "Yakuhai (seat wind north)": "役牌 自風北",
    "Shou Sangen": "小三元",
    "Shousuushii": "小四喜",
    "Suu Ankou": "四暗刻",
    "Suu Ankou Tanki": "四暗刻単騎",
    "Suu Kantsu": "四槓子",
    "Tanyao": "タンヤオ",
    "Tenhou": "天和",
    "Toitoi": "トイトイ",
    "Tsuu Iisou": "字一色",
    "Menzen Tsumo": "門前清自摸和",
    "Ura Dora": "裏ドラ",
}

ERROR_MESSAGES_JA = {
    "no_yaku": "役がありません",
    "hand_not_correct": "手牌の形が正しくありません（合計枚数や面子を確認してください）",
}


class ScoreError(Exception):
    """リクエストの内容が不正なときに送出する例外。"""


def _validate_code(code):
    if not isinstance(code, str) or len(code) != 2 or code[1] not in "mpsz" or not code[0].isdigit():
        raise ScoreError(f"不正な牌の表記です: {code!r}")
    digit, suit = code[0], code[1]
    if suit == "z" and digit not in "1234567":
        raise ScoreError(f"不正な字牌です: {code!r}")
    return digit, suit


def codes_to_136(codes, has_aka_dora=True):
    """牌コードのリストを、入力順を保ったまま mahjong ライブラリの136形式に変換する。"""
    buckets = {"m": [], "p": [], "s": [], "z": []}
    positions = []
    for code in codes:
        digit, suit = _validate_code(code)
        buckets[suit].append(digit)
        positions.append((suit, len(buckets[suit]) - 1))

    kwargs = {}
    for suit, digits in buckets.items():
        if digits:
            kwargs[SUIT_PARAM[suit]] = "".join(digits)
    combined = TilesConverter.string_to_136_array(has_aka_dora=has_aka_dora, **kwargs)

    offsets = {}
    idx = 0
    for suit in ("m", "p", "s", "z"):
        offsets[suit] = idx
        idx += len(buckets[suit])

    return [combined[offsets[suit] + pos] for suit, pos in positions]


def _infer_meld_type(codes):
    if len(codes) == 4:
        return Meld.KAN
    if len(codes) != 3:
        raise ScoreError(f"面子の牌数が不正です（3枚か4枚にしてください）: {codes}")

    suits = {c[1] for c in codes}
    if len(suits) != 1:
        raise ScoreError(f"面子内の牌の種類が揃っていません: {codes}")
    suit = next(iter(suits))
    digits = sorted(0 if c[0] == "0" else int(c[0]) for c in codes)
    normalized = sorted(5 if d == 0 else d for d in digits)

    if normalized[0] == normalized[1] == normalized[2]:
        return Meld.PON
    if suit != "z" and normalized[1] == normalized[0] + 1 and normalized[2] == normalized[0] + 2:
        return Meld.CHI
    raise ScoreError(f"面子として成立していません: {codes}")


def calculate_score(payload):
    """フロントエンドからのリクエストを受け取り、点数計算結果の辞書を返す。"""
    concealed = payload.get("concealed_tiles") or []
    win_tile_code = payload.get("win_tile")
    melds_input = payload.get("melds") or []
    rules = payload.get("rules") or {}
    dora_indicator_codes = payload.get("dora_indicators") or []
    ura_dora_indicator_codes = payload.get("ura_dora_indicators") or []

    if not win_tile_code:
        raise ScoreError("上がり牌が指定されていません")

    has_aka_dora = bool(rules.get("aka_dora", True))

    full_codes = list(concealed) + [win_tile_code]
    win_index = len(concealed)

    meld_slices = []
    for meld in melds_input:
        codes = meld.get("tiles") or []
        start = len(full_codes)
        full_codes.extend(codes)
        meld_slices.append((start, start + len(codes)))

    expected_total = 14 + sum(1 for m in melds_input if len(m.get("tiles") or []) == 4)
    if len(full_codes) != expected_total:
        raise ScoreError(
            f"牌の合計枚数が正しくありません（現在{len(full_codes)}枚 / 必要{expected_total}枚）"
        )

    tiles_136 = codes_to_136(full_codes, has_aka_dora=has_aka_dora)
    win_tile_136 = tiles_136[win_index]

    melds = []
    for (start, end), meld_in in zip(meld_slices, melds_input):
        codes = meld_in.get("tiles") or []
        meld_type = _infer_meld_type(codes)
        opened = bool(meld_in.get("opened", True))
        melds.append(Meld(meld_type=meld_type, tiles=tiles_136[start:end], opened=opened))

    dora_indicators = (
        codes_to_136(dora_indicator_codes, has_aka_dora=False) if dora_indicator_codes else []
    )
    ura_dora_indicators = (
        codes_to_136(ura_dora_indicator_codes, has_aka_dora=False)
        if ura_dora_indicator_codes
        else []
    )

    round_wind = WIND_MAP.get(payload.get("round_wind", "east"), EAST)
    player_wind = WIND_MAP.get(payload.get("seat_wind", "east"), EAST)

    options = OptionalRules(
        has_open_tanyao=bool(rules.get("kuitan", True)),
        has_aka_dora=has_aka_dora,
        kazoe_limit=int(rules.get("kazoe_limit", 0)),
    )

    config = HandConfig(
        is_tsumo=bool(payload.get("is_tsumo", False)),
        is_riichi=bool(payload.get("is_riichi", False)),
        is_ippatsu=bool(payload.get("is_ippatsu", False)),
        is_rinshan=bool(payload.get("is_rinshan", False)),
        is_chankan=bool(payload.get("is_chankan", False)),
        is_haitei=bool(payload.get("is_haitei", False)),
        is_houtei=bool(payload.get("is_houtei", False)),
        is_daburu_riichi=bool(payload.get("is_daburu_riichi", False)),
        player_wind=player_wind,
        round_wind=round_wind,
        kyoutaku_number=int(payload.get("kyotaku", 0)),
        tsumi_number=int(payload.get("honba", 0)),
        options=options,
    )

    calculator = HandCalculator()
    result = calculator.estimate_hand_value(
        tiles_136,
        win_tile_136,
        melds=melds or None,
        dora_indicators=dora_indicators or None,
        ura_dora_indicators=ura_dora_indicators or None,
        config=config,
    )

    if result.error:
        return {"error": ERROR_MESSAGES_JA.get(result.error, result.error)}

    return {
        "han": result.han,
        "fu": result.fu,
        "yaku": [YAKU_NAME_JA.get(y.name, y.name) for y in result.yaku],
        "cost": result.cost,
    }
