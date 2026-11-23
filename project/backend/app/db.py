from __future__ import annotations

import hashlib
import hmac
import json
import re
import secrets
import sqlite3
from contextlib import closing
from dataclasses import asdict, dataclass
from datetime import UTC, date, datetime, timedelta
from pathlib import Path

from .curriculum import DEFAULT_COURSE_ID, course_catalog, registered_branch_ids, require_branch, require_course

KEY_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$")
USERNAME_RE = re.compile(r"^[A-Za-z0-9_-]{6,64}$")
PASSWORD_RE = re.compile(r"^[0-9]{4,6}$")
PBKDF2_ITERATIONS = 310_000
DATABASE_SCHEMA_VERSION = 2
STUDENT_BACKUP_FORMAT = "english-quest-student-backup"
STUDENT_BACKUP_VERSION = 1
STRUCTURED_UNIT_ACTIVITY_SUFFIXES = (
    "getting-dialogue", "getting-detail", "getting-vocabulary", "getting-match", "getting-order", "getting-true-false", "getting-recap",
    "acl1-vocabulary", "acl1-match", "acl1-context", "acl1-sound", "acl1-sound-sentence",
    "acl2-rule", "acl2-choice", "acl2-fill", "acl2-context", "acl2-review",
    "communication-language", "communication-response", "communication-quiz", "communication-speaking", "communication-report",
    "skills1-reading", "skills1-details", "skills1-inference", "skills1-speaking", "skills1-presentation",
    "skills2-listening", "skills2-true-false", "skills2-detail-fill", "skills2-writing-cues", "skills2-paragraph",
    "looking-back-vocabulary", "looking-back-grammar", "looking-back-correction", "looking-back-final-mix", "looking-back-self-check",
    "project-plan", "project-details", "project-steps", "project-report", "project-presentation",
)


def structured_unit_activity_maxima(unit_id: str) -> dict[str, int]:
    return {f"{unit_id}-{suffix}": 1000 for suffix in STRUCTURED_UNIT_ACTIVITY_SUFFIXES}


UNIT_ACTIVITY_MAXIMA = {
    "unit1": {
        "unit1-getting-dialogue": 1000,
        "unit1-getting-true-false": 1000,
        "unit1-getting-gap-fill": 1000,
        "unit1-getting-school-things": 1000,
        "unit1-getting-fact-check": 1000,
        "unit1-getting-classroom-words": 1000,
        "unit1-getting-spelling": 1000,
        "unit1-acl1-vocabulary": 1000,
        "unit1-acl1-collocations": 1000,
        "unit1-acl1-context": 1000,
        "unit1-acl1-sound": 1000,
        "unit1-acl1-rhythm": 1000,
        "unit1-acl2-present-simple": 1000,
        "unit1-acl2-interview": 1000,
        "unit1-acl2-frequency": 1000,
        "unit1-acl2-word-order": 1000,
        "unit1-acl2-habits": 1000,
        "unit1-communication-introducing": 1000,
        "unit1-communication-dialogue": 1000,
        "unit1-communication-questions": 1000,
        "unit1-communication-friends": 1000,
        "unit1-communication-mission": 1000,
        "unit1-skills1-reading": 1000,
        "unit1-skills1-evidence": 1000,
        "unit1-skills1-school": 1000,
        "unit1-skills1-speaking": 1000,
        "unit1-skills1-summary": 1000,
        "unit1-skills2-listening": 1000,
        "unit1-skills2-details": 1000,
        "unit1-skills2-order": 1000,
        "unit1-skills2-writing": 1000,
        "unit1-skills2-paragraph": 1000,
        "unit1-looking-back-vocabulary": 1000,
        "unit1-looking-back-collocations": 1000,
        "unit1-looking-back-present-simple": 1000,
        "unit1-looking-back-frequency": 1000,
        "unit1-looking-back-review": 1000,
        "unit1-project-plan": 1000,
        "unit1-project-research": 1000,
        "unit1-project-notes": 1000,
        "unit1-project-writer": 1000,
        "unit1-project-present": 1000,
    },
    "unit2": {
        "unit2-getting-dialogue": 1000,
        "unit2-getting-family": 1000,
        "unit2-getting-gap-fill": 1000,
        "unit2-getting-house-types": 1000,
        "unit2-getting-fact-check": 1000,
        "unit2-getting-room-map": 1000,
        "unit2-getting-spelling": 1000,
        "unit2-acl1-rooms": 1000,
        "unit2-acl1-furniture": 1000,
        "unit2-acl1-room-item": 1000,
        "unit2-acl1-sound": 1000,
        "unit2-acl1-rhythm": 1000,
        "unit2-acl2-possessive": 1000,
        "unit2-acl2-possessive-forms": 1000,
        "unit2-acl2-prepositions": 1000,
        "unit2-acl2-positions": 1000,
        "unit2-acl2-memory": 1000,
        "unit2-communication-suggestions": 1000,
        "unit2-communication-dialogue": 1000,
        "unit2-communication-bedroom": 1000,
        "unit2-communication-choice": 1000,
        "unit2-communication-mission": 1000,
        "unit2-skills1-reading": 1000,
        "unit2-skills1-evidence": 1000,
        "unit2-skills1-rooms": 1000,
        "unit2-skills1-speaking": 1000,
        "unit2-skills1-summary": 1000,
        "unit2-skills2-listening": 1000,
        "unit2-skills2-details": 1000,
        "unit2-skills2-order": 1000,
        "unit2-skills2-writing": 1000,
        "unit2-skills2-email": 1000,
        "unit2-looking-back-vocabulary": 1000,
        "unit2-looking-back-furniture": 1000,
        "unit2-looking-back-possessive": 1000,
        "unit2-looking-back-prepositions": 1000,
        "unit2-looking-back-review": 1000,
        "unit2-project-plan": 1000,
        "unit2-project-research": 1000,
        "unit2-project-notes": 1000,
        "unit2-project-writer": 1000,
        "unit2-project-present": 1000,
    },
    "unit3": {
        "unit3-getting-word-magnet": 1000,
        "unit3-getting-word-train": 1000,
        "unit3-getting-body-lab": 1000,
        "unit3-getting-word-bridge": 1000,
        "unit3-getting-word-webs": 1000,
        "unit3-getting-friend-detective": 1000,
        "unit3-getting-typing": 1000,
        "unit3-a-closer-look1-picture": 1000,
        "unit3-a-closer-look1-context": 1000,
        "unit3-a-closer-look1-garden": 1000,
        "unit3-a-closer-look1-sound": 1000,
        "unit3-a-closer-look1-rhythm": 1000,
        "unit3-a-closer-look2-builder": 1000,
        "unit3-a-closer-look2-reporter": 1000,
        "unit3-a-closer-look2-questions": 1000,
        "unit3-a-closer-look2-detective": 1000,
        "unit3-a-closer-look2-guessing": 1000,
        "unit3-communication-dialogue": 1000,
        "unit3-communication-interview": 1000,
        "unit3-communication-students": 1000,
        "unit3-communication-birthdays": 1500,
        "unit3-communication-opinions": 1000,
        "unit3-skills1-scanner": 1000,
        "unit3-skills1-evidence": 1000,
        "unit3-skills1-file": 1000,
        "unit3-skills1-match": 1000,
        "unit3-skills1-reason": 1000,
        "unit3-skills2-actions": 1000,
        "unit3-skills2-who": 1000,
        "unit3-skills2-fill": 1000,
        "unit3-skills2-interview": 1000,
        "unit3-skills2-diary": 1000,
        "unit3-looking-back-personality": 1000,
        "unit3-looking-back-appearance": 1000,
        "unit3-looking-back-continuous": 1000,
        "unit3-looking-back-tenses": 1000,
        "unit3-looking-back-review": 1000,
        "unit3-project-path": 1000,
        "unit3-project-interview": 1000,
        "unit3-project-notes": 1000,
        "unit3-project-writer": 1000,
        "unit3-project-present": 1000,
    },
    "review1": {
        "review1-language-sounds": 1000,
        "review1-language-vocabulary": 1000,
        "review1-language-grammar": 1000,
        "review1-skills-email": 1000,
        "review1-skills-school": 1000,
        "review1-skills-listen-write": 1000,
    },
    "unit4": {
        "unit4-getting-suggestions": 1000,
        "unit4-getting-story-order": 1000,
        "unit4-getting-direction-match": 1000,
        "unit4-getting-map-navigator": 1000,
        "unit4-getting-route-builder": 1000,
        "unit4-getting-place-hunt": 1000,
        "unit4-getting-direction-spelling": 1000,
        "unit4-acl1-places": 1000,
        "unit4-acl1-is-there": 1000,
        "unit4-acl1-profile": 1000,
        "unit4-acl1-sound": 1000,
        "unit4-acl1-rhythm": 1000,
        "unit4-acl2-builder": 1000,
        "unit4-acl2-rule-sorter": 1000,
        "unit4-acl2-letter": 1000,
        "unit4-acl2-compare": 1000,
        "unit4-acl2-qa": 1000,
        "unit4-communication-directions": 1000,
        "unit4-communication-landmarks": 1000,
        "unit4-communication-dialogue": 1000,
        "unit4-communication-route": 1000,
        "unit4-communication-mission": 1000,
        "unit4-skills1-reading": 1000,
        "unit4-skills1-evidence": 1000,
        "unit4-skills1-map": 1000,
        "unit4-skills1-speaking": 1000,
        "unit4-skills1-summary": 1000,
        "unit4-skills2-listening": 1000,
        "unit4-skills2-details": 1000,
        "unit4-skills2-order": 1000,
        "unit4-skills2-writing": 1000,
        "unit4-skills2-paragraph": 1000,
        "unit4-looking-back-places": 1000,
        "unit4-looking-back-directions": 1000,
        "unit4-looking-back-adjectives": 1000,
        "unit4-looking-back-comparatives": 1000,
        "unit4-looking-back-review": 1000,
        "unit4-project-plan": 1000,
        "unit4-project-map": 1000,
        "unit4-project-notes": 1000,
        "unit4-project-writer": 1000,
        "unit4-project-present": 1000,
    },
    "unit5": {
        "unit5-getting-dialogue": 1000,
        "unit5-getting-wonders-fill": 1000,
        "unit5-getting-nature-match": 1000,
        "unit5-getting-quiz": 1000,
        "unit5-getting-fact-check": 1000,
        "unit5-getting-travel-word": 1000,
        "unit5-getting-spelling": 1000,
        "unit5-acl1-items": 1000,
        "unit5-acl1-context": 1000,
        "unit5-acl1-packing": 1000,
        "unit5-acl1-sound": 1000,
        "unit5-acl1-rhythm": 1000,
        "unit5-acl2-countability": 1000,
        "unit5-acl2-quantifiers": 1000,
        "unit5-acl2-gap-fill": 1000,
        "unit5-acl2-modal": 1000,
        "unit5-acl2-rules": 1000,
        "unit5-communication-appointment": 1000,
        "unit5-communication-dialogue": 1000,
        "unit5-communication-travel": 1000,
        "unit5-communication-rules": 1000,
        "unit5-communication-mission": 1000,
        "unit5-skills1-reading": 1000,
        "unit5-skills1-evidence": 1000,
        "unit5-skills1-facts": 1000,
        "unit5-skills1-speaking": 1000,
        "unit5-skills1-summary": 1000,
        "unit5-skills2-listening": 1000,
        "unit5-skills2-details": 1000,
        "unit5-skills2-order": 1000,
        "unit5-skills2-writing": 1000,
        "unit5-skills2-paragraph": 1000,
        "unit5-looking-back-nature": 1000,
        "unit5-looking-back-travel": 1000,
        "unit5-looking-back-quantifiers": 1000,
        "unit5-looking-back-modal": 1000,
        "unit5-looking-back-review": 1000,
        "unit5-project-plan": 1000,
        "unit5-project-research": 1000,
        "unit5-project-notes": 1000,
        "unit5-project-writer": 1000,
        "unit5-project-present": 1000,
    },
    "unit6": {
        "unit6-getting-dialogue": 1000,
        "unit6-getting-sentence-fill": 1000,
        "unit6-getting-tet-match": 1000,
        "unit6-getting-tet-sort": 1000,
        "unit6-getting-fact-check": 1000,
        "unit6-getting-wishes": 1000,
        "unit6-getting-spelling": 1000,
        "unit6-acl1-vocabulary": 1000,
        "unit6-acl1-collocations": 1000,
        "unit6-acl1-context": 1000,
        "unit6-acl1-sound": 1000,
        "unit6-acl1-rhythm": 1000,
        "unit6-acl2-library": 1000,
        "unit6-acl2-activities": 1000,
        "unit6-acl2-advice": 1000,
        "unit6-acl2-some-any": 1000,
        "unit6-acl2-fridge": 1000,
        "unit6-communication-wishes": 1000,
        "unit6-communication-dialogue": 1000,
        "unit6-communication-customs": 1000,
        "unit6-communication-advice": 1000,
        "unit6-communication-mission": 1000,
        "unit6-skills1-reading": 1000,
        "unit6-skills1-evidence": 1000,
        "unit6-skills1-customs": 1000,
        "unit6-skills1-speaking": 1000,
        "unit6-skills1-summary": 1000,
        "unit6-skills2-listening": 1000,
        "unit6-skills2-details": 1000,
        "unit6-skills2-order": 1000,
        "unit6-skills2-writing": 1000,
        "unit6-skills2-email": 1000,
        "unit6-looking-back-vocabulary": 1000,
        "unit6-looking-back-collocations": 1000,
        "unit6-looking-back-advice": 1000,
        "unit6-looking-back-some-any": 1000,
        "unit6-looking-back-review": 1000,
        "unit6-project-plan": 1000,
        "unit6-project-research": 1000,
        "unit6-project-notes": 1000,
        "unit6-project-writer": 1000,
        "unit6-project-present": 1000,
    },
    "unit7": {
        "unit7-getting-dialogue": 1000,
        "unit7-getting-programme-match": 1000,
        "unit7-getting-comprehension": 1000,
        "unit7-getting-adjectives": 1000,
        "unit7-getting-fact-check": 1000,
        "unit7-getting-interview": 1000,
        "unit7-getting-spelling": 1000,
        "unit7-acl1-vocabulary": 1000,
        "unit7-acl1-definitions": 1000,
        "unit7-acl1-context": 1000,
        "unit7-acl1-sound": 1000,
        "unit7-acl1-tongue-twister": 1000,
        "unit7-acl2-question-words": 1000,
        "unit7-acl2-wh-dialogue": 1000,
        "unit7-acl2-wh-questions": 1000,
        "unit7-acl2-conjunctions": 1000,
        "unit7-acl2-sentence-join": 1000,
        "unit7-communication-favourite": 1000,
        "unit7-communication-world-tv": 1000,
        "unit7-communication-lets-learn": 1000,
        "unit7-communication-hello-fatty": 1000,
        "unit7-communication-compare": 1000,
        "unit7-skills1-tv-guide": 1000,
        "unit7-skills1-time-match": 1000,
        "unit7-skills1-preferences": 1000,
        "unit7-skills1-speaking": 1000,
        "unit7-skills1-schedule": 1000,
        "unit7-skills2-listening": 1000,
        "unit7-skills2-details": 1000,
        "unit7-skills2-habits": 1000,
        "unit7-skills2-writing": 1000,
        "unit7-skills2-paragraph": 1000,
        "unit7-looking-back-category": 1000,
        "unit7-looking-back-fill": 1000,
        "unit7-looking-back-wh-review": 1000,
        "unit7-looking-back-conjunction-review": 1000,
        "unit7-looking-back-final-mix": 1000,
        "unit7-project-survey": 1000,
        "unit7-project-questions": 1000,
        "unit7-project-interview-plan": 1000,
        "unit7-project-results": 1000,
        "unit7-project-presentation": 1000,
    },
    "unit8": {
        "unit8-getting-dialogue": 1000,
        "unit8-getting-gap-fill": 1000,
        "unit8-getting-sports-match": 1000,
        "unit8-getting-sporty-quiz": 1000,
        "unit8-getting-details": 1000,
        "unit8-getting-vocabulary": 1000,
        "unit8-getting-dialogue-order": 1000,
        "unit8-acl1-equipment": 1000,
        "unit8-acl1-sport-equipment": 1000,
        "unit8-acl1-context": 1000,
        "unit8-acl1-sound": 1000,
        "unit8-acl1-sound-sentence": 1000,
        "unit8-acl2-past-simple": 1000,
        "unit8-acl2-verb-forms": 1000,
        "unit8-acl2-weekend-dialogue": 1000,
        "unit8-acl2-imperatives": 1000,
        "unit8-acl2-gym-rules": 1000,
        "unit8-communication-congratulations": 1000,
        "unit8-communication-replies": 1000,
        "unit8-communication-sports-quiz": 1000,
        "unit8-communication-interview": 1000,
        "unit8-communication-report": 1000,
        "unit8-skills1-pele-reading": 1000,
        "unit8-skills1-pele-details": 1000,
        "unit8-skills1-timeline": 1000,
        "unit8-skills1-sportsperson": 1000,
        "unit8-skills1-presentation": 1000,
        "unit8-skills2-listening": 1000,
        "unit8-skills2-true-false": 1000,
        "unit8-skills2-detail-fill": 1000,
        "unit8-skills2-writing-cues": 1000,
        "unit8-skills2-paragraph": 1000,
        "unit8-looking-back-odd-one-out": 1000,
        "unit8-looking-back-play-do-go": 1000,
        "unit8-looking-back-past-review": 1000,
        "unit8-looking-back-imperatives-review": 1000,
        "unit8-looking-back-final-mix": 1000,
        "unit8-project-traditional-game": 1000,
        "unit8-project-player-count": 1000,
        "unit8-project-equipment-plan": 1000,
        "unit8-project-how-to-play": 1000,
        "unit8-project-project-presentation": 1000,
    },
    "unit9": {
        "unit9-getting-dialogue": 1000, "unit9-getting-detail": 1000, "unit9-getting-vocabulary": 1000,
        "unit9-getting-match": 1000, "unit9-getting-order": 1000, "unit9-getting-true-false": 1000, "unit9-getting-recap": 1000,
        "unit9-acl1-vocabulary": 1000, "unit9-acl1-match": 1000, "unit9-acl1-context": 1000,
        "unit9-acl1-sound": 1000, "unit9-acl1-sound-sentence": 1000,
        "unit9-acl2-rule": 1000, "unit9-acl2-choice": 1000, "unit9-acl2-fill": 1000, "unit9-acl2-context": 1000, "unit9-acl2-review": 1000,
        "unit9-communication-language": 1000, "unit9-communication-response": 1000, "unit9-communication-quiz": 1000,
        "unit9-communication-speaking": 1000, "unit9-communication-report": 1000,
        "unit9-skills1-reading": 1000, "unit9-skills1-details": 1000, "unit9-skills1-inference": 1000,
        "unit9-skills1-speaking": 1000, "unit9-skills1-presentation": 1000,
        "unit9-skills2-listening": 1000, "unit9-skills2-true-false": 1000, "unit9-skills2-detail-fill": 1000,
        "unit9-skills2-writing-cues": 1000, "unit9-skills2-paragraph": 1000,
        "unit9-looking-back-vocabulary": 1000, "unit9-looking-back-grammar": 1000, "unit9-looking-back-correction": 1000,
        "unit9-looking-back-final-mix": 1000, "unit9-looking-back-self-check": 1000,
        "unit9-project-plan": 1000, "unit9-project-details": 1000, "unit9-project-steps": 1000,
        "unit9-project-report": 1000, "unit9-project-presentation": 1000,
    },
    "review3": {
        "review3-language-pronunciation": 1000,
        "review3-language-vocabulary": 1000,
        "review3-language-grammar": 1000,
        "review3-skills-reading": 1000,
        "review3-skills-listening": 1000,
        "review3-skills-writing": 1000,
    },
    "unit10": structured_unit_activity_maxima("unit10"),
    "unit11": structured_unit_activity_maxima("unit11"),
    "unit12": structured_unit_activity_maxima("unit12"),
    "review4": {
        "review4-language-pronunciation": 1000,
        "review4-language-vocabulary": 1000,
        "review4-language-grammar": 1000,
        "review4-skills-reading": 1000,
        "review4-skills-listening": 1000,
        "review4-skills-writing": 1000,
    },
    "math6-bai1-v054": {"math6-bai1-v054-kn1": 1000, "math6-bai1-v054-kn2": 1000},
    "math6-bai2-v01": {"math6-bai2-v01-tp": 1000, "math6-bai2-v01-lm": 1000},
    "math6-s1-lesson1": {
        "math6-s1-lesson1-identify": 1000,
        "math6-s1-lesson1-membership": 1000,
        "math6-s1-lesson1-notation": 1000,
        "math6-s1-lesson1-listing": 1000,
        "math6-s1-lesson1-natural": 1000,
        "math6-s1-lesson1-describe": 1000,
    },
    "math6-s1-lesson2": {
        "math6-s1-lesson2-place-value": 1000,
        "math6-s1-lesson2-expanded": 1000,
        "math6-s1-lesson2-read-write": 1000,
        "math6-s1-lesson2-roman-read": 1000,
        "math6-s1-lesson2-roman-write": 1000,
        "math6-s1-lesson2-mixed": 1000,
    },
    "math6-s1-lesson3": {
        "math6-s1-lesson3-number-line": 1000,
        "math6-s1-lesson3-compare": 1000,
        "math6-s1-lesson3-neighbors": 1000,
        "math6-s1-lesson3-order-chain": 1000,
        "math6-s1-lesson3-inequality": 1000,
        "math6-s1-lesson3-conditional-set": 1000,
    },
    "math6-s1-lesson4": {
        "math6-s1-lesson4-terms": 1000,
        "math6-s1-lesson4-addition": 1000,
        "math6-s1-lesson4-smart-sum": 1000,
        "math6-s1-lesson4-subtraction": 1000,
        "math6-s1-lesson4-find-x": 1000,
        "math6-s1-lesson4-word-problem": 1000,
    },
    "math6-s1-lesson5": {
        "math6-s1-lesson5-terms": 1000,
        "math6-s1-lesson5-multiplication": 1000,
        "math6-s1-lesson5-smart-product": 1000,
        "math6-s1-lesson5-division": 1000,
        "math6-s1-lesson5-remainder": 1000,
        "math6-s1-lesson5-word-problem": 1000,
    },
    "math6-s1-chapter1-practice": {
        "math6-s1-chapter1-practice-place-value": 1000,
        "math6-s1-chapter1-practice-sets-order": 1000,
        "math6-s1-chapter1-practice-add-subtract": 1000,
        "math6-s1-chapter1-practice-multiply-divide": 1000,
        "math6-s1-chapter1-practice-word-problem": 1000,
        "math6-s1-chapter1-practice-mixed": 1000,
    },
    "math6-s1-chapter1-review": {
        "math6-s1-chapter1-review-number-writing": 1000,
        "math6-s1-chapter1-review-neighbors-order": 1000,
        "math6-s1-chapter1-review-operations": 1000,
        "math6-s1-chapter1-review-powers-order": 1000,
        "math6-s1-chapter1-review-applications": 1000,
        "math6-s1-chapter1-review-chapter-mastery": 1000,
    },
    "review2": {
        "review2-language-pronunciation": 1000,
        "review2-language-vocabulary": 1000,
        "review2-language-grammar": 1000,
        "review2-skills-reading": 1000,
        "review2-skills-listening": 1000,
        "review2-skills-writing": 1000,
    },
}

# New independent IDs for the full SGK lesson sequence; retain the older
# math6-s1/s2 score plans below as historical definitions (do not erase).
for _lesson in range(3,44):
    _key=f"math6-bai{_lesson:02d}-v01"
    UNIT_ACTIVITY_MAXIMA[_key]={f"{_key}-quiz":1000}

MATH6_S1_GENERATED_BRANCHES = (
    "math6-s1-lesson6", "math6-s1-lesson7", "math6-s1-chapter1-practice2",
    "math6-s1-lesson8", "math6-s1-lesson9", "math6-s1-lesson10", "math6-s1-chapter2-practice1",
    "math6-s1-lesson11", "math6-s1-lesson12", "math6-s1-chapter2-practice2", "math6-s1-chapter2-review",
    "math6-s1-lesson13", "math6-s1-lesson14", "math6-s1-lesson15", "math6-s1-chapter3-practice1",
    "math6-s1-lesson16", "math6-s1-lesson17", "math6-s1-chapter3-practice2", "math6-s1-chapter3-review",
    "math6-s1-lesson18", "math6-s1-lesson19", "math6-s1-lesson20", "math6-s1-chapter4-practice", "math6-s1-chapter4-review",
    "math6-s1-lesson21", "math6-s1-lesson22", "math6-s1-chapter5-practice", "math6-s1-chapter5-review",
    "math6-s1-activity-card-room", "math6-s1-activity-geogebra", "math6-s1-activity-calculator",
)
for _math_branch_id in MATH6_S1_GENERATED_BRANCHES:
    UNIT_ACTIVITY_MAXIMA[_math_branch_id] = {
        f"{_math_branch_id}-{suffix}": 1000
        for suffix in ("concept", "apply", "reason", "error", "mixed", "challenge")
    }
MATH6_S2_GENERATED_BRANCHES = (
    "math6-s2-lesson23", "math6-s2-lesson24", "math6-s2-chapter6-practice1", "math6-s2-lesson25", "math6-s2-lesson26", "math6-s2-lesson27", "math6-s2-chapter6-practice2", "math6-s2-chapter6-review",
    "math6-s2-lesson28", "math6-s2-lesson29", "math6-s2-lesson30", "math6-s2-lesson31", "math6-s2-chapter7-practice", "math6-s2-chapter7-review",
    "math6-s2-lesson32", "math6-s2-lesson33", "math6-s2-lesson34", "math6-s2-lesson35", "math6-s2-chapter8-practice1", "math6-s2-lesson36", "math6-s2-lesson37", "math6-s2-chapter8-practice2", "math6-s2-chapter8-review",
    "math6-s2-lesson38", "math6-s2-lesson39", "math6-s2-lesson40", "math6-s2-lesson41", "math6-s2-chapter9-practice1", "math6-s2-lesson42", "math6-s2-lesson43", "math6-s2-chapter9-practice2", "math6-s2-chapter9-review",
    "math6-s2-activity-budget", "math6-s2-activity-sports-survey", "math6-s2-activity-geogebra", "math6-s2-final-review",
)
for _math_branch_id in MATH6_S2_GENERATED_BRANCHES:
    UNIT_ACTIVITY_MAXIMA[_math_branch_id] = {
        f"{_math_branch_id}-{suffix}": 1000
        for suffix in ("concept", "apply", "reason", "error", "mixed", "challenge")
    }
INFORMATICS6_BRANCHES = tuple(
    [f"informatics6-s1-lesson{number}" for number in range(1, 10)]
    + [f"informatics6-s2-lesson{number}" for number in range(10, 18)]
)
for _informatics_branch_id in INFORMATICS6_BRANCHES:
    UNIT_ACTIVITY_MAXIMA[_informatics_branch_id] = {
        f"{_informatics_branch_id}-{suffix}": 1000
        for suffix in ("recognize", "process", "reason", "diagnose", "connect", "safe-apply")
    }
VIETNAMESE6_BRANCHES = tuple(
    [f"vietnamese6-s1-lesson{number}" for number in range(1, 6)]
    + ["vietnamese6-s1-review"]
    + [f"vietnamese6-s2-lesson{number}" for number in range(6, 11)]
    + ["vietnamese6-s2-review"]
)
for _vietnamese_branch_id in VIETNAMESE6_BRANCHES:
    UNIT_ACTIVITY_MAXIMA[_vietnamese_branch_id] = {
        f"{_vietnamese_branch_id}-{suffix}": 1000
        for suffix in ("trace", "organize", "infer", "language", "compose", "communicate")
    }
SCIENCE6_BRANCHES = tuple(f"science6-l{number:02d}" for number in range(1, 56))
for _science_branch_id in SCIENCE6_BRANCHES:
    UNIT_ACTIVITY_MAXIMA[_science_branch_id] = {
        f"{_science_branch_id}-{suffix}": 1000
        for suffix in ("observe-identify", "classify-model", "measure-analyze", "predict-reason", "experiment-safety", "explain-apply")
    }
UNIT_REQUIRED_PRACTICES = {
    "unit1": {
        "unit1-acl1-sound": 60,
        "unit1-acl1-rhythm": 60,
    },
    "unit2": {
        "unit2-acl1-sound": 60,
        "unit2-acl1-rhythm": 60,
    },
    "unit3": {
        "unit3-a-closer-look1-sound": 60,
        "unit3-a-closer-look1-rhythm": 60,
    },
    "unit4": {
        "unit4-acl1-sound": 60,
        "unit4-acl1-rhythm": 60,
    },
    "unit5": {
        "unit5-acl1-sound": 60,
        "unit5-acl1-rhythm": 60,
    },
    "unit6": {
        "unit6-acl1-sound": 60,
        "unit6-acl1-rhythm": 60,
    },
    "unit7": {
        "unit7-acl1-sound": 60,
        "unit7-acl1-tongue-twister": 60,
    },
    "unit8": {
        "unit8-acl1-sound": 60,
        "unit8-acl1-sound-sentence": 60,
    },
    "unit9": {
        "unit9-acl1-sound": 60,
        "unit9-acl1-sound-sentence": 60,
    },
    "unit10": {
        "unit10-acl1-sound": 60,
        "unit10-acl1-sound-sentence": 60,
    },
    "unit11": {
        "unit11-acl1-sound": 60,
        "unit11-acl1-sound-sentence": 60,
    },
    "unit12": {
        "unit12-acl1-sound": 60,
        "unit12-acl1-sound-sentence": 60,
    },
}
BONUS_STAGE_IDS = ("treasure", "boss", "detective")
BONUS_POOLS = {
    "high": ((50_000, 50), (100_000, 35), (150_000, 15)),
    "standard": ((20_000, 50), (30_000, 35), (50_000, 15)),
}


def validate_catalog_activity_registry() -> None:
    catalog_branches = registered_branch_ids()
    activity_branches = frozenset(UNIT_ACTIVITY_MAXIMA)
    # Only active English course branches are required. Historical per-subject
    # score plans remain registered so archived progress can be read and migrated
    # without deleting student records, but retired branches cannot be opened:
    # registered_activity_plan still calls require_branch().
    missing_plans = sorted(catalog_branches - activity_branches)
    if missing_plans:
        raise RuntimeError(
            f"course catalog/activity registry mismatch; missing plans={missing_plans}"
        )


def registered_activity_plan(unit_id: str) -> dict[str, int]:
    try:
        require_branch(unit_id)
    except KeyError as error:
        raise ValueError(f"unit_id is not registered in the course catalog: {unit_id}") from error
    plan = UNIT_ACTIVITY_MAXIMA.get(unit_id)
    if plan is None:
        raise ValueError(f"unit_id has no registered activity plan: {unit_id}")
    return plan


def aggregate_course_summaries(courses: list[dict[str, object]]) -> dict[str, object]:
    subjects_by_id: dict[str, dict[str, object]] = {}
    grand = {
        "earned_score": 0,
        "max_score": 0,
        "completed_activities": 0,
        "total_activities": 0,
        "bonus_reward_total": 0,
    }
    for course in courses:
        subject_id = str(course["subject"])
        subject = subjects_by_id.setdefault(subject_id, {
            "subject": subject_id,
            "subject_label": course["subject_label"],
            "earned_score": 0,
            "max_score": 0,
            "completed_activities": 0,
            "total_activities": 0,
            "bonus_reward_total": 0,
            "course_count": 0,
        })
        for field in ("earned_score", "max_score", "completed_activities", "total_activities", "bonus_reward_total"):
            value = int(course[field])
            subject[field] = int(subject[field]) + value
            grand[field] += value
        subject["course_count"] = int(subject["course_count"]) + 1

    subjects = []
    for subject in subjects_by_id.values():
        maximum = int(subject["max_score"])
        subject["percent"] = round(int(subject["earned_score"]) * 100 / maximum, 2) if maximum else 0.0
        subjects.append(subject)
    subjects.sort(key=lambda item: str(item["subject_label"]))
    grand_max = int(grand["max_score"])
    grand["percent"] = round(int(grand["earned_score"]) * 100 / grand_max, 2) if grand_max else 0.0
    return {"grand_total": grand, "subjects": subjects, "courses": courses}


@dataclass(frozen=True)
class Progress:
    student_id: str
    activity_id: str
    completed: bool
    score: int
    xp: int
    updated_at: str

    def to_dict(self) -> dict[str, object]: return asdict(self)


@dataclass(frozen=True)
class User:
    id: int
    username: str
    created_at: str

    def to_dict(self) -> dict[str, object]: return asdict(self)


@dataclass(frozen=True)
class UserProgress:
    unit_id: str
    activity_id: str
    earned_score: int
    max_score: int
    completed: bool
    updated_at: str

    def to_dict(self) -> dict[str, object]: return asdict(self)


class UsernameTakenError(ValueError): pass
class InvalidCredentialsError(ValueError): pass


class ProgressRepository:
    def __init__(self, database_path: str | Path) -> None:
        self.database_path = Path(database_path)

    @property
    def backup_directory(self) -> Path:
        return self.database_path.parent / "backups"

    def _backup_database(self, connection: sqlite3.Connection, label: str) -> Path:
        self.backup_directory.mkdir(parents=True, exist_ok=True)
        stamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%S%fZ")
        destination = self.backup_directory / f"english-quest-{label}-{stamp}.db"
        with closing(sqlite3.connect(destination)) as target:
            connection.backup(target)
        return destination

    @staticmethod
    def _quick_check(connection: sqlite3.Connection) -> str:
        row = connection.execute("PRAGMA quick_check").fetchone()
        return str(row[0]) if row else "unknown"

    def initialize(self) -> None:
        validate_catalog_activity_registry()
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        database_existed = self.database_path.is_file() and self.database_path.stat().st_size > 0
        connection = self._connect()
        try:
            current_version = int(connection.execute("PRAGMA user_version").fetchone()[0])
            if current_version > DATABASE_SCHEMA_VERSION:
                raise RuntimeError(
                    f"Database schema {current_version} is newer than supported schema {DATABASE_SCHEMA_VERSION}"
                )
            existing_tables = {
                str(row[0])
                for row in connection.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
            }
            if database_existed and existing_tables and current_version < DATABASE_SCHEMA_VERSION:
                self._backup_database(connection, f"pre-migration-v{current_version}-to-v{DATABASE_SCHEMA_VERSION}")
            connection.executescript("""
                CREATE TABLE IF NOT EXISTS progress (
                    student_id TEXT NOT NULL, activity_id TEXT NOT NULL,
                    completed INTEGER NOT NULL CHECK (completed IN (0,1)),
                    score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
                    xp INTEGER NOT NULL CHECK (xp BETWEEN 0 AND 1000000),
                    updated_at TEXT NOT NULL, PRIMARY KEY (student_id, activity_id));
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL COLLATE NOCASE UNIQUE,
                    password_salt BLOB NOT NULL, password_hash BLOB NOT NULL,
                    password_iterations INTEGER NOT NULL, created_at TEXT NOT NULL);
                CREATE TABLE IF NOT EXISTS sessions (
                    token_hash BLOB PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    created_at TEXT NOT NULL, expires_at TEXT NOT NULL);
                CREATE TABLE IF NOT EXISTS user_progress (
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    unit_id TEXT NOT NULL, activity_id TEXT NOT NULL,
                    earned_score INTEGER NOT NULL CHECK (earned_score >= 0),
                    max_score INTEGER NOT NULL CHECK (max_score > 0),
                    completed INTEGER NOT NULL CHECK (completed IN (0,1)), updated_at TEXT NOT NULL,
                    PRIMARY KEY (user_id, unit_id, activity_id));
                CREATE TABLE IF NOT EXISTS study_days (
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    studied_on TEXT NOT NULL, PRIMARY KEY (user_id, studied_on));
                CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
                CREATE INDEX IF NOT EXISTS idx_progress_unit ON user_progress(user_id, unit_id);
                CREATE TABLE IF NOT EXISTS activity_question_scores (
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    unit_id TEXT NOT NULL, activity_id TEXT NOT NULL, question_index INTEGER NOT NULL,
                    earned_score INTEGER NOT NULL CHECK (earned_score BETWEEN 0 AND 100),
                    status TEXT NOT NULL DEFAULT 'scored' CHECK (status IN ('scored','skipped')),
                    PRIMARY KEY (user_id, unit_id, activity_id, question_index));
                CREATE TABLE IF NOT EXISTS practice_confirmations (
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    unit_id TEXT NOT NULL, activity_id TEXT NOT NULL,
                    elapsed_seconds INTEGER NOT NULL CHECK (elapsed_seconds > 10),
                    confirmed_at TEXT NOT NULL,
                    PRIMARY KEY (user_id, unit_id, activity_id));
                CREATE TABLE IF NOT EXISTS bonus_units (
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    unit_id TEXT NOT NULL, tier_locked TEXT NOT NULL CHECK (tier_locked IN ('high','standard')),
                    reward_total INTEGER NOT NULL DEFAULT 0 CHECK (reward_total >= 0),
                    PRIMARY KEY (user_id, unit_id));
                CREATE TABLE IF NOT EXISTS bonus_rewards (
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    unit_id TEXT NOT NULL, stage_id TEXT NOT NULL,
                    game_score INTEGER NOT NULL, reward_base INTEGER NOT NULL, reward_awarded INTEGER NOT NULL,
                    tier TEXT NOT NULL CHECK (tier IN ('high','standard')), claimed_at TEXT NOT NULL,
                    PRIMARY KEY (user_id, unit_id, stage_id));
                CREATE TABLE IF NOT EXISTS best_score_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    unit_id TEXT NOT NULL, activity_id TEXT NOT NULL,
                    previous_best INTEGER NOT NULL CHECK (previous_best >= 0),
                    new_best INTEGER NOT NULL CHECK (new_best >= 0),
                    max_score INTEGER NOT NULL CHECK (max_score > 0),
                    recorded_at TEXT NOT NULL);
                CREATE INDEX IF NOT EXISTS idx_best_history_user_time
                    ON best_score_history(user_id, recorded_at DESC);
            """)
            connection.execute("""INSERT INTO best_score_history(user_id,unit_id,activity_id,previous_best,new_best,max_score,recorded_at)
                SELECT p.user_id,p.unit_id,p.activity_id,0,p.earned_score,p.max_score,p.updated_at
                FROM user_progress p WHERE p.earned_score>0 AND NOT EXISTS (
                    SELECT 1 FROM best_score_history h WHERE h.user_id=p.user_id AND h.unit_id=p.unit_id AND h.activity_id=p.activity_id)""")
            question_columns = {row["name"] for row in connection.execute("PRAGMA table_info(activity_question_scores)").fetchall()}
            if "status" not in question_columns:
                connection.execute("ALTER TABLE activity_question_scores ADD COLUMN status TEXT NOT NULL DEFAULT 'scored'")
            connection.execute(f"PRAGMA user_version={DATABASE_SCHEMA_VERSION}")
            connection.commit()
            connection.execute("PRAGMA journal_mode=WAL")
            if self._quick_check(connection) != "ok":
                raise RuntimeError("Database integrity check failed after migration")
        finally: connection.close()

    def database_status(self) -> dict[str, object]:
        connection = self._connect()
        try:
            return {
                "schema_version": int(connection.execute("PRAGMA user_version").fetchone()[0]),
                "supported_schema_version": DATABASE_SCHEMA_VERSION,
                "integrity": self._quick_check(connection),
            }
        finally:
            connection.close()

    def register(self, username: str, password: str) -> User:
        self._validate_credentials(username, password)
        salt = secrets.token_bytes(16)
        digest = self._password_hash(password, salt, PBKDF2_ITERATIONS)
        created_at = self._now()
        connection = self._connect()
        try:
            try:
                cursor = connection.execute(
                    "INSERT INTO users(username,password_salt,password_hash,password_iterations,created_at) VALUES(?,?,?,?,?)",
                    (username, salt, digest, PBKDF2_ITERATIONS, created_at))
            except sqlite3.IntegrityError as error:
                raise UsernameTakenError("username is already registered") from error
            connection.commit()
            return User(cursor.lastrowid, username, created_at)
        finally: connection.close()

    def login(self, username: str, password: str) -> tuple[User, str]:
        self._validate_credentials(username, password)
        connection = self._connect()
        try:
            row = connection.execute("SELECT * FROM users WHERE username=?", (username,)).fetchone()
            if row is None or not hmac.compare_digest(
                self._password_hash(password, row["password_salt"], row["password_iterations"]), row["password_hash"]):
                raise InvalidCredentialsError("invalid username or password")
            token = secrets.token_urlsafe(32)
            now = datetime.now(UTC)
            connection.execute("INSERT INTO sessions(token_hash,user_id,created_at,expires_at) VALUES(?,?,?,?)",
                (self._token_hash(token), row["id"], self._format(now), self._format(now + timedelta(days=30))))
            connection.commit()
            return User(row["id"], row["username"], row["created_at"]), token
        finally: connection.close()

    def authenticate(self, token: str) -> User | None:
        if not isinstance(token, str) or len(token) < 32: return None
        connection = self._connect()
        try:
            row = connection.execute("""SELECT u.id,u.username,u.created_at FROM sessions s
                JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?""",
                (self._token_hash(token), self._now())).fetchone()
        finally: connection.close()
        return User(row["id"], row["username"], row["created_at"]) if row else None

    def logout(self, token: str) -> bool:
        connection = self._connect()
        try:
            cursor = connection.execute("DELETE FROM sessions WHERE token_hash=?", (self._token_hash(token),))
            connection.commit()
            return cursor.rowcount > 0
        finally: connection.close()

    def export_user_backup(self, user_id: int) -> dict[str, object]:
        connection = self._connect()
        try:
            user = connection.execute("SELECT username,created_at FROM users WHERE id=?", (user_id,)).fetchone()
            if user is None:
                raise ValueError("user does not exist")

            def rows(query: str) -> list[dict[str, object]]:
                return [dict(row) for row in connection.execute(query, (user_id,)).fetchall()]

            data = {
                "user_progress": rows("SELECT unit_id,activity_id,earned_score,max_score,completed,updated_at FROM user_progress WHERE user_id=? ORDER BY unit_id,activity_id"),
                "activity_question_scores": rows("SELECT unit_id,activity_id,question_index,earned_score,status FROM activity_question_scores WHERE user_id=? ORDER BY unit_id,activity_id,question_index"),
                "study_days": rows("SELECT studied_on FROM study_days WHERE user_id=? ORDER BY studied_on"),
                "practice_confirmations": rows("SELECT unit_id,activity_id,elapsed_seconds,confirmed_at FROM practice_confirmations WHERE user_id=? ORDER BY unit_id,activity_id"),
                "bonus_units": rows("SELECT unit_id,tier_locked,reward_total FROM bonus_units WHERE user_id=? ORDER BY unit_id"),
                "bonus_rewards": rows("SELECT unit_id,stage_id,game_score,reward_base,reward_awarded,tier,claimed_at FROM bonus_rewards WHERE user_id=? ORDER BY unit_id,stage_id"),
                "best_score_history": rows("SELECT unit_id,activity_id,previous_best,new_best,max_score,recorded_at FROM best_score_history WHERE user_id=? ORDER BY recorded_at,id"),
            }
            return {
                "format": STUDENT_BACKUP_FORMAT,
                "backup_version": STUDENT_BACKUP_VERSION,
                "database_schema_version": DATABASE_SCHEMA_VERSION,
                "exported_at": self._now(),
                "student": {"username": user["username"], "created_at": user["created_at"]},
                "data": data,
            }
        finally:
            connection.close()

    @staticmethod
    def _backup_rows(payload: dict[str, object], name: str, *, maximum: int = 100_000) -> list[dict[str, object]]:
        data = payload.get("data")
        if not isinstance(data, dict):
            raise ValueError("backup data must be an object")
        value = data.get(name, [])
        if not isinstance(value, list) or len(value) > maximum or any(not isinstance(row, dict) for row in value):
            raise ValueError(f"backup table {name} is invalid")
        return value

    @staticmethod
    def _backup_int(row: dict[str, object], name: str, *, minimum: int = 0, maximum: int = 1_000_000) -> int:
        value = row.get(name)
        if isinstance(value, bool) or not isinstance(value, int) or not minimum <= value <= maximum:
            raise ValueError(f"backup field {name} is invalid")
        return value

    @staticmethod
    def _backup_text(row: dict[str, object], name: str, *, maximum: int = 128) -> str:
        value = row.get(name)
        if not isinstance(value, str) or not value or len(value) > maximum:
            raise ValueError(f"backup field {name} is invalid")
        return value

    def _validate_backup_activity(self, row: dict[str, object]) -> tuple[str, str, int]:
        unit_id = self._backup_text(row, "unit_id", maximum=64)
        activity_id = self._backup_text(row, "activity_id", maximum=64)
        self._validate_key(unit_id, "unit_id")
        self._validate_key(activity_id, "activity_id")
        plan = registered_activity_plan(unit_id)
        if activity_id not in plan:
            raise ValueError(f"backup activity {unit_id}/{activity_id} is not registered")
        return unit_id, activity_id, int(plan[activity_id])

    def restore_user_backup(self, user_id: int, payload: dict[str, object]) -> dict[str, object]:
        if not isinstance(payload, dict) or payload.get("format") != STUDENT_BACKUP_FORMAT:
            raise ValueError("not an English Quest student backup")
        if payload.get("backup_version") != STUDENT_BACKUP_VERSION:
            raise ValueError("unsupported backup version")
        source_student = payload.get("student")
        if not isinstance(source_student, dict):
            raise ValueError("backup student is invalid")
        source_username = self._backup_text(source_student, "username", maximum=64)

        progress_rows = self._backup_rows(payload, "user_progress")
        question_rows = self._backup_rows(payload, "activity_question_scores")
        study_rows = self._backup_rows(payload, "study_days")
        practice_rows = self._backup_rows(payload, "practice_confirmations")
        bonus_unit_rows = self._backup_rows(payload, "bonus_units")
        bonus_reward_rows = self._backup_rows(payload, "bonus_rewards")
        history_rows = self._backup_rows(payload, "best_score_history")

        validated_progress: list[tuple[object, ...]] = []
        for row in progress_rows:
            unit_id, activity_id, planned_max = self._validate_backup_activity(row)
            earned = self._backup_int(row, "earned_score", maximum=planned_max)
            maximum = self._backup_int(row, "max_score", minimum=1, maximum=1_000_000)
            completed = self._backup_int(row, "completed", maximum=1)
            updated_at = self._backup_text(row, "updated_at")
            if maximum != planned_max:
                raise ValueError(f"backup max_score does not match {unit_id}/{activity_id}")
            validated_progress.append((user_id, unit_id, activity_id, earned, maximum, completed, updated_at))

        validated_questions: list[tuple[object, ...]] = []
        for row in question_rows:
            unit_id, activity_id, planned_max = self._validate_backup_activity(row)
            question_index = self._backup_int(row, "question_index", maximum=max(0, planned_max // 100 - 1))
            earned = self._backup_int(row, "earned_score", maximum=100)
            question_status = self._backup_text(row, "status", maximum=16)
            if question_status not in {"scored", "skipped"} or (question_status == "skipped" and earned != 0):
                raise ValueError("backup question status is invalid")
            validated_questions.append((user_id, unit_id, activity_id, question_index, earned, question_status))

        validated_study_days: list[tuple[object, ...]] = []
        for row in study_rows:
            studied_on = self._backup_text(row, "studied_on", maximum=10)
            try:
                date.fromisoformat(studied_on)
            except ValueError as error:
                raise ValueError("backup study date is invalid") from error
            validated_study_days.append((user_id, studied_on))

        validated_practice: list[tuple[object, ...]] = []
        for row in practice_rows:
            unit_id, activity_id, _ = self._validate_backup_activity(row)
            elapsed = self._backup_int(row, "elapsed_seconds", minimum=11, maximum=3600)
            confirmed_at = self._backup_text(row, "confirmed_at")
            validated_practice.append((user_id, unit_id, activity_id, elapsed, confirmed_at))

        validated_bonus_units: list[tuple[object, ...]] = []
        for row in bonus_unit_rows:
            unit_id = self._backup_text(row, "unit_id", maximum=64)
            require_branch(unit_id)
            tier = self._backup_text(row, "tier_locked", maximum=16)
            if tier not in {"high", "standard"}:
                raise ValueError("backup bonus tier is invalid")
            reward_total = self._backup_int(row, "reward_total", maximum=1_000_000)
            validated_bonus_units.append((user_id, unit_id, tier, reward_total))

        validated_bonus_rewards: list[tuple[object, ...]] = []
        for row in bonus_reward_rows:
            unit_id = self._backup_text(row, "unit_id", maximum=64)
            require_branch(unit_id)
            stage_id = self._backup_text(row, "stage_id", maximum=16)
            if stage_id not in {"treasure", "boss", "detective"}:
                raise ValueError("backup bonus stage is invalid")
            game_score = self._backup_int(row, "game_score", maximum=1000)
            reward_base = self._backup_int(row, "reward_base", maximum=1_000_000)
            reward_awarded = self._backup_int(row, "reward_awarded", maximum=reward_base)
            tier = self._backup_text(row, "tier", maximum=16)
            if tier not in {"high", "standard"}:
                raise ValueError("backup bonus tier is invalid")
            claimed_at = self._backup_text(row, "claimed_at")
            validated_bonus_rewards.append((user_id, unit_id, stage_id, game_score, reward_base, reward_awarded, tier, claimed_at))

        validated_history: list[tuple[object, ...]] = []
        for row in history_rows:
            unit_id, activity_id, planned_max = self._validate_backup_activity(row)
            previous = self._backup_int(row, "previous_best", maximum=planned_max)
            new_best = self._backup_int(row, "new_best", maximum=planned_max)
            maximum = self._backup_int(row, "max_score", minimum=1, maximum=1_000_000)
            recorded_at = self._backup_text(row, "recorded_at")
            if maximum != planned_max or new_best < previous:
                raise ValueError("backup best-score history is invalid")
            validated_history.append((user_id, unit_id, activity_id, previous, new_best, maximum, recorded_at))

        self.backup_directory.mkdir(parents=True, exist_ok=True)
        stamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%S%fZ")
        snapshot = self.backup_directory / f"student-{user_id}-pre-restore-{stamp}.json"
        snapshot.write_text(json.dumps(self.export_user_backup(user_id), ensure_ascii=False, indent=2), encoding="utf-8")

        connection = self._connect()
        try:
            connection.execute("BEGIN IMMEDIATE")
            connection.executemany("""INSERT INTO user_progress(user_id,unit_id,activity_id,earned_score,max_score,completed,updated_at)
                VALUES(?,?,?,?,?,?,?) ON CONFLICT(user_id,unit_id,activity_id) DO UPDATE SET
                earned_score=MAX(user_progress.earned_score,excluded.earned_score),
                max_score=excluded.max_score,completed=MAX(user_progress.completed,excluded.completed),
                updated_at=MAX(user_progress.updated_at,excluded.updated_at)""", validated_progress)
            connection.executemany("""INSERT INTO activity_question_scores(user_id,unit_id,activity_id,question_index,earned_score,status)
                VALUES(?,?,?,?,?,?) ON CONFLICT(user_id,unit_id,activity_id,question_index) DO UPDATE SET
                earned_score=MAX(activity_question_scores.earned_score,excluded.earned_score),
                status=CASE WHEN activity_question_scores.status='scored' OR excluded.status='scored' THEN 'scored' ELSE 'skipped' END""", validated_questions)
            connection.executemany("INSERT OR IGNORE INTO study_days(user_id,studied_on) VALUES(?,?)", validated_study_days)
            connection.executemany("""INSERT INTO practice_confirmations(user_id,unit_id,activity_id,elapsed_seconds,confirmed_at)
                VALUES(?,?,?,?,?) ON CONFLICT(user_id,unit_id,activity_id) DO UPDATE SET
                elapsed_seconds=MAX(practice_confirmations.elapsed_seconds,excluded.elapsed_seconds),
                confirmed_at=MAX(practice_confirmations.confirmed_at,excluded.confirmed_at)""", validated_practice)
            connection.executemany("""INSERT INTO bonus_units(user_id,unit_id,tier_locked,reward_total) VALUES(?,?,?,?)
                ON CONFLICT(user_id,unit_id) DO UPDATE SET reward_total=MAX(bonus_units.reward_total,excluded.reward_total)""", validated_bonus_units)
            connection.executemany("""INSERT INTO bonus_rewards(user_id,unit_id,stage_id,game_score,reward_base,reward_awarded,tier,claimed_at)
                VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(user_id,unit_id,stage_id) DO UPDATE SET
                game_score=excluded.game_score,reward_base=excluded.reward_base,reward_awarded=excluded.reward_awarded,
                tier=excluded.tier,claimed_at=excluded.claimed_at WHERE excluded.game_score>bonus_rewards.game_score""", validated_bonus_rewards)
            for values in validated_history:
                connection.execute("""INSERT INTO best_score_history(user_id,unit_id,activity_id,previous_best,new_best,max_score,recorded_at)
                    SELECT ?,?,?,?,?,?,? WHERE NOT EXISTS (
                        SELECT 1 FROM best_score_history WHERE user_id=? AND unit_id=? AND activity_id=? AND new_best=? AND recorded_at=?)""",
                    values + (values[0], values[1], values[2], values[4], values[6]))
            if self._quick_check(connection) != "ok":
                raise RuntimeError("Database integrity check failed after restore")
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()

        return {
            "restored": True,
            "source_username": source_username,
            "snapshot_created": True,
            "counts": {
                "activities": len(validated_progress),
                "questions": len(validated_questions),
                "study_days": len(validated_study_days),
                "practice": len(validated_practice),
                "bonus_rewards": len(validated_bonus_rewards),
                "history": len(validated_history),
            },
        }

    def save_user_progress(self, user_id: int, unit_id: str, activity_id: str, *,
                           earned_score: int, max_score: int, completed: bool,
                           studied_on: date | None = None, question_scores: list[int] | None = None,
                           question_statuses: list[str] | None = None) -> UserProgress:
        self._validate_key(unit_id, "unit_id"); self._validate_key(activity_id, "activity_id")
        if isinstance(earned_score, bool) or not isinstance(earned_score, int) or earned_score < 0: raise ValueError("earned_score must be a non-negative integer")
        if isinstance(max_score, bool) or not isinstance(max_score, int) or max_score <= 0: raise ValueError("max_score must be a positive integer")
        if earned_score > max_score: raise ValueError("earned_score cannot exceed max_score")
        unit_plan = registered_activity_plan(unit_id)
        if activity_id not in unit_plan: raise ValueError(f"activity_id is not registered for {unit_id}")
        planned_max = unit_plan.get(activity_id)
        if planned_max is not None and max_score != planned_max: raise ValueError(f"max_score must be {planned_max} for this activity")
        if not isinstance(completed, bool): raise ValueError("completed must be a boolean")
        if question_scores is not None:
            expected_count = max_score // 100
            if max_score % 100 or len(question_scores) != expected_count or any(isinstance(score, bool) or not isinstance(score, int) or not 0 <= score <= 100 for score in question_scores):
                raise ValueError("question_scores must contain one 0-100 integer per question")
            if earned_score != sum(question_scores): raise ValueError("earned_score must equal the sum of question_scores")
            if question_statuses is not None and (len(question_statuses) != expected_count or any(status not in {"scored", "skipped"} for status in question_statuses)):
                raise ValueError("question_statuses must contain scored or skipped for every question")
        elif question_statuses is not None:
            raise ValueError("question_statuses require question_scores")
        updated_at = self._now(); study_date = (studied_on or datetime.now().astimezone().date()).isoformat()
        connection = self._connect()
        try:
            previous_row = connection.execute(
                "SELECT earned_score FROM user_progress WHERE user_id=? AND unit_id=? AND activity_id=?",
                (user_id, unit_id, activity_id),
            ).fetchone()
            previous_best = previous_row["earned_score"] if previous_row else 0
            cursor = connection.execute("""INSERT INTO user_progress(user_id,unit_id,activity_id,earned_score,max_score,completed,updated_at)
                VALUES(?,?,?,?,?,?,?) ON CONFLICT(user_id,unit_id,activity_id) DO UPDATE SET
                earned_score=MAX(user_progress.earned_score,excluded.earned_score),max_score=MAX(user_progress.max_score,excluded.max_score),
                completed=MAX(user_progress.completed,excluded.completed),updated_at=excluded.updated_at
                RETURNING unit_id,activity_id,earned_score,max_score,completed,updated_at""",
                (user_id, unit_id, activity_id, earned_score, max_score, int(completed), updated_at))
            row = cursor.fetchone()
            if question_scores is not None:
                for question_index, question_score in enumerate(question_scores):
                    question_status = question_statuses[question_index] if question_statuses is not None else "scored"
                    connection.execute("""INSERT INTO activity_question_scores(user_id,unit_id,activity_id,question_index,earned_score,status)
                        VALUES(?,?,?,?,?,?) ON CONFLICT(user_id,unit_id,activity_id,question_index) DO UPDATE SET
                        earned_score=MAX(activity_question_scores.earned_score,excluded.earned_score),
                        status=CASE WHEN excluded.status='scored' THEN 'scored' ELSE activity_question_scores.status END""",
                        (user_id, unit_id, activity_id, question_index, question_score, question_status))
                best_question_total = connection.execute(
                    "SELECT COALESCE(SUM(earned_score),0) FROM activity_question_scores WHERE user_id=? AND unit_id=? AND activity_id=?",
                    (user_id, unit_id, activity_id),
                ).fetchone()[0]
                connection.execute(
                    "UPDATE user_progress SET earned_score=MAX(earned_score,?),updated_at=? WHERE user_id=? AND unit_id=? AND activity_id=?",
                    (best_question_total, updated_at, user_id, unit_id, activity_id),
                )
                row = connection.execute(
                    "SELECT unit_id,activity_id,earned_score,max_score,completed,updated_at FROM user_progress WHERE user_id=? AND unit_id=? AND activity_id=?",
                    (user_id, unit_id, activity_id),
                ).fetchone()
            if row["earned_score"] > previous_best:
                connection.execute("""INSERT INTO best_score_history(
                    user_id,unit_id,activity_id,previous_best,new_best,max_score,recorded_at)
                    VALUES(?,?,?,?,?,?,?)""", (user_id, unit_id, activity_id, previous_best,
                    row["earned_score"], row["max_score"], updated_at))
            connection.execute("INSERT OR IGNORE INTO study_days(user_id,studied_on) VALUES(?,?)", (user_id, study_date))
            connection.commit()
        finally: connection.close()
        return UserProgress(row["unit_id"], row["activity_id"], row["earned_score"], row["max_score"], bool(row["completed"]), row["updated_at"])

    def save_question_progress(self, user_id: int, unit_id: str, activity_id: str, *,
                               question_index: int, earned_score: int,
                               question_status: str, studied_on: date | None = None) -> UserProgress:
        self._validate_key(unit_id, "unit_id"); self._validate_key(activity_id, "activity_id")
        unit_plan = registered_activity_plan(unit_id)
        if activity_id not in unit_plan: raise ValueError(f"activity_id is not registered for {unit_id}")
        planned_max = unit_plan[activity_id]
        if planned_max % 100: raise ValueError("activity maximum must be divisible by 100")
        expected_count = planned_max // 100
        if isinstance(question_index, bool) or not isinstance(question_index, int) or not 0 <= question_index < expected_count:
            raise ValueError(f"question_index must be between 0 and {expected_count - 1}")
        if isinstance(earned_score, bool) or not isinstance(earned_score, int) or not 0 <= earned_score <= 100:
            raise ValueError("earned_score must be an integer from 0 to 100")
        if question_status not in {"scored", "skipped"}: raise ValueError("question_status must be scored or skipped")
        if question_status == "skipped" and earned_score != 0: raise ValueError("skipped questions must have zero points")
        updated_at = self._now(); study_date = (studied_on or datetime.now().astimezone().date()).isoformat()
        connection = self._connect()
        try:
            previous = connection.execute(
                "SELECT earned_score,completed FROM user_progress WHERE user_id=? AND unit_id=? AND activity_id=?",
                (user_id, unit_id, activity_id),
            ).fetchone()
            previous_best = previous["earned_score"] if previous else 0
            connection.execute("""INSERT INTO user_progress(user_id,unit_id,activity_id,earned_score,max_score,completed,updated_at)
                VALUES(?,?,?,?,?,0,?) ON CONFLICT(user_id,unit_id,activity_id) DO UPDATE SET updated_at=excluded.updated_at""",
                (user_id, unit_id, activity_id, 0, planned_max, updated_at))
            connection.execute("""INSERT INTO activity_question_scores(user_id,unit_id,activity_id,question_index,earned_score,status)
                VALUES(?,?,?,?,?,?) ON CONFLICT(user_id,unit_id,activity_id,question_index) DO UPDATE SET
                earned_score=MAX(activity_question_scores.earned_score,excluded.earned_score),
                status=CASE WHEN excluded.status='scored' THEN 'scored' ELSE activity_question_scores.status END""",
                (user_id, unit_id, activity_id, question_index, earned_score, question_status))
            best_total = connection.execute(
                "SELECT COALESCE(SUM(earned_score),0) FROM activity_question_scores WHERE user_id=? AND unit_id=? AND activity_id=?",
                (user_id, unit_id, activity_id),
            ).fetchone()[0]
            connection.execute(
                "UPDATE user_progress SET earned_score=MAX(earned_score,?),updated_at=? WHERE user_id=? AND unit_id=? AND activity_id=?",
                (best_total, updated_at, user_id, unit_id, activity_id),
            )
            row = connection.execute(
                "SELECT unit_id,activity_id,earned_score,max_score,completed,updated_at FROM user_progress WHERE user_id=? AND unit_id=? AND activity_id=?",
                (user_id, unit_id, activity_id),
            ).fetchone()
            if previous and previous["completed"] and row["earned_score"] > previous_best:
                connection.execute("""INSERT INTO best_score_history(
                    user_id,unit_id,activity_id,previous_best,new_best,max_score,recorded_at)
                    VALUES(?,?,?,?,?,?,?)""", (user_id, unit_id, activity_id, previous_best,
                    row["earned_score"], row["max_score"], updated_at))
            connection.execute("INSERT OR IGNORE INTO study_days(user_id,studied_on) VALUES(?,?)", (user_id, study_date))
            connection.commit()
        finally: connection.close()
        return UserProgress(row["unit_id"], row["activity_id"], row["earned_score"], row["max_score"], bool(row["completed"]), row["updated_at"])

    def complete_user_activity(self, user_id: int, unit_id: str, activity_id: str) -> UserProgress:
        self._validate_key(unit_id, "unit_id"); self._validate_key(activity_id, "activity_id")
        unit_plan = registered_activity_plan(unit_id)
        if activity_id not in unit_plan: raise ValueError(f"activity_id is not registered for {unit_id}")
        planned_max = unit_plan[activity_id]
        if planned_max % 100: raise ValueError("activity maximum must be divisible by 100")
        expected_count = planned_max // 100
        updated_at = self._now()
        connection = self._connect()
        try:
            question_rows = connection.execute(
                "SELECT question_index,earned_score FROM activity_question_scores WHERE user_id=? AND unit_id=? AND activity_id=? ORDER BY question_index",
                (user_id, unit_id, activity_id),
            ).fetchall()
            if len(question_rows) != expected_count or [row["question_index"] for row in question_rows] != list(range(expected_count)):
                raise ValueError(f"all {expected_count} questions must be saved before completion")
            total = sum(row["earned_score"] for row in question_rows)
            previous = connection.execute(
                "SELECT earned_score,completed FROM user_progress WHERE user_id=? AND unit_id=? AND activity_id=?",
                (user_id, unit_id, activity_id),
            ).fetchone()
            previous_best = previous["earned_score"] if previous else 0
            connection.execute("""INSERT INTO user_progress(user_id,unit_id,activity_id,earned_score,max_score,completed,updated_at)
                VALUES(?,?,?,?,?,1,?) ON CONFLICT(user_id,unit_id,activity_id) DO UPDATE SET
                earned_score=MAX(user_progress.earned_score,excluded.earned_score),max_score=excluded.max_score,
                completed=1,updated_at=excluded.updated_at""",
                (user_id, unit_id, activity_id, total, planned_max, updated_at))
            row = connection.execute(
                "SELECT unit_id,activity_id,earned_score,max_score,completed,updated_at FROM user_progress WHERE user_id=? AND unit_id=? AND activity_id=?",
                (user_id, unit_id, activity_id),
            ).fetchone()
            if row["earned_score"] > previous_best:
                connection.execute("""INSERT INTO best_score_history(
                    user_id,unit_id,activity_id,previous_best,new_best,max_score,recorded_at)
                    VALUES(?,?,?,?,?,?,?)""", (user_id, unit_id, activity_id, previous_best,
                    row["earned_score"], row["max_score"], updated_at))
            connection.commit()
        finally: connection.close()
        return UserProgress(row["unit_id"], row["activity_id"], row["earned_score"], row["max_score"], bool(row["completed"]), row["updated_at"])

    def unit_summary(self, user_id: int, unit_id: str) -> dict[str, object]:
        self._validate_key(unit_id, "unit_id")
        planned = registered_activity_plan(unit_id)
        connection = self._connect()
        try:
            rows = connection.execute("SELECT unit_id,activity_id,earned_score,max_score,completed,updated_at FROM user_progress WHERE user_id=? AND unit_id=? ORDER BY activity_id", (user_id,unit_id)).fetchall()
            question_rows = connection.execute("SELECT activity_id,question_index,earned_score,status FROM activity_question_scores WHERE user_id=? AND unit_id=?", (user_id,unit_id)).fetchall()
        finally: connection.close()
        items = [UserProgress(r["unit_id"],r["activity_id"],r["earned_score"],r["max_score"],bool(r["completed"]),r["updated_at"]) for r in rows if r["activity_id"] in planned]
        earned = sum(x.earned_score for x in items)
        maximum = sum(planned.values()) if planned else sum(x.max_score for x in items)
        progress_by_activity = {item.activity_id: item for item in items}
        questions_by_activity: dict[str, list[dict[str, object]]] = {}
        for row in question_rows:
            questions_by_activity.setdefault(row["activity_id"], []).append({"question_index": row["question_index"], "earned_score": row["earned_score"], "status": row["status"]})
        for values in questions_by_activity.values():
            values.sort(key=lambda value: int(value["question_index"]))
        improvement_targets = []
        for activity_id, activity_max in planned.items():
            item = progress_by_activity.get(activity_id)
            score = item.earned_score if item else 0
            weak = sorted((value for value in questions_by_activity.get(activity_id, []) if value["status"] == "scored"), key=lambda value: int(value["earned_score"]))[:5]
            improvement_targets.append({"activity_id": activity_id, "earned_score": score, "max_score": activity_max,
                "percent": round(score * 100 / activity_max), "completed": bool(item and item.completed),
                "weak_questions": [{"question_index": value["question_index"], "earned_score": value["earned_score"]} for value in weak]})
        improvement_targets.sort(key=lambda target: (target["completed"], target["percent"], target["activity_id"]))
        return {"unit_id":unit_id,"earned_score":earned,"max_score":maximum,
                "completion_percent":round(earned*100/maximum,2) if maximum else 0.0,
                "core_complete": bool(planned) and all(progress_by_activity.get(key) and progress_by_activity[key].completed for key in planned),
                "improvement_targets": improvement_targets[:8],
                "progress":[{**x.to_dict(), "question_scores": questions_by_activity.get(x.activity_id, [])} for x in items],
                "required_practice": self.practice_state(user_id, unit_id), **self.streak(user_id)}

    def confirm_practice(self, user_id: int, unit_id: str, activity_id: str, *, elapsed_seconds: int) -> dict[str, object]:
        self._validate_key(unit_id, "unit_id"); self._validate_key(activity_id, "activity_id")
        plan = registered_activity_plan(unit_id)
        if activity_id not in plan: raise ValueError(f"activity_id is not registered for {unit_id}")
        required = UNIT_REQUIRED_PRACTICES.get(unit_id, {}).get(activity_id)
        if required is None: raise ValueError("activity is not a required practice")
        if isinstance(elapsed_seconds, bool) or not isinstance(elapsed_seconds, int) or elapsed_seconds < required:
            raise ValueError(f"practice must last at least {required} seconds")
        confirmed_at = self._now(); connection = self._connect()
        try:
            connection.execute("""INSERT INTO practice_confirmations(user_id,unit_id,activity_id,elapsed_seconds,confirmed_at)
                VALUES(?,?,?,?,?) ON CONFLICT(user_id,unit_id,activity_id) DO UPDATE SET
                elapsed_seconds=MAX(practice_confirmations.elapsed_seconds,excluded.elapsed_seconds),confirmed_at=excluded.confirmed_at""",
                (user_id, unit_id, activity_id, elapsed_seconds, confirmed_at))
            connection.commit()
        finally: connection.close()
        planned_max = UNIT_ACTIVITY_MAXIMA.get(unit_id, {}).get(activity_id)
        if planned_max is not None:
            self.save_user_progress(user_id, unit_id, activity_id, earned_score=planned_max,
                max_score=planned_max, completed=True)
        return self.practice_state(user_id, unit_id)

    def practice_state(self, user_id: int, unit_id: str) -> dict[str, object]:
        registered_activity_plan(unit_id)
        required = UNIT_REQUIRED_PRACTICES.get(unit_id, {})
        connection = self._connect()
        try:
            rows = connection.execute(
                "SELECT activity_id,elapsed_seconds,confirmed_at FROM practice_confirmations WHERE user_id=? AND unit_id=?",
                (user_id, unit_id),
            ).fetchall()
        finally: connection.close()
        confirmed = {row["activity_id"]: dict(row) for row in rows
                     if row["activity_id"] in required and row["elapsed_seconds"] >= required[row["activity_id"]]}
        items = [{"activity_id": activity_id, "minimum_seconds": seconds, "confirmed": activity_id in confirmed,
                  **(confirmed.get(activity_id) or {})} for activity_id, seconds in required.items()]
        return {"complete": all(item["confirmed"] for item in items), "items": items}

    def score_profile(self, user_id: int, course_id: str = DEFAULT_COURSE_ID) -> dict[str, object]:
        course = require_course(course_id)
        branches = []
        for unit_id in course.branch_ids:
            manifest = UNIT_ACTIVITY_MAXIMA.get(unit_id, {})
            summary = self.unit_summary(user_id, unit_id)
            completed = sum(1 for item in summary["progress"] if item["completed"])
            branches.append({
                "unit_id": unit_id,
                "earned_score": summary["earned_score"],
                "max_score": summary["max_score"],
                "percent": summary["completion_percent"],
                "completed_activities": completed,
                "total_activities": len(manifest),
                "last_updated": max((item["updated_at"] for item in summary["progress"]), default=None),
            })
        course_earned = sum(int(branch["earned_score"]) for branch in branches)
        course_max = sum(int(branch["max_score"]) for branch in branches)
        connection = self._connect()
        try:
            placeholders = ",".join("?" for _ in course.branch_ids)
            if course.branch_ids:
                history_rows = connection.execute(f"""SELECT id,unit_id,activity_id,previous_best,new_best,max_score,recorded_at
                    FROM best_score_history WHERE user_id=? AND unit_id IN ({placeholders})
                    ORDER BY recorded_at DESC,id DESC LIMIT 100""", (user_id, *course.branch_ids)).fetchall()
                reward_total = connection.execute(
                    f"SELECT COALESCE(SUM(reward_awarded),0) FROM bonus_rewards WHERE user_id=? AND unit_id IN ({placeholders})",
                    (user_id, *course.branch_ids),
                ).fetchone()[0]
            else:
                history_rows = []
                reward_total = 0
        finally: connection.close()
        history = [{**dict(row), "improvement": row["new_best"] - row["previous_best"]} for row in history_rows]
        recommendations = []
        for branch in branches:
            summary = self.unit_summary(user_id, str(branch["unit_id"]))
            for item in summary["progress"]:
                questions = item.get("question_scores", [])
                skipped = [question for question in questions if question["status"] == "skipped"][:5]
                weakest = sorted((question for question in questions if question["status"] == "scored"), key=lambda question: question["earned_score"])[:5]
                if skipped or weakest:
                    recommendations.append({"unit_id": branch["unit_id"], "activity_id": item["activity_id"],
                        "skipped_questions": skipped, "weak_questions": weakest})
        return {
            "course_id": course.id,
            "course_best": {
                "earned_score": course_earned,
                "max_score": course_max,
                "percent": round(course_earned * 100 / course_max, 2) if course_max else 0.0,
                "completed_activities": sum(int(branch["completed_activities"]) for branch in branches),
                "total_activities": sum(int(branch["total_activities"]) for branch in branches),
            },
            "branches": branches,
            "bonus_reward_total": reward_total,
            "best_history": history,
            "recommendations": recommendations,
            **self.streak(user_id),
        }

    def score_overview(self, user_id: int) -> dict[str, object]:
        course_summaries: list[dict[str, object]] = []
        for course in course_catalog().courses:
            if course.status != "available" or not course.branch_ids:
                continue
            profile = self.score_profile(user_id, course.id)
            best = profile["course_best"]
            branches = profile["branches"]
            course_summaries.append({
                "course_id": course.id,
                "subject": course.subject,
                "subject_label": course.subject_label,
                "grade": course.grade,
                "semester": course.semester,
                "title": course.title,
                "status": course.status,
                "earned_score": best["earned_score"],
                "max_score": best["max_score"],
                "percent": best["percent"],
                "completed_activities": best["completed_activities"],
                "total_activities": best["total_activities"],
                "bonus_reward_total": profile["bonus_reward_total"],
                "last_updated": max((branch["last_updated"] for branch in branches if branch["last_updated"]), default=None),
            })
        return aggregate_course_summaries(course_summaries)

    def bonus_state(self, user_id: int, unit_id: str) -> dict[str, object]:
        summary = self.unit_summary(user_id, unit_id)
        earned = int(summary["earned_score"]); maximum = int(summary["max_score"])
        percent = float(summary["completion_percent"])
        practice = self.practice_state(user_id, unit_id)
        connection = self._connect()
        try:
            unit_row = connection.execute("SELECT tier_locked,reward_total FROM bonus_units WHERE user_id=? AND unit_id=?", (user_id,unit_id)).fetchone()
            reward_rows = connection.execute("SELECT stage_id,game_score,reward_base,reward_awarded,tier,claimed_at FROM bonus_rewards WHERE user_id=? AND unit_id=? ORDER BY claimed_at", (user_id,unit_id)).fetchall()
        finally: connection.close()
        claims = {row["stage_id"]: dict(row) for row in reward_rows}
        tier_locked = unit_row["tier_locked"] if unit_row else None
        high_score = maximum > 0 and earned * 100 >= maximum * 90
        standard_score = maximum > 0 and earned * 100 >= maximum * 70
        available_tier = tier_locked or ("high" if high_score else "standard" if standard_score else None)
        if not summary["core_complete"]: gate = "locked_incomplete"
        elif not practice["complete"]: gate = "locked_practice"
        elif not standard_score: gate = "locked_score"
        else: gate = "ready"
        stages = [{"stage_id": stage_id, "claimed": stage_id in claims, **(claims.get(stage_id) or {})} for stage_id in BONUS_STAGE_IDS]
        next_stage = next((stage["stage_id"] for stage in stages if not stage["claimed"]), None)
        return {"unit_id": unit_id, "gate": gate, "core_complete": summary["core_complete"], "completion_percent": percent,
            "available_tier": available_tier, "tier_locked": tier_locked, "high_tier_locked_out": tier_locked == "standard",
            "reward_total": unit_row["reward_total"] if unit_row else 0, "next_stage": next_stage,
            "stages": stages, "improvement_targets": summary["improvement_targets"], "required_practice": practice}

    def select_standard_bonus(self, user_id: int, unit_id: str) -> dict[str, object]:
        state = self.bonus_state(user_id, unit_id)
        if state["gate"] != "ready" or state["available_tier"] != "standard": raise ValueError("standard bonus is available only after all core games with 70%-under-90%")
        if state["tier_locked"] == "high": raise ValueError("high bonus is already locked")
        connection = self._connect()
        try:
            connection.execute("INSERT INTO bonus_units(user_id,unit_id,tier_locked,reward_total) VALUES(?,?,?,0) ON CONFLICT(user_id,unit_id) DO NOTHING", (user_id,unit_id,"standard")); connection.commit()
        finally: connection.close()
        return self.bonus_state(user_id, unit_id)

    def claim_bonus(self, user_id: int, unit_id: str, stage_id: str, *, earned_score: int, max_score: int) -> dict[str, object]:
        if stage_id not in BONUS_STAGE_IDS: raise ValueError("unknown bonus stage")
        if isinstance(earned_score, bool) or not isinstance(earned_score, int) or max_score != 1000 or not 0 <= earned_score <= max_score: raise ValueError("bonus score must be 0-1000 of 1000")
        state = self.bonus_state(user_id, unit_id)
        if state["gate"] != "ready": raise ValueError("bonus is still locked")
        if state["next_stage"] != stage_id: raise ValueError("bonus stages must be completed in order")
        tier = state["tier_locked"] or state["available_tier"]
        if tier == "standard" and state["tier_locked"] is None: raise ValueError("confirm the standard tier before starting")
        if tier not in BONUS_POOLS: raise ValueError("bonus tier is unavailable")
        roll = secrets.randbelow(100); cursor = 0; reward_base = BONUS_POOLS[tier][-1][0]
        for reward, weight in BONUS_POOLS[tier]:
            cursor += weight
            if roll < cursor: reward_base = reward; break
        reward_awarded = reward_base if earned_score >= 700 else reward_base // 2
        claimed_at = self._now(); connection = self._connect()
        try:
            connection.execute("INSERT INTO bonus_units(user_id,unit_id,tier_locked,reward_total) VALUES(?,?,?,?) ON CONFLICT(user_id,unit_id) DO UPDATE SET reward_total=bonus_units.reward_total+excluded.reward_total", (user_id,unit_id,tier,reward_awarded))
            connection.execute("INSERT INTO bonus_rewards(user_id,unit_id,stage_id,game_score,reward_base,reward_awarded,tier,claimed_at) VALUES(?,?,?,?,?,?,?,?)", (user_id,unit_id,stage_id,earned_score,reward_base,reward_awarded,tier,claimed_at))
            connection.commit()
        except sqlite3.IntegrityError as error: raise ValueError("bonus stage was already claimed") from error
        finally: connection.close()
        return {"claim": {"stage_id":stage_id,"tier":tier,"reward_base":reward_base,"reward_awarded":reward_awarded,"halved":earned_score<700,"roll":roll}, "state":self.bonus_state(user_id,unit_id)}

    def streak(self, user_id: int, *, today: date | None = None) -> dict[str, int]:
        today = today or datetime.now().astimezone().date(); connection = self._connect()
        try: rows = connection.execute("SELECT studied_on FROM study_days WHERE user_id=? ORDER BY studied_on",(user_id,)).fetchall()
        finally: connection.close()
        days = [date.fromisoformat(r["studied_on"]) for r in rows]; best=run=0; previous=None
        for day in days:
            run = run+1 if previous and day == previous+timedelta(days=1) else 1
            best=max(best,run); previous=day
        current=0
        if days and days[-1] >= today-timedelta(days=1):
            current=1
            for i in range(len(days)-1,0,-1):
                if days[i-1] != days[i]-timedelta(days=1): break
                current += 1
        return {"current_streak":current,"best_streak":best}

    # Legacy table/API retained so existing local progress survives migration.
    def save(self, student_id: str, activity_id: str, *, completed: bool, score: int, xp: int) -> Progress:
        self._validate_key(student_id,"student_id"); self._validate_key(activity_id,"activity_id")
        if not isinstance(completed,bool) or isinstance(score,bool) or not isinstance(score,int) or not 0<=score<=100 or isinstance(xp,bool) or not isinstance(xp,int) or not 0<=xp<=1_000_000: raise ValueError("invalid legacy progress")
        updated=self._now(); connection=self._connect()
        try:
            connection.execute("INSERT INTO progress VALUES(?,?,?,?,?,?) ON CONFLICT(student_id,activity_id) DO UPDATE SET completed=excluded.completed,score=excluded.score,xp=excluded.xp,updated_at=excluded.updated_at",(student_id,activity_id,int(completed),score,xp,updated)); connection.commit()
        finally: connection.close()
        return self.get(student_id,activity_id)

    def get(self, student_id: str, activity_id: str) -> Progress | None:
        self._validate_key(student_id,"student_id"); self._validate_key(activity_id,"activity_id"); connection=self._connect()
        try: row=connection.execute("SELECT * FROM progress WHERE student_id=? AND activity_id=?",(student_id,activity_id)).fetchone()
        finally: connection.close()
        return Progress(row["student_id"],row["activity_id"],bool(row["completed"]),row["score"],row["xp"],row["updated_at"]) if row else None

    def list_for_student(self, student_id: str) -> list[Progress]:
        self._validate_key(student_id,"student_id"); connection=self._connect()
        try: rows=connection.execute("SELECT * FROM progress WHERE student_id=? ORDER BY activity_id",(student_id,)).fetchall()
        finally: connection.close()
        return [Progress(r["student_id"],r["activity_id"],bool(r["completed"]),r["score"],r["xp"],r["updated_at"]) for r in rows]

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.database_path, timeout=5.0)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys=ON")
        connection.execute("PRAGMA busy_timeout=5000")
        return connection
    @staticmethod
    def _password_hash(password: str, salt: bytes, iterations: int) -> bytes: return hashlib.pbkdf2_hmac("sha256",password.encode("ascii"),salt,iterations)
    @staticmethod
    def _token_hash(token: str) -> bytes: return hashlib.sha256(token.encode()).digest()
    @staticmethod
    def _format(value: datetime) -> str: return value.isoformat(timespec="seconds").replace("+00:00","Z")
    @classmethod
    def _now(cls) -> str: return cls._format(datetime.now(UTC))
    @staticmethod
    def _validate_key(value: str,label: str) -> None:
        if not isinstance(value,str) or not KEY_RE.fullmatch(value): raise ValueError(f"{label} must contain 1-64 letters, digits, underscores or hyphens")
    @staticmethod
    def _validate_credentials(username: str,password: str) -> None:
        if not isinstance(username,str) or not USERNAME_RE.fullmatch(username): raise ValueError("username must contain 6-64 letters, digits, underscores or hyphens")
        if not isinstance(password,str) or not PASSWORD_RE.fullmatch(password): raise ValueError("password must contain exactly 4-6 digits")
