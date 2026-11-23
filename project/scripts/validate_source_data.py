#!/usr/bin/env python3
"""Kiểm tra raw bất biến và các lesson thay thế/hiệu đính đã được duyệt."""
from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
LESSONS = ROOT / "data" / "lessons"
errors = []
warnings = []

def load(name):
    p = RAW / name
    if not p.is_file():
        errors.append(f"Thiếu tệp: {p}")
        return None
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        errors.append(f"Không đọc được {name}: {exc}")
        return None

def load_lesson(name):
    p = LESSONS / name
    if not p.is_file():
        errors.append(f"Thiếu lesson thay thế: {p}")
        return None
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        errors.append(f"Không đọc được lesson {name}: {exc}")
        return None

def two_word_name(value):
    return isinstance(value, str) and len(value.strip().split()) == 2

gs = load("getting_started_unit3.json")
voc = load("unit3_game_data.json")
part5 = load_lesson("unit3_part5_designed.json")
acl1 = load_lesson("unit3_a_closer_look1.json")
project = load_lesson("unit3_project.json")
bonus = load_lesson("unit3_bonus.json")
review = load_lesson("review1.json")
review_bonus = load_lesson("review1_bonus.json")
review2 = load_lesson("review2.json")
review2_bonus = load_lesson("review2_bonus.json")
unit4 = load_lesson("unit4_phase1.json")
unit1 = load_lesson("unit1_phase1.json")
unit1_phase2 = load_lesson("unit1_phase2.json")
unit1_bonus = load_lesson("unit1_bonus.json")
unit2 = load_lesson("unit2_phase1.json")
unit2_phase2 = load_lesson("unit2_phase2.json")
unit2_bonus = load_lesson("unit2_bonus.json")
unit4_phase2 = load_lesson("unit4_phase2.json")
unit4_bonus = load_lesson("unit4_bonus.json")
unit5 = load_lesson("unit5_phase1.json")
unit5_phase2 = load_lesson("unit5_phase2.json")
unit5_bonus = load_lesson("unit5_bonus.json")
unit6 = load_lesson("unit6_phase1.json")
unit6_phase2 = load_lesson("unit6_phase2.json")
unit6_bonus = load_lesson("unit6_bonus.json")
unit7_source = load_lesson("unit7_source.json")
unit7_bonus = load_lesson("unit7_bonus.json")
unit8_source = load_lesson("unit8_source.json")
unit8_bonus = load_lesson("unit8_bonus.json")
unit9_source = load_lesson("unit9_source.json")
review3_source = load_lesson("review3_source.json")
unit10_source = load_lesson("unit10_source.json")
unit11_source = load_lesson("unit11_source.json")
unit12_source = load_lesson("unit12_source.json")
review4_source = load_lesson("review4_source.json")
math6_s1_lesson1 = load_lesson("math6_s1_lesson1.json")
math6_s1_lesson2 = load_lesson("math6_s1_lesson2.json")
math6_s1_lesson3 = load_lesson("math6_s1_lesson3.json")
math6_s1_lesson4 = load_lesson("math6_s1_lesson4.json")
math6_s1_lesson5 = load_lesson("math6_s1_lesson5.json")
math6_s1_chapter1_practice = load_lesson("math6_s1_chapter1_practice.json")
math6_s1_chapter1_review = load_lesson("math6_s1_chapter1_review.json")

def validate_math_review(source, review_id, sequence, expected_games, label):
    if not isinstance(source, dict):
        errors.append(f"{label} source lesson không phải object hợp lệ")
        return
    games = source.get("games", {})
    valid = (
        source.get("review_id") == review_id
        and source.get("branch_id") == review_id
        and source.get("course_id") == "math-6-semester-1"
        and source.get("source_status") == "user-provided-reference"
        and source.get("usage_scope") == "personal-family"
        and source.get("review", {}).get("sequence") == sequence
        and len(source.get("review", {}).get("objectives", [])) >= 4
        and len(source.get("foundations", [])) >= 3
        and len(source.get("game_meta", [])) == 6
        and {item.get("id") for item in source.get("game_meta", [])} == expected_games
        and all(item.get("teaching_vi") and item.get("default_hint_vi") for item in source.get("game_meta", []))
        and set(games) == expected_games
        and all(isinstance(games.get(name), list) and len(games[name]) == 10 for name in expected_games)
        and all(item.get("a") not in item.get("d", []) and len(item.get("d", [])) == 3 and len({item.get("a"), *item.get("d", [])}) == 4 for name in expected_games for item in games.get(name, []))
        and all(item.get("q") and item.get("e") and item.get("s") in {"user-provided-reference", "ai-generated"} for name in expected_games for item in games.get(name, []))
    )
    if not valid:
        errors.append(f"{label} phải có 3 khối bài giảng và đúng 6 trò chơi × 10 câu có đáp án, phản hồi và provenance")

validate_math_review(math6_s1_chapter1_practice, "math6-s1-chapter1-practice", 6, {"place-value", "sets-order", "add-subtract", "multiply-divide", "word-problem", "mixed"}, "Toán 6 Luyện tập chung Chương I")
validate_math_review(math6_s1_chapter1_review, "math6-s1-chapter1-review", 7, {"number-writing", "neighbors-order", "operations", "powers-order", "applications", "chapter-mastery"}, "Toán 6 Bài tập cuối Chương I")

if isinstance(unit7_source, dict):
    unit7_banks = unit7_source.get("banks", {})
    expected_banks = {
        "programmes", "vocabulary", "adjectives", "sounds", "question_words",
        "tongue_twisters", "conjunctions", "communication", "tv_guide", "listening", "project", "project_checklist",
    }
    unit7_valid = (
        unit7_source.get("lesson_id") == "unit7-source"
        and unit7_source.get("source_status") == "user-provided-reference"
        and unit7_source.get("usage_scope") == "personal-family"
        and unit7_source.get("unit", {}).get("number") == 7
        and len(unit7_source.get("dialogue", [])) == 12
        and set(unit7_banks) == expected_banks
        and all(isinstance(unit7_banks.get(name), list) and len(unit7_banks[name]) == 10 for name in expected_banks)
        and all(item.get("translation") for item in unit7_source.get("dialogue", []))
    )
    if not unit7_valid:
        errors.append("Unit 7 phải giữ đủ 12 lượt thoại, 12 ngân hàng × 10 mục và bản dịch hội thoại")
else:
    errors.append("Unit 7 source lesson không phải object hợp lệ")

if isinstance(unit7_bonus, dict):
    selected = unit7_bonus.get("selected_variants", [])
    stages = unit7_bonus.get("stages", {})
    unit7_bonus_valid = unit7_bonus.get("lesson_id") == "unit7-bonus" and selected == ["treasure", "boss", "detective"]
    for stage_id in selected:
        rounds = stages.get(stage_id, {}).get("rounds", [])
        unit7_bonus_valid = unit7_bonus_valid and len(rounds) == 10 and len({item.get("id") for item in rounds if isinstance(item, dict)}) == 10
        unit7_bonus_valid = unit7_bonus_valid and all(item.get("source_status") == "ai-generated" and two_word_name(item.get("character_name")) and bool(item.get("answer")) for item in rounds)
    if not unit7_bonus_valid:
        errors.append("Unit 7 Bonus phải có đúng 3 màn × 10 câu AI với tên nhân vật hai từ")
else:
    errors.append("Unit 7 Bonus lesson không phải object hợp lệ")

if isinstance(unit8_source, dict):
    unit8_banks = unit8_source.get("banks", {})
    expected_unit8_banks = {
        "sports", "equipment", "sounds", "past_simple", "imperatives", "communication",
        "pele", "listening", "looking_back", "project", "project_checklist",
    }
    unit8_valid = (
        unit8_source.get("lesson_id") == "unit8-source"
        and unit8_source.get("source_status") == "user-provided-reference"
        and unit8_source.get("usage_scope") == "personal-family"
        and unit8_source.get("unit", {}).get("number") == 8
        and len(unit8_source.get("dialogue", [])) == 10
        and set(unit8_banks) == expected_unit8_banks
        and all(isinstance(unit8_banks.get(name), list) and len(unit8_banks[name]) >= 5 for name in expected_unit8_banks)
        and all(item.get("translation") for item in unit8_source.get("dialogue", []))
    )
    if not unit8_valid:
        errors.append("Unit 8 phải giữ đủ 10 lượt thoại, 11 ngân hàng nguồn và bản dịch hội thoại")
else:
    errors.append("Unit 8 source lesson không phải object hợp lệ")

if isinstance(unit8_bonus, dict):
    selected = unit8_bonus.get("selected_variants", [])
    stages = unit8_bonus.get("stages", {})
    unit8_bonus_valid = unit8_bonus.get("lesson_id") == "unit8-bonus" and selected == ["treasure", "boss", "detective"]
    for stage_id in selected:
        rounds = stages.get(stage_id, {}).get("rounds", [])
        unit8_bonus_valid = unit8_bonus_valid and len(rounds) == 10 and len({item.get("id") for item in rounds if isinstance(item, dict)}) == 10
        unit8_bonus_valid = unit8_bonus_valid and all(item.get("source_status") == "ai-generated" and two_word_name(item.get("character_name")) and bool(item.get("answer")) for item in rounds)
    if not unit8_bonus_valid:
        errors.append("Unit 8 Bonus phải có đúng 3 màn × 10 câu AI với tên nhân vật hai từ")
else:
    errors.append("Unit 8 Bonus lesson không phải object hợp lệ")

if isinstance(unit9_source, dict):
    unit9_banks = unit9_source.get("banks", {})
    expected_unit9_banks = {"topic", "vocabulary", "sounds", "grammar", "communication", "reading", "listening", "looking_back", "project", "project_checklist"}
    unit9_valid = (
        unit9_source.get("lesson_id") == "unit9-source"
        and unit9_source.get("source_status") == "user-provided-reference"
        and unit9_source.get("usage_scope") == "personal-family"
        and unit9_source.get("unit", {}).get("number") == 9
        and len(unit9_source.get("dialogue", [])) == 10
        and set(unit9_banks) == expected_unit9_banks
        and all(isinstance(unit9_banks.get(name), list) and len(unit9_banks[name]) >= 5 for name in expected_unit9_banks)
        and all(item.get("translation") for item in unit9_source.get("dialogue", []))
        and all(item.get("source_status") == "ai-generated" for item in unit9_banks.get("listening", []))
    )
    if not unit9_valid:
        errors.append("Unit 9 phải giữ đủ hội thoại, 10 ngân hàng nguồn, bản dịch và nhãn AI cho nghe thay thế")
else:
    errors.append("Unit 9 source lesson không phải object hợp lệ")

if isinstance(review3_source, dict):
    review3_banks = review3_source.get("banks", {})
    expected_review3_banks = {"pronunciation", "vocabulary", "grammar", "reading", "listening", "writing"}
    review3_valid = (
        review3_source.get("lesson_id") == "review3-source"
        and review3_source.get("source_status") == "user-provided-reference"
        and review3_source.get("usage_scope") == "personal-family"
        and review3_source.get("review", {}).get("number") == 3
        and set(review3_banks) == expected_review3_banks
        and all(isinstance(review3_banks.get(name), list) and len(review3_banks[name]) == 10 for name in expected_review3_banks)
        and all(item.get("translation") for name in expected_review3_banks for item in review3_banks.get(name, []))
        and all(item.get("audio_text") for item in review3_banks.get("listening", []))
    )
    if not review3_valid:
        errors.append("Review 3 phải có đúng 6 ngân hàng × 10 câu, bản dịch và audio nghe thay thế")
else:
    errors.append("Review 3 source lesson không phải object hợp lệ")

if isinstance(unit10_source, dict):
    unit10_banks = unit10_source.get("banks", {})
    expected_unit10_banks = {"topic", "vocabulary", "sounds", "grammar", "communication", "reading", "listening", "looking_back", "project", "project_checklist"}
    unit10_valid = (
        unit10_source.get("lesson_id") == "unit10-source"
        and unit10_source.get("source_status") == "user-provided-reference"
        and unit10_source.get("usage_scope") == "personal-family"
        and unit10_source.get("unit", {}).get("number") == 10
        and len(unit10_source.get("dialogue", [])) == 10
        and set(unit10_banks) == expected_unit10_banks
        and all(isinstance(unit10_banks.get(name), list) and len(unit10_banks[name]) >= 5 for name in expected_unit10_banks)
        and all(item.get("translation") for item in unit10_source.get("dialogue", []))
        and all(item.get("source_status") == "ai-generated" for item in unit10_banks.get("listening", []))
    )
    if not unit10_valid:
        errors.append("Unit 10 phải giữ đủ hội thoại, 10 ngân hàng nguồn, bản dịch và nhãn AI cho nghe thay thế")
else:
    errors.append("Unit 10 source lesson không phải object hợp lệ")

if isinstance(unit11_source, dict):
    unit11_banks = unit11_source.get("banks", {})
    expected_unit11_banks = {"topic", "vocabulary", "sounds", "grammar", "communication", "reading", "listening", "looking_back", "project", "project_checklist"}
    unit11_valid = (
        unit11_source.get("lesson_id") == "unit11-source"
        and unit11_source.get("source_status") == "user-provided-reference"
        and unit11_source.get("usage_scope") == "personal-family"
        and unit11_source.get("unit", {}).get("number") == 11
        and len(unit11_source.get("dialogue", [])) == 10
        and set(unit11_banks) == expected_unit11_banks
        and all(isinstance(unit11_banks.get(name), list) and len(unit11_banks[name]) >= 5 for name in expected_unit11_banks)
        and all(item.get("translation") for item in unit11_source.get("dialogue", []))
        and all(item.get("source_status") == "ai-generated" for item in unit11_banks.get("listening", []))
    )
    if not unit11_valid:
        errors.append("Unit 11 phải giữ đủ hội thoại, 10 ngân hàng nguồn, bản dịch và nhãn AI cho nghe thay thế")
else:
    errors.append("Unit 11 source lesson không phải object hợp lệ")

if isinstance(unit12_source, dict):
    unit12_banks = unit12_source.get("banks", {})
    expected_unit12_banks = {"topic", "vocabulary", "sounds", "grammar", "communication", "reading", "listening", "looking_back", "project", "project_checklist"}
    unit12_valid = (
        unit12_source.get("lesson_id") == "unit12-source"
        and unit12_source.get("source_status") == "user-provided-reference"
        and unit12_source.get("usage_scope") == "personal-family"
        and unit12_source.get("unit", {}).get("number") == 12
        and len(unit12_source.get("dialogue", [])) == 10
        and set(unit12_banks) == expected_unit12_banks
        and all(isinstance(unit12_banks.get(name), list) and len(unit12_banks[name]) >= 5 for name in expected_unit12_banks)
        and all(item.get("translation") for item in unit12_source.get("dialogue", []))
        and all(item.get("source_status") == "ai-generated" for item in unit12_banks.get("listening", []))
    )
    if not unit12_valid:
        errors.append("Unit 12 phải giữ đủ hội thoại, 10 ngân hàng nguồn, bản dịch và nhãn AI cho nghe thay thế")
else:
    errors.append("Unit 12 source lesson không phải object hợp lệ")

if isinstance(review4_source, dict):
    review4_banks = review4_source.get("banks", {})
    expected_review4_banks = {"pronunciation", "vocabulary", "grammar", "reading", "listening", "writing"}
    review4_valid = (
        review4_source.get("lesson_id") == "review4-source"
        and review4_source.get("source_status") == "user-provided-reference"
        and review4_source.get("usage_scope") == "personal-family"
        and review4_source.get("review", {}).get("number") == 4
        and set(review4_banks) == expected_review4_banks
        and all(isinstance(review4_banks.get(name), list) and len(review4_banks[name]) == 10 for name in expected_review4_banks)
        and all(item.get("translation") for name in expected_review4_banks for item in review4_banks.get(name, []))
        and all(item.get("audio_text") and item.get("source_status") == "ai-generated" for item in review4_banks.get("listening", []))
    )
    if not review4_valid:
        errors.append("Review 4 phải có đúng 6 ngân hàng × 10 câu, bản dịch và audio nghe thay thế có nhãn AI")
else:
    errors.append("Review 4 source lesson không phải object hợp lệ")

if isinstance(math6_s1_lesson1, dict):
    math_games = math6_s1_lesson1.get("games", {})
    expected_math_games = {"identify", "membership", "notation", "listing", "natural", "describe"}
    math_valid = (
        math6_s1_lesson1.get("lesson_id") == "math6-s1-lesson1"
        and math6_s1_lesson1.get("course_id") == "math-6-semester-1"
        and math6_s1_lesson1.get("branch_id") == "math6-s1-lesson1"
        and math6_s1_lesson1.get("source_status") == "user-provided-reference"
        and math6_s1_lesson1.get("usage_scope") == "personal-family"
        and math6_s1_lesson1.get("lesson", {}).get("number") == 1
        and len(math6_s1_lesson1.get("foundations", [])) >= 3
        and set(math_games) == expected_math_games
        and all(isinstance(math_games.get(name), list) and len(math_games[name]) == 10 for name in expected_math_games)
        and all(item.get("answer") in item.get("options", []) for name in expected_math_games for item in math_games.get(name, []))
        and all(item.get("hint_vi") and item.get("task_vi") and item.get("explanation_vi") for name in expected_math_games for item in math_games.get(name, []))
        and all(item.get("source_status") in {"user-provided-reference", "ai-generated"} for name in expected_math_games for item in math_games.get(name, []))
    )
    if not math_valid:
        errors.append("Toán 6 Bài 1 phải có 3 khối bài giảng và đúng 6 trò chơi × 10 câu có đáp án, gợi ý, phản hồi và provenance")
else:
    errors.append("Toán 6 Bài 1 source lesson không phải object hợp lệ")

if isinstance(math6_s1_lesson2, dict):
    math2_games = math6_s1_lesson2.get("games", {})
    expected_math2_games = {"place-value", "expanded", "read-write", "roman-read", "roman-write", "mixed"}
    math2_valid = (
        math6_s1_lesson2.get("lesson_id") == "math6-s1-lesson2"
        and math6_s1_lesson2.get("course_id") == "math-6-semester-1"
        and math6_s1_lesson2.get("branch_id") == "math6-s1-lesson2"
        and math6_s1_lesson2.get("source_status") == "user-provided-reference"
        and math6_s1_lesson2.get("usage_scope") == "personal-family"
        and math6_s1_lesson2.get("lesson", {}).get("number") == 2
        and len(math6_s1_lesson2.get("foundations", [])) >= 3
        and len(math6_s1_lesson2.get("game_meta", [])) == 6
        and {item.get("id") for item in math6_s1_lesson2.get("game_meta", [])} == expected_math2_games
        and all(item.get("teaching_vi") for item in math6_s1_lesson2.get("game_meta", []))
        and set(math2_games) == expected_math2_games
        and all(isinstance(math2_games.get(name), list) and len(math2_games[name]) == 10 for name in expected_math2_games)
        and all(item.get("answer") in item.get("options", []) and len(item.get("options", [])) == 4 for name in expected_math2_games for item in math2_games.get(name, []))
        and all(item.get("hint_vi") and item.get("task_vi") and item.get("explanation_vi") for name in expected_math2_games for item in math2_games.get(name, []))
        and all(item.get("source_status") in {"user-provided-reference", "ai-generated"} for name in expected_math2_games for item in math2_games.get(name, []))
    )
    if not math2_valid:
        errors.append("Toán 6 Bài 2 phải có 3 khối bài giảng và đúng 6 trò chơi × 10 câu có đáp án, gợi ý, phản hồi và provenance")
else:
    errors.append("Toán 6 Bài 2 source lesson không phải object hợp lệ")

if isinstance(math6_s1_lesson3, dict):
    math3_games = math6_s1_lesson3.get("games", {})
    expected_math3_games = {"number-line", "compare", "neighbors", "order-chain", "inequality", "conditional-set"}
    math3_valid = (
        math6_s1_lesson3.get("lesson_id") == "math6-s1-lesson3"
        and math6_s1_lesson3.get("course_id") == "math-6-semester-1"
        and math6_s1_lesson3.get("branch_id") == "math6-s1-lesson3"
        and math6_s1_lesson3.get("source_status") == "user-provided-reference"
        and math6_s1_lesson3.get("usage_scope") == "personal-family"
        and math6_s1_lesson3.get("lesson", {}).get("number") == 3
        and len(math6_s1_lesson3.get("foundations", [])) >= 3
        and len(math6_s1_lesson3.get("game_meta", [])) == 6
        and {item.get("id") for item in math6_s1_lesson3.get("game_meta", [])} == expected_math3_games
        and all(item.get("teaching_vi") for item in math6_s1_lesson3.get("game_meta", []))
        and set(math3_games) == expected_math3_games
        and all(isinstance(math3_games.get(name), list) and len(math3_games[name]) == 10 for name in expected_math3_games)
        and all(item.get("answer") in item.get("options", []) and len(item.get("options", [])) == 4 for name in expected_math3_games for item in math3_games.get(name, []))
        and all(item.get("hint_vi") and item.get("task_vi") and item.get("explanation_vi") for name in expected_math3_games for item in math3_games.get(name, []))
        and all(item.get("source_status") in {"user-provided-reference", "ai-generated"} for name in expected_math3_games for item in math3_games.get(name, []))
    )
    if not math3_valid:
        errors.append("Toán 6 Bài 3 phải có 3 khối bài giảng và đúng 6 trò chơi × 10 câu có đáp án, gợi ý, phản hồi và provenance")
else:
    errors.append("Toán 6 Bài 3 source lesson không phải object hợp lệ")

if isinstance(math6_s1_lesson4, dict):
    math4_games = math6_s1_lesson4.get("games", {})
    expected_math4_games = {"terms", "addition", "smart-sum", "subtraction", "find-x", "word-problem"}
    math4_valid = (
        math6_s1_lesson4.get("lesson_id") == "math6-s1-lesson4"
        and math6_s1_lesson4.get("course_id") == "math-6-semester-1"
        and math6_s1_lesson4.get("branch_id") == "math6-s1-lesson4"
        and math6_s1_lesson4.get("source_status") == "user-provided-reference"
        and math6_s1_lesson4.get("usage_scope") == "personal-family"
        and math6_s1_lesson4.get("lesson", {}).get("number") == 4
        and len(math6_s1_lesson4.get("foundations", [])) >= 3
        and len(math6_s1_lesson4.get("game_meta", [])) == 6
        and {item.get("id") for item in math6_s1_lesson4.get("game_meta", [])} == expected_math4_games
        and all(item.get("teaching_vi") for item in math6_s1_lesson4.get("game_meta", []))
        and set(math4_games) == expected_math4_games
        and all(isinstance(math4_games.get(name), list) and len(math4_games[name]) == 10 for name in expected_math4_games)
        and all(item.get("answer") in item.get("options", []) and len(item.get("options", [])) == 4 for name in expected_math4_games for item in math4_games.get(name, []))
        and all(item.get("hint_vi") and item.get("task_vi") and item.get("explanation_vi") for name in expected_math4_games for item in math4_games.get(name, []))
        and all(item.get("source_status") in {"user-provided-reference", "ai-generated"} for name in expected_math4_games for item in math4_games.get(name, []))
    )
    if not math4_valid:
        errors.append("Toán 6 Bài 4 phải có 3 khối bài giảng và đúng 6 trò chơi × 10 câu có đáp án, gợi ý, phản hồi và provenance")
else:
    errors.append("Toán 6 Bài 4 source lesson không phải object hợp lệ")

if isinstance(math6_s1_lesson5, dict):
    math5_games = math6_s1_lesson5.get("games", {})
    expected_math5_games = {"terms", "multiplication", "smart-product", "division", "remainder", "word-problem"}
    math5_valid = (
        math6_s1_lesson5.get("lesson_id") == "math6-s1-lesson5"
        and math6_s1_lesson5.get("course_id") == "math-6-semester-1"
        and math6_s1_lesson5.get("branch_id") == "math6-s1-lesson5"
        and math6_s1_lesson5.get("source_status") == "user-provided-reference"
        and math6_s1_lesson5.get("usage_scope") == "personal-family"
        and math6_s1_lesson5.get("lesson", {}).get("number") == 5
        and len(math6_s1_lesson5.get("foundations", [])) >= 3
        and len(math6_s1_lesson5.get("game_meta", [])) == 6
        and {item.get("id") for item in math6_s1_lesson5.get("game_meta", [])} == expected_math5_games
        and all(item.get("teaching_vi") for item in math6_s1_lesson5.get("game_meta", []))
        and set(math5_games) == expected_math5_games
        and all(isinstance(math5_games.get(name), list) and len(math5_games[name]) == 10 for name in expected_math5_games)
        and all(item.get("answer") in item.get("options", []) and len(item.get("options", [])) == 4 for name in expected_math5_games for item in math5_games.get(name, []))
        and all(item.get("hint_vi") and item.get("task_vi") and item.get("explanation_vi") for name in expected_math5_games for item in math5_games.get(name, []))
        and all(item.get("source_status") in {"user-provided-reference", "ai-generated"} for name in expected_math5_games for item in math5_games.get(name, []))
    )
    if not math5_valid:
        errors.append("Toán 6 Bài 5 phải có 3 khối bài giảng và đúng 6 trò chơi × 10 câu có đáp án, gợi ý, phản hồi và provenance")
else:
    errors.append("Toán 6 Bài 5 source lesson không phải object hợp lệ")

if isinstance(unit1, dict):
    getting_u1 = unit1.get("getting_started", {})
    acl1_u1 = unit1.get("closer_look_1", {})
    acl2_u1 = unit1.get("closer_look_2", {})
    unit1_valid = (
        unit1.get("lesson_id") == "unit1-phase1"
        and unit1.get("source_status") == "user-provided-reference"
        and unit1.get("usage_scope") == "personal-family"
        and len(getting_u1.get("dialogue", [])) == 11
        and len(getting_u1.get("true_false", [])) == 5
        and len(getting_u1.get("gap_answers", [])) == 5
        and len(getting_u1.get("school_things", [])) == 6
        and len(acl1_u1.get("vocabulary", [])) == 9
        and len(acl1_u1.get("collocations", [])) == 9
        and len(acl1_u1.get("sound_words", [])) == 8
        and len(acl1_u1.get("sound_sentences", [])) == 5
        and len(acl2_u1.get("choice_answers", [])) == 5
        and len(acl2_u1.get("interview_forms", [])) == 6
        and len(acl2_u1.get("frequency_adverbs", [])) == 5
        and len(acl2_u1.get("frequency_answers", [])) == 5
        and len(acl2_u1.get("interview_prompts", [])) == 5
    )
    if not unit1_valid:
        errors.append("Unit 1 phase 1 phải giữ đủ anchor Getting Started, A Closer Look 1 và A Closer Look 2")
else:
    errors.append("Unit 1 phase 1 lesson không phải object hợp lệ")

if isinstance(unit1_phase2, dict):
    communication_u1 = unit1_phase2.get("communication", {})
    skills1_u1 = unit1_phase2.get("skills1", {})
    skills2_u1 = unit1_phase2.get("skills2", {})
    looking_back_u1 = unit1_phase2.get("looking_back", {})
    project_u1 = unit1_phase2.get("project", {})
    unit1_phase2_valid = (
        unit1_phase2.get("lesson_id") == "unit1-phase2"
        and unit1_phase2.get("source_status") == "user-provided-reference"
        and unit1_phase2.get("usage_scope") == "personal-family"
        and len(communication_u1.get("introduction_dialogue", [])) == 3
        and len(communication_u1.get("candidate_questions", [])) == 8
        and len(communication_u1.get("friend_quiz", [])) == 8
        and len(skills1_u1.get("passages", [])) == 3
        and len(skills1_u1.get("matches", [])) == 3
        and len(skills1_u1.get("fill_answers", [])) == 5
        and len(skills1_u1.get("questions", [])) == 4
        and len(skills2_u1.get("visible_choices", [])) == 5
        and skills2_u1.get("replacement_audio", {}).get("source_status") == "ai-generated"
        and len(skills2_u1.get("writing_prompts", [])) == 5
        and len(looking_back_u1.get("vocabulary_answers", [])) == 6
        and len(looking_back_u1.get("collocations", [])) == 5
        and len(looking_back_u1.get("present_simple_answers", [])) == 5
        and len(looking_back_u1.get("text_forms", [])) == 5
        and len(looking_back_u1.get("frequency_sentences", [])) == 5
        and len(project_u1.get("steps", [])) == 3
        and len(project_u1.get("design_prompts", [])) == 6
        and len(project_u1.get("now_i_can", [])) == 9
        and project_u1.get("fictional_school", {}).get("source_status") == "ai-generated"
    )
    if not unit1_phase2_valid:
        errors.append("Unit 1 phase 2 phải giữ đủ anchor Communication, Skills 1–2, Looking Back và Project")
else:
    errors.append("Unit 1 phase 2 lesson không phải object hợp lệ")

if isinstance(unit1_bonus, dict):
    selected = unit1_bonus.get("selected_variants", [])
    stages = unit1_bonus.get("stages", {})
    unit1_bonus_valid = unit1_bonus.get("lesson_id") == "unit1-bonus" and selected == ["treasure", "boss", "detective"]
    for stage_id in selected:
        rounds = stages.get(stage_id, {}).get("rounds", [])
        unit1_bonus_valid = unit1_bonus_valid and len(rounds) == 10 and len({item.get("id") for item in rounds if isinstance(item, dict)}) == 10
        unit1_bonus_valid = unit1_bonus_valid and all(item.get("source_status") == "ai-generated" and two_word_name(item.get("character_name")) and bool(item.get("answer")) for item in rounds)
    if not unit1_bonus_valid:
        errors.append("Unit 1 Bonus phải có đúng 3 màn × 10 câu AI với tên nhân vật hai từ")
else:
    errors.append("Unit 1 Bonus lesson không phải object hợp lệ")

if isinstance(unit2, dict):
    getting_u2 = unit2.get("getting_started", {})
    acl1_u2 = unit2.get("closer_look_1", {})
    acl2_u2 = unit2.get("closer_look_2", {})
    unit2_valid = (
        unit2.get("lesson_id") == "unit2-phase1"
        and unit2.get("source_status") == "user-provided-reference"
        and unit2.get("usage_scope") == "personal-family"
        and len(getting_u2.get("dialogue", [])) == 11
        and len(getting_u2.get("family_members", [])) == 5
        and len(getting_u2.get("gap_answers", [])) == 5
        and len(getting_u2.get("house_types", [])) == 4
        and len(acl1_u2.get("rooms", [])) == 5
        and len(acl1_u2.get("furniture", [])) == 10
        and len(acl1_u2.get("sound_words", [])) == 8
        and len(acl1_u2.get("sound_conversation_words", [])) == 5
        and len(acl2_u2.get("possessive_answers", [])) == 5
        and len(acl2_u2.get("possessive_forms", [])) == 5
        and len(acl2_u2.get("prepositions", [])) == 7
        and len(acl2_u2.get("picture_positions", [])) == 7
        and len(acl2_u2.get("true_false", [])) == 5
    )
    if not unit2_valid:
        errors.append("Unit 2 phase 1 phải giữ đủ anchor Getting Started, A Closer Look 1 và A Closer Look 2")
else:
    errors.append("Unit 2 phase 1 lesson không phải object hợp lệ")

if isinstance(unit2_phase2, dict):
    communication_u2 = unit2_phase2.get("communication", {})
    skills1_u2 = unit2_phase2.get("skills1", {})
    skills2_u2 = unit2_phase2.get("skills2", {})
    looking_back_u2 = unit2_phase2.get("looking_back", {})
    groups_u2 = looking_back_u2.get("word_groups", {})
    project_u2 = unit2_phase2.get("project", {})
    unit2_phase2_valid = (
        unit2_phase2.get("lesson_id") == "unit2-phase2"
        and unit2_phase2.get("source_status") == "user-provided-reference"
        and unit2_phase2.get("usage_scope") == "personal-family"
        and len(communication_u2.get("suggestion_dialogue", [])) == 4
        and len(communication_u2.get("structures", [])) == 2
        and len(communication_u2.get("living_places_answers", [])) == 5
        and len(communication_u2.get("nick_house_facts", [])) == 5
        and len(skills1_u2.get("questions", [])) == 4
        and len(skills1_u2.get("tiger_room_items", [])) == 8
        and len(skills1_u2.get("room_plan_items", [])) == 8
        and len(skills2_u2.get("visible_items", [])) == 5
        and len(skills2_u2.get("visible_statements", [])) == 5
        and skills2_u2.get("replacement_audio", {}).get("source_status") == "ai-generated"
        and len(skills2_u2.get("writing_prompts", [])) == 3
        and skills2_u2.get("fictional_house", {}).get("source_status") == "ai-generated"
        and len(groups_u2.get("types_of_house", [])) == 4
        and len(groups_u2.get("rooms", [])) == 3
        and len(groups_u2.get("furniture", [])) == 5
        and len(looking_back_u2.get("possessive_answers", [])) == 5
        and len(looking_back_u2.get("picture_positions", [])) == 6
        and len(project_u2.get("house_options", [])) == 3
        and len(project_u2.get("steps", [])) == 3
        and len(project_u2.get("now_i_can", [])) == 9
        and project_u2.get("fictional_design", {}).get("source_status") == "ai-generated"
    )
    if not unit2_phase2_valid:
        errors.append("Unit 2 phase 2 phải giữ đủ anchor Communication, Skills 1–2, Looking Back và Project")
else:
    errors.append("Unit 2 phase 2 lesson không phải object hợp lệ")

if isinstance(unit2_bonus, dict):
    selected = unit2_bonus.get("selected_variants", [])
    stages = unit2_bonus.get("stages", {})
    unit2_bonus_valid = unit2_bonus.get("lesson_id") == "unit2-bonus" and selected == ["treasure", "boss", "detective"]
    for stage_id in selected:
        rounds = stages.get(stage_id, {}).get("rounds", [])
        unit2_bonus_valid = unit2_bonus_valid and len(rounds) == 10 and len({item.get("id") for item in rounds if isinstance(item, dict)}) == 10
        unit2_bonus_valid = unit2_bonus_valid and all(item.get("source_status") == "ai-generated" and two_word_name(item.get("character_name")) and bool(item.get("answer")) for item in rounds)
    if not unit2_bonus_valid:
        errors.append("Unit 2 Bonus phải có đúng 3 màn × 10 câu AI với tên nhân vật hai từ")
else:
    errors.append("Unit 2 Bonus lesson không phải object hợp lệ")

if isinstance(unit6, dict):
    getting_u6 = unit6.get("getting_started", {})
    acl1_u6 = unit6.get("closer_look_1", {})
    acl2_u6 = unit6.get("closer_look_2", {})
    unit6_valid = (
        unit6.get("lesson_id") == "unit6-phase1"
        and unit6.get("source_status") == "user-provided-reference"
        and unit6.get("usage_scope") == "personal-family"
        and len(getting_u6.get("dialogue", [])) == 12
        and len(getting_u6.get("sentence_answers", [])) == 5
        and len(getting_u6.get("picture_phrases", [])) == 4
        and len(acl1_u6.get("vocabulary", [])) == 5
        and len(acl1_u6.get("collocations", [])) == 6
        and len(acl1_u6.get("sound_words", [])) == 6
        and len(acl2_u6.get("library_signs", [])) == 4
        and len(acl2_u6.get("tet_activities", [])) == 8
        and len(acl2_u6.get("some_any_sentences", [])) == 5
        and len(acl2_u6.get("fridge", [])) == 6
    )
    if not unit6_valid:
        errors.append("Unit 6 phase 1 phải giữ đủ anchor Getting Started, A Closer Look 1 và A Closer Look 2")
else:
    errors.append("Unit 6 phase 1 lesson không phải object hợp lệ")

if isinstance(unit6_phase2, dict):
    communication_u6 = unit6_phase2.get("communication", {})
    skills1_u6 = unit6_phase2.get("skills1", {})
    skills2_u6 = unit6_phase2.get("skills2", {})
    looking_back_u6 = unit6_phase2.get("looking_back", {})
    project_u6 = unit6_phase2.get("project", {})
    unit6_phase2_valid = (
        unit6_phase2.get("lesson_id") == "unit6-phase2"
        and unit6_phase2.get("source_status") == "user-provided-reference"
        and unit6_phase2.get("usage_scope") == "personal-family"
        and len(communication_u6.get("wish_suggestions", [])) == 5
        and len(communication_u6.get("picture_customs", [])) == 4
        and len(communication_u6.get("world_customs", [])) == 5
        and len(skills1_u6.get("passages", [])) == 3
        and len(skills1_u6.get("who_statements", [])) == 5
        and len(skills1_u6.get("memory_items", [])) == 8
        and len(skills1_u6.get("speaking_activities", [])) == 6
        and len(skills1_u6.get("advice_activities", [])) == 9
        and len(skills2_u6.get("visible_items", [])) == 6
        and len(skills2_u6.get("visible_questions", [])) == 5
        and skills2_u6.get("replacement_audio", {}).get("source_status") == "ai-generated"
        and len(looking_back_u6.get("collocations", [])) == 6
        and len(looking_back_u6.get("vocabulary_answers", [])) == 5
        and len(looking_back_u6.get("advice_sentences", [])) == 5
        and len(looking_back_u6.get("some_any_answers", [])) == 6
        and len(project_u6.get("steps", [])) == 4
        and len(project_u6.get("example_wishes", [])) == 3
        and len(project_u6.get("now_i_can", [])) == 8
    )
    if not unit6_phase2_valid:
        errors.append("Unit 6 phase 2 phải giữ đủ anchor Communication, Skills 1–2, Looking Back và Project")
else:
    errors.append("Unit 6 phase 2 lesson không phải object hợp lệ")

if isinstance(unit6_bonus, dict):
    selected = unit6_bonus.get("selected_variants", [])
    stages = unit6_bonus.get("stages", {})
    unit6_bonus_valid = unit6_bonus.get("lesson_id") == "unit6-bonus" and selected == ["treasure", "boss", "detective"]
    for stage_id in selected:
        rounds = stages.get(stage_id, {}).get("rounds", [])
        unit6_bonus_valid = unit6_bonus_valid and len(rounds) == 10 and len({item.get("id") for item in rounds if isinstance(item, dict)}) == 10
        unit6_bonus_valid = unit6_bonus_valid and all(item.get("source_status") == "ai-generated" and two_word_name(item.get("character_name")) and bool(item.get("answer")) for item in rounds)
    if not unit6_bonus_valid:
        errors.append("Unit 6 Bonus phải có đúng 3 màn × 10 câu AI với tên nhân vật hai từ")
else:
    errors.append("Unit 6 Bonus lesson không phải object hợp lệ")

if isinstance(unit5, dict):
    getting_u5 = unit5.get("getting_started", {})
    acl1_u5 = unit5.get("closer_look_1", {})
    acl2_u5 = unit5.get("closer_look_2", {})
    unit5_valid = (
        unit5.get("lesson_id") == "unit5-phase1"
        and unit5.get("source_status") == "user-provided-reference"
        and unit5.get("usage_scope") == "personal-family"
        and len(getting_u5.get("dialogue", [])) == 11
        and len(getting_u5.get("fill_sentences", [])) == 5
        and len(getting_u5.get("nature_words", [])) == 8
        and len(getting_u5.get("quiz", [])) == 5
        and len(acl1_u5.get("travel_items", [])) == 6
        and len(acl1_u5.get("sound_words", [])) == 8
        and len(acl2_u5.get("countability", [])) == 5
        and len(acl2_u5.get("quantifier_choices", [])) == 5
        and len(acl2_u5.get("modal_sentences", [])) == 5
    )
    if not unit5_valid:
        errors.append("Unit 5 phase 1 phải giữ đủ anchor Getting Started, A Closer Look 1 và A Closer Look 2")
else:
    errors.append("Unit 5 phase 1 lesson không phải object hợp lệ")

if isinstance(unit5_phase2, dict):
    communication_u5 = unit5_phase2.get("communication", {})
    skills1_u5 = unit5_phase2.get("skills1", {})
    skills2_u5 = unit5_phase2.get("skills2", {})
    looking_back_u5 = unit5_phase2.get("looking_back", {})
    project_u5 = unit5_phase2.get("project", {})
    unit5_phase2_valid = (
        unit5_phase2.get("lesson_id") == "unit5-phase2"
        and unit5_phase2.get("source_status") == "user-provided-reference"
        and unit5_phase2.get("usage_scope") == "personal-family"
        and len(communication_u5.get("appointment_dialogue", [])) == 4
        and len(communication_u5.get("travel_rules", [])) == 5
        and len(skills1_u5.get("word_box", [])) == 5
        and len(skills1_u5.get("questions", [])) == 5
        and len(skills2_u5.get("visible_statements", [])) == 5
        and len(skills2_u5.get("writing_network", [])) == 5
        and skills2_u5.get("replacement_audio", {}).get("source_status") == "ai-generated"
        and len(looking_back_u5.get("picture_places", [])) == 6
        and len(looking_back_u5.get("wonder_matches", [])) == 6
        and len(looking_back_u5.get("grammar_corrections", [])) == 5
        and len(project_u5.get("prompts", [])) == 5
        and len(project_u5.get("now_i_can", [])) == 8
        and project_u5.get("fictional_destination", {}).get("source_status") == "ai-generated"
    )
    if not unit5_phase2_valid:
        errors.append("Unit 5 phase 2 phải giữ đủ anchor Communication, Skills 1–2, Looking Back và Project")
else:
    errors.append("Unit 5 phase 2 lesson không phải object hợp lệ")

if isinstance(unit5_bonus, dict):
    selected = unit5_bonus.get("selected_variants", [])
    stages = unit5_bonus.get("stages", {})
    unit5_bonus_valid = unit5_bonus.get("lesson_id") == "unit5-bonus" and selected == ["treasure", "boss", "detective"]
    for stage_id in selected:
        rounds = stages.get(stage_id, {}).get("rounds", [])
        unit5_bonus_valid = unit5_bonus_valid and len(rounds) == 10 and len({item.get("id") for item in rounds if isinstance(item, dict)}) == 10
        unit5_bonus_valid = unit5_bonus_valid and all(item.get("source_status") == "ai-generated" and two_word_name(item.get("character_name")) and bool(item.get("answer")) for item in rounds)
    if not unit5_bonus_valid:
        errors.append("Unit 5 Bonus phải có đúng 3 màn × 10 câu AI với tên nhân vật hai từ")
else:
    errors.append("Unit 5 Bonus lesson không phải object hợp lệ")

if isinstance(unit4, dict):
    getting = unit4.get("getting_started", {})
    acl1_u4 = unit4.get("closer_look_1", {})
    acl2_u4 = unit4.get("closer_look_2", {})
    unit4_valid = (
        unit4.get("lesson_id") == "unit4-phase1"
        and unit4.get("source_status") == "user-provided-reference"
        and unit4.get("usage_scope") == "personal-family"
        and len(getting.get("dialogue", [])) == 14
        and len(getting.get("event_order", [])) == 5
        and len(getting.get("directions", [])) == 5
        and len(getting.get("map_places", [])) == 8
        and len(acl1_u4.get("places", [])) == 5
        and len(acl1_u4.get("adjectives", [])) == 8
        and len(acl1_u4.get("sound_words", [])) == 8
        and len(acl1_u4.get("chant", [])) == 8
        and len(acl2_u4.get("comparatives", [])) == 11
    )
    if not unit4_valid:
        errors.append("Unit 4 phase 1 phải giữ đủ anchor Getting Started, A Closer Look 1 và A Closer Look 2")
else:
    errors.append("Unit 4 phase 1 lesson không phải object hợp lệ")

if isinstance(unit4_phase2, dict):
    communication_u4 = unit4_phase2.get("communication", {})
    skills1_u4 = unit4_phase2.get("skills1", {})
    skills2_u4 = unit4_phase2.get("skills2", {})
    looking_back_u4 = unit4_phase2.get("looking_back", {})
    project_u4 = unit4_phase2.get("project", {})
    unit4_phase2_valid = (
        unit4_phase2.get("lesson_id") == "unit4-phase2"
        and unit4_phase2.get("source_status") == "user-provided-reference"
        and unit4_phase2.get("usage_scope") == "personal-family"
        and len(communication_u4.get("dialogues", [])) == 2
        and len(communication_u4.get("linkers", [])) == 4
        and communication_u4.get("replacement_guide", {}).get("source_status") == "ai-generated"
        and len(skills1_u4.get("vocabulary", [])) == 3
        and len(skills1_u4.get("questions", [])) == 4
        and len(skills2_u4.get("visible_statements", [])) == 5
        and skills2_u4.get("replacement_audio", {}).get("source_status") == "ai-generated"
        and len(looking_back_u4.get("places", [])) == 5
        and len(looking_back_u4.get("comparatives", [])) == 9
        and len(project_u4.get("steps", [])) == 2
        and len(project_u4.get("now_i_can", [])) == 8
        and project_u4.get("fictional_map", {}).get("source_status") == "ai-generated"
    )
    if not unit4_phase2_valid:
        errors.append("Unit 4 phase 2 phải giữ đủ anchor Communication, Skills 1–2, Looking Back và Project")
else:
    errors.append("Unit 4 phase 2 lesson không phải object hợp lệ")

if isinstance(unit4_bonus, dict):
    selected = unit4_bonus.get("selected_variants", [])
    stages = unit4_bonus.get("stages", {})
    unit4_bonus_valid = unit4_bonus.get("lesson_id") == "unit4-bonus" and selected == ["treasure", "boss", "detective"]
    for stage_id in selected:
        rounds = stages.get(stage_id, {}).get("rounds", [])
        unit4_bonus_valid = unit4_bonus_valid and len(rounds) == 10 and len({item.get("id") for item in rounds if isinstance(item, dict)}) == 10
        unit4_bonus_valid = unit4_bonus_valid and all(item.get("source_status") == "ai-generated" and two_word_name(item.get("character_name")) and bool(item.get("answer")) for item in rounds)
    if not unit4_bonus_valid:
        errors.append("Unit 4 Bonus phải có đúng 3 màn × 10 câu AI với tên nhân vật hai từ")
else:
    errors.append("Unit 4 Bonus lesson không phải object hợp lệ")

if isinstance(review, dict):
    review_games = review.get("games", {})
    review_valid = (
        review.get("lesson_id") == "review1"
        and review.get("source_status") == "user-provided-reference"
        and list(review_games) == ["sounds", "vocabulary", "grammar", "email", "school", "listen_write"]
        and all(isinstance(rounds, list) and len(rounds) == 10 and len({item.get("id") for item in rounds if isinstance(item, dict)}) == 10 for rounds in review_games.values())
        and all(item.get("answer") in item.get("options", []) for rounds in review_games.values() for item in rounds if isinstance(item, dict))
    )
    review_audio = [item for item in review_games.get("listen_write", []) if item.get("audio_text")]
    review_valid = review_valid and len(review_audio) == 5 and all(item.get("audio_source_status") == "ai-generated" for item in review_audio)
    if not review_valid:
        errors.append("Review 1 phải có 6 game × 10 câu và 5 câu nghe thay thế được ghi nhãn AI")
else:
    errors.append("Review 1 lesson không phải object hợp lệ")

if isinstance(review_bonus, dict):
    selected = review_bonus.get("selected_variants", [])
    stages = review_bonus.get("stages", {})
    review_bonus_valid = review_bonus.get("lesson_id") == "review1-bonus" and selected == ["treasure", "boss", "detective"]
    for stage_id in selected:
        rounds = stages.get(stage_id, {}).get("rounds", [])
        review_bonus_valid = review_bonus_valid and len(rounds) == 10 and all(item.get("source_status") == "ai-generated" and two_word_name(item.get("character_name")) for item in rounds)
    if not review_bonus_valid:
        errors.append("Review Bonus phải có đúng 3 màn × 10 câu AI")
else:
    errors.append("Review Bonus lesson không phải object hợp lệ")

if isinstance(review2, dict):
    review2_games = review2.get("games", {})
    review2_valid = (
        review2.get("lesson_id") == "review2"
        and review2.get("source_status") == "user-provided-reference"
        and list(review2_games) == ["pronunciation", "vocabulary", "grammar", "reading", "listening", "writing"]
        and all(isinstance(rounds, list) and len(rounds) == 10 and len({item.get("id") for item in rounds if isinstance(item, dict)}) == 10 for rounds in review2_games.values())
        and all(item.get("answer") in item.get("options", []) for rounds in review2_games.values() for item in rounds if isinstance(item, dict))
        and all(item.get("audio_text") and item.get("audio_source_status") == "ai-generated" for item in review2_games.get("listening", []))
    )
    if not review2_valid:
        errors.append("Review 2 phải có 6 game × 10 câu và toàn bộ câu nghe thay thế được ghi nhãn AI")
else:
    errors.append("Review 2 lesson không phải object hợp lệ")

if isinstance(review2_bonus, dict):
    selected = review2_bonus.get("selected_variants", [])
    stages = review2_bonus.get("stages", {})
    review2_bonus_valid = review2_bonus.get("lesson_id") == "review2-bonus" and selected == ["treasure", "boss", "detective"]
    for stage_id in selected:
        rounds = stages.get(stage_id, {}).get("rounds", [])
        review2_bonus_valid = review2_bonus_valid and len(rounds) == 10 and all(item.get("source_status") == "ai-generated" and two_word_name(item.get("character_name")) for item in rounds)
    if not review2_bonus_valid:
        errors.append("Review 2 Bonus phải có đúng 3 màn × 10 câu AI")
else:
    errors.append("Review 2 Bonus lesson không phải object hợp lệ")

if isinstance(project, dict):
    project_games = project.get("games", {})
    project_valid = (
        project.get("lesson_id") == "unit3-project"
        and project.get("source_status") == "user-provided-reference"
        and project.get("usage_scope") == "personal-family"
        and len(project.get("source_material", {}).get("project_steps", [])) == 5
        and len(project.get("source_material", {}).get("now_i_can", [])) == 8
        and list(project_games) == ["path", "interview", "notes", "writer", "present"]
    )
    for game_id, rounds in project_games.items():
        project_valid = project_valid and isinstance(rounds, list) and len(rounds) == 10
        if isinstance(rounds, list):
            project_valid = project_valid and len({item.get("id") for item in rounds if isinstance(item, dict)}) == 10
            project_valid = project_valid and all(
                isinstance(item, dict)
                and item.get("source_status") in {"user-provided-reference", "ai-generated"}
                and item.get("answer") in item.get("options", [])
                and (item.get("source_status") != "ai-generated" or two_word_name(item.get("character_name")))
                for item in rounds
            )
    if not project_valid:
        errors.append("Project phải giữ 5 bước, 8 mục Now I can và 5 game × 10 câu có provenance hợp lệ")
else:
    errors.append("Project lesson không phải object hợp lệ")

if isinstance(bonus, dict):
    selected = bonus.get("selected_variants", [])
    stages = bonus.get("stages", {})
    bonus_valid = bonus.get("lesson_id") == "unit3-bonus" and bonus.get("source_status") == "designed" and selected == ["treasure", "boss", "detective"]
    for stage_id in selected:
        rounds = stages.get(stage_id, {}).get("rounds", [])
        bonus_valid = bonus_valid and len(rounds) == 10 and len({item.get("id") for item in rounds if isinstance(item, dict)}) == 10
        bonus_valid = bonus_valid and all(isinstance(item, dict) and item.get("source_status") == "ai-generated" and two_word_name(item.get("character_name")) and bool(item.get("answer")) for item in rounds)
    if not bonus_valid:
        errors.append("Bonus Unit 3 phải có đúng 3 màn × 10 câu AI với tên nhân vật hai từ")
else:
    errors.append("Bonus lesson không phải object hợp lệ")
if gs is not None:
    if not isinstance(gs, dict):
        errors.append("getting_started_unit3.json phải là object")
    else:
        for k in ("part1_conversation", "part2_blanks", "part3_body_parts", "part4_word_webs"):
            if not isinstance(gs.get(k), list):
                errors.append(f"Thiếu list {k}")
        if "part5" not in gs and "part5_detective" not in gs:
            rounds = part5.get("games", {}).get("detective", []) if isinstance(part5, dict) else []
            valid_designed_part5 = (
                isinstance(part5, dict)
                and part5.get("lesson_id") == "unit3-getting-started-part5"
                and part5.get("source_status") == "designed"
                and part5.get("usage_scope") == "personal-family"
                and isinstance(rounds, list)
                and len(rounds) == 10
                and len({item.get("id") for item in rounds if isinstance(item, dict)}) == 10
                and all(
                    isinstance(item, dict)
                    and item.get("source_status") == "ai-generated"
                    and two_word_name(item.get("character_name"))
                    and item.get("answer") in item.get("options", [])
                    for item in rounds
                )
            )
            if not valid_designed_part5:
                errors.append("Part 5 thiếu nguồn raw nên phải có lesson designed hợp lệ gồm đúng 10 câu")
        for idx, line in enumerate(gs.get("part1_conversation", []), start=1):
            if not isinstance(line, dict) or any(not line.get(k) for k in ("speaker", "text", "voice")):
                errors.append(f"Part 1: thoại #{idx} thiếu speaker/text/voice")
        for item in gs.get("part2_blanks", []):
            if not isinstance(item, dict):
                errors.append("Part 2: item không phải object")
                continue
            ident = item.get("id", "?")
            sentence = item.get("sentence", "")
            answer = item.get("answer")
            options = item.get("options", [])
            if not isinstance(sentence, str) or not isinstance(options, list) or not isinstance(answer, str):
                errors.append(f"Part 2 #{ident}: cấu trúc sai")
                continue
            if answer not in options:
                errors.append(f"Part 2 #{ident}: answer không nằm trong options")
            count = sentence.count("[BLANK]")
            if count == 0:
                errors.append(f"Part 2 #{ident}: không có [BLANK]")
            elif count > 1:
                slots = [part.strip() for part in re.split(r"\s+and\s+", answer, flags=re.IGNORECASE) if part.strip()]
                if len(slots) != count:
                    warnings.append(f"Part 2 #{ident}: không thể tách answer thành đúng {count} slot")
if voc is not None:
    if not isinstance(voc, list):
        errors.append("unit3_game_data.json phải là list")
    else:
        for idx, item in enumerate(voc, start=1):
            if not isinstance(item, dict):
                errors.append(f"Từ #{idx}: item không phải object")
                continue
            for field in ("en", "type", "vi", "sentence", "options"):
                if field not in item:
                    errors.append(f"Từ #{idx}: thiếu {field}")
            if item.get("en") not in item.get("options", []):
                errors.append(f"Từ #{idx}: đáp án không thuộc options")
            if isinstance(item.get("sentence"), str) and item["sentence"].count("[BLANK]") != 1:
                errors.append(f"Từ #{idx}: câu ví dụ phải có đúng 1 [BLANK]")
            if item.get("en") == "hard-working" and "lots of new ideas" in item.get("sentence", ""):
                reviewed = next((entry for entry in acl1.get("picture_match", []) if isinstance(entry, dict) and entry.get("id") == "hard-working"), None) if isinstance(acl1, dict) else None
                typing_engine = ROOT / "frontend" / "src" / "features" / "typing-quest" / "typingQuestEngine.ts"
                typing_text = typing_engine.read_text(encoding="utf-8") if typing_engine.is_file() else ""
                correction_is_used = (
                    isinstance(reviewed, dict)
                    and "homework" in reviewed.get("sentence", "").lower()
                    and "ideas" not in reviewed.get("sentence", "").lower()
                    and '"hard-working": "Mina is very [BLANK]. She always studies hard and finishes her homework on time."' in typing_text
                )
                if not correction_is_used:
                    errors.append("Câu hard-working raw lệch nghĩa nhưng chưa có bản hiệu đính đã duyệt trong lesson và Typing Quest")
print(f"Nguồn: GS {len(gs) if isinstance(gs, dict) else '?'} phần; từ vựng {len(voc) if isinstance(voc, list) else '?'} mục")
for msg in warnings:
    print("WARN:", msg)
for msg in errors:
    print("ERROR:", msg)
print(f"Kết quả: {len(errors)} lỗi, {len(warnings)} cảnh báo")
sys.exit(1 if errors else 0)
