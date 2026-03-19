import json
import os
import re
from collections import Counter

from dotenv import load_dotenv

try:
    from google import genai
except ImportError:  # pragma: no cover - optional runtime dependency fallback
    genai = None


load_dotenv()

GENAI_API_KEY = os.getenv("GENAI_API_KEY")
GENAI_MODEL_NAME = os.getenv("GENAI_CONTENT_MODEL", "gemini-2.5-flash-lite")
GENAI_CLIENT = genai.Client(api_key=GENAI_API_KEY) if (genai and GENAI_API_KEY) else None

STOPWORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "in",
    "is",
    "it",
    "of",
    "on",
    "or",
    "that",
    "the",
    "this",
    "to",
    "was",
    "were",
    "will",
    "with",
}


def _extract_tokens(input_text: str) -> list[str]:
    # Keep simple Latin words and Japanese scripts for mixed-language learner input.
    token_pattern = r"[A-Za-z][A-Za-z'-]*|[\u3040-\u30ff\u4e00-\u9fff]+"
    return re.findall(token_pattern, input_text)


def _split_sentences(input_text: str) -> list[str]:
    sentences = [part.strip() for part in re.split(r"[.!?。！？]+", input_text) if part.strip()]
    return sentences


def _analyze_user_content_local(input_text: str) -> tuple[list[dict], list[dict], dict]:
    """
    Analyze learner input and generate personalized vocabulary and practice material.
    """
    tokens = _extract_tokens(input_text)
    normalized_tokens = [token.lower() for token in tokens]
    sentence_list = _split_sentences(input_text)

    learner_profile = {
        "sentence_count": len(sentence_list),
        "token_count": len(tokens),
        "average_sentence_length": round(len(tokens) / max(len(sentence_list), 1), 2),
    }

    token_counter = Counter(
        token
        for token in normalized_tokens
        if len(token) > 2 and token not in STOPWORDS
    )

    top_tokens = [token for token, _ in token_counter.most_common(6)]

    generated_vocab = [
        {
            "word": token,
            "occurrences": token_counter[token],
            "learning_focus": "high-frequency in your writing",
        }
        for token in top_tokens
    ]

    practice_materials = []

    for token in top_tokens[:3]:
        practice_materials.append(
            {
                "type": "sentence_rewrite",
                "prompt": f"Write a new sentence using '{token}' with a different context.",
                "target_word": token,
            }
        )

    if sentence_list:
        first_sentence = sentence_list[0]
        words = _extract_tokens(first_sentence)
        if len(words) >= 3:
            hidden = words[min(1, len(words) - 1)]
            masked_sentence = re.sub(rf"\b{re.escape(hidden)}\b", "___", first_sentence, count=1)
            practice_materials.append(
                {
                    "type": "fill_in_blank",
                    "question": masked_sentence,
                    "answer": hidden,
                }
            )

    if not practice_materials:
        practice_materials.append(
            {
                "type": "reflection",
                "prompt": "Add 2-3 sentences so we can generate more personalized exercises.",
            }
        )

    return generated_vocab, practice_materials, learner_profile


def _extract_first_json_object(raw_text: str) -> dict | None:
    if not raw_text:
        return None

    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\\s*", "", cleaned)
        cleaned = re.sub(r"\\s*```$", "", cleaned)

    try:
        data = json.loads(cleaned)
        return data if isinstance(data, dict) else None
    except json.JSONDecodeError:
        pass

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None

    possible_json = cleaned[start : end + 1]
    try:
        data = json.loads(possible_json)
        return data if isinstance(data, dict) else None
    except json.JSONDecodeError:
        return None


def _sanitize_generated_vocab(items: object) -> list[dict]:
    if not isinstance(items, list):
        return []

    vocab = []
    for item in items[:8]:
        if not isinstance(item, dict):
            continue
        word = str(item.get("word", "")).strip()
        if not word:
            continue
        vocab.append(
            {
                "word": word,
                "definition": str(item.get("definition", "")).strip(),
                "example": str(item.get("example", "")).strip(),
                "learning_focus": str(item.get("learning_focus", "")).strip() or "context usage",
            }
        )
    return vocab


def _sanitize_practice_materials(items: object) -> list[dict]:
    if not isinstance(items, list):
        return []

    materials = []
    for item in items[:8]:
        if not isinstance(item, dict):
            continue
        exercise_type = str(item.get("type", "")).strip() or "custom_exercise"
        prompt = str(item.get("prompt", item.get("question", ""))).strip()
        if not prompt:
            continue
        normalized = {
            "type": exercise_type,
            "prompt": prompt,
        }
        if item.get("answer") is not None:
            normalized["answer"] = str(item.get("answer")).strip()
        if item.get("target_word") is not None:
            normalized["target_word"] = str(item.get("target_word")).strip()
        materials.append(normalized)
    return materials


def _sanitize_learner_profile(profile: object) -> dict:
    if not isinstance(profile, dict):
        return {}
    return {
        "proficiency_estimate": str(profile.get("proficiency_estimate", "")).strip(),
        "focus_areas": [str(item).strip() for item in profile.get("focus_areas", []) if str(item).strip()][:5],
    }


def _sanitize_llm_grammar_feedback(grammar_feedback: object) -> dict:
    if not isinstance(grammar_feedback, dict):
        return {}

    issues_raw = grammar_feedback.get("priority_issues", [])
    issues = []
    if isinstance(issues_raw, list):
        for issue in issues_raw[:5]:
            if not isinstance(issue, dict):
                continue
            issues.append(
                {
                    "issue": str(issue.get("issue", "")).strip(),
                    "why": str(issue.get("why", "")).strip(),
                    "fix_tip": str(issue.get("fix_tip", "")).strip(),
                    "example": str(issue.get("example", "")).strip(),
                }
            )
    return {"priority_issues": issues}


def _generate_with_llm(input_text: str, target_language: str, difficulty_level: int) -> dict | None:
    if GENAI_CLIENT is None:
        return None

    clamped_difficulty = max(1, min(5, difficulty_level))
    prompt = f"""
You are an expert language tutor.
Analyze the learner's text and produce adaptive learning content.

Return ONLY valid JSON (no markdown, no comments) matching this schema:
{{
  "generated_vocab": [
    {{"word": "", "definition": "", "example": "", "learning_focus": ""}}
  ],
  "grammar_feedback": {{
    "priority_issues": [
      {{"issue": "", "why": "", "fix_tip": "", "example": ""}}
    ]
  }},
  "practice_materials": [
    {{"type": "sentence_rewrite", "prompt": "", "target_word": ""}},
    {{"type": "fill_in_blank", "prompt": "", "answer": ""}}
  ],
  "learner_profile": {{
    "proficiency_estimate": "",
    "focus_areas": [""]
  }}
}}

Rules:
- Language being learned: {target_language}
- Difficulty level (1 beginner to 5 advanced): {clamped_difficulty}
- Keep outputs concise, practical, and derived from learner text.
- Provide 3-6 vocabulary items and 3-6 practice materials.

Learner text:
{input_text}
""".strip()

    response = GENAI_CLIENT.models.generate_content(
        model=GENAI_MODEL_NAME,
        contents=prompt,
    )
    response_text = getattr(response, "text", "") or ""
    parsed = _extract_first_json_object(response_text)
    if not parsed:
        return None

    generated_vocab = _sanitize_generated_vocab(parsed.get("generated_vocab"))
    grammar_feedback = _sanitize_llm_grammar_feedback(parsed.get("grammar_feedback"))
    practice_materials = _sanitize_practice_materials(parsed.get("practice_materials"))
    learner_profile = _sanitize_learner_profile(parsed.get("learner_profile"))

    if not generated_vocab or not practice_materials:
        return None

    return {
        "generated_vocab": generated_vocab,
        "grammar_feedback": grammar_feedback,
        "practice_materials": practice_materials,
        "learner_profile": learner_profile,
        "source": "llm",
    }


def generate_personalized_content(
    input_text: str,
    target_language: str = "Japanese",
    difficulty_level: int = 1,
) -> dict:
    """
    Generate adaptive learning content with LLM-first strategy and local fallback.
    """
    local_vocab, local_practice, local_profile = _analyze_user_content_local(input_text)

    try:
        llm_result = _generate_with_llm(
            input_text=input_text,
            target_language=target_language,
            difficulty_level=difficulty_level,
        )
    except Exception:
        llm_result = None

    if llm_result:
        merged_profile = {
            "sentence_count": local_profile["sentence_count"],
            "token_count": local_profile["token_count"],
            "average_sentence_length": local_profile["average_sentence_length"],
            "proficiency_estimate": llm_result["learner_profile"].get("proficiency_estimate", ""),
            "focus_areas": llm_result["learner_profile"].get("focus_areas", []),
        }
        return {
            "generated_vocab": llm_result["generated_vocab"],
            "grammar_feedback": llm_result["grammar_feedback"],
            "practice_materials": llm_result["practice_materials"],
            "learner_profile": merged_profile,
            "generation_source": llm_result["source"],
        }

    return {
        "generated_vocab": local_vocab,
        "grammar_feedback": {"priority_issues": []},
        "practice_materials": local_practice,
        "learner_profile": local_profile,
        "generation_source": "local-fallback",
    }


def analyze_user_content(input_text: str) -> tuple[list[dict], list[dict], dict]:
    """
    Backward-compatible helper retained for legacy callers.
    """
    local_vocab, local_practice, local_profile = _analyze_user_content_local(input_text)
    return local_vocab, local_practice, local_profile
