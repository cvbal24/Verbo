from .models import Lesson, Word


STARTER_CONTENT = {
    "japanese": {
        "title": "Japanese Basics",
        "description": "Essential beginner words and expressions for daily Japanese.",
        "words": [
            {"script": "こんにちは", "romaji": "Konnichiwa", "english": "Hello", "difficulty": 1, "tags": "greeting,beginner"},
            {"script": "ありがとう", "romaji": "Arigatou", "english": "Thank you", "difficulty": 1, "tags": "polite,beginner"},
            {"script": "すみません", "romaji": "Sumimasen", "english": "Excuse me", "difficulty": 1, "tags": "polite,travel"},
        ],
    },
    "korean": {
        "title": "Korean Basics",
        "description": "Starter Korean expressions for first conversations.",
        "words": [
            {"script": "안녕하세요", "romaji": "Annyeonghaseyo", "english": "Hello", "difficulty": 1, "tags": "greeting,beginner"},
            {"script": "감사합니다", "romaji": "Gamsahamnida", "english": "Thank you", "difficulty": 1, "tags": "polite,beginner"},
            {"script": "죄송합니다", "romaji": "Joesonghamnida", "english": "I am sorry", "difficulty": 1, "tags": "polite,travel"},
        ],
    },
    "spanish": {
        "title": "Spanish Basics",
        "description": "Core Spanish words and phrases for beginners.",
        "words": [
            {"script": "Hola", "romaji": "Hola", "english": "Hello", "difficulty": 1, "tags": "greeting,beginner"},
            {"script": "Gracias", "romaji": "Gracias", "english": "Thank you", "difficulty": 1, "tags": "polite,beginner"},
            {"script": "Por favor", "romaji": "Por favor", "english": "Please", "difficulty": 1, "tags": "polite,beginner"},
        ],
    },
    "chinese": {
        "title": "Chinese Basics",
        "description": "Practical Mandarin starter vocabulary.",
        "words": [
            {"script": "你好", "romaji": "Ni hao", "english": "Hello", "difficulty": 1, "tags": "greeting,beginner"},
            {"script": "谢谢", "romaji": "Xie xie", "english": "Thank you", "difficulty": 1, "tags": "polite,beginner"},
            {"script": "请", "romaji": "Qing", "english": "Please", "difficulty": 1, "tags": "polite,beginner"},
        ],
    },
}


def _upsert_language_content(language_key: str) -> None:
    starter = STARTER_CONTENT.get(language_key)
    if not starter:
        return

    language_label = language_key.capitalize()
    lesson, _ = Lesson.objects.get_or_create(
        language__iexact=language_label,
        defaults={
            "language": language_label,
            "title": starter["title"],
            "description": starter["description"],
        },
    )

    if not lesson.description:
        lesson.description = starter["description"]
        lesson.save(update_fields=["description"])

    for word_data in starter["words"]:
        Word.objects.get_or_create(
            lesson=lesson,
            script=word_data["script"],
            defaults={
                "romaji": word_data["romaji"],
                "english": word_data["english"],
                "difficulty": word_data["difficulty"],
                "tags": word_data["tags"],
            },
        )


def ensure_starter_content(language: str | None = None) -> None:
    """
    Ensure starter lesson/word content exists.

    If language is provided and supported, only that language is created.
    Otherwise all starter language packs are created.
    """
    if language:
        key = language.strip().lower()
        if key in STARTER_CONTENT:
            _upsert_language_content(key)
        return

    for key in STARTER_CONTENT:
        _upsert_language_content(key)
