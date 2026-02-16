from .models import GrammarError, GrammarCheck
from .serializers import GrammarErrorSerializer

def run_grammar_check(user, input_text, romaji_text="", english_text=""):
    """
    Shared grammar feedback service.
    Detects grammar issues, fetches explanations, and logs GrammarCheck.
    """

    detected_errors = []
    explanations = []

    # --- Example detection rules ---
    if "She run" in english_text or "She run" in input_text:
        detected_errors.append("subject_verb_agreement")
    if "行くを" in input_text:
        detected_errors.append("particle_misuse")
    if "Yo comer manzana" in input_text:
        detected_errors.append("verb_conjugation")

    # Fetch explanations from GrammarError table
    for code in detected_errors:
        try:
            grammar_error = GrammarError.objects.get(error_code=code)
            explanations.append(GrammarErrorSerializer(grammar_error).data)
        except GrammarError.DoesNotExist:
            explanations.append({
                "error_code": code,
                "description": "No explanation available",
                "example_correct": "",
                "example_incorrect": ""
            })

    # Save GrammarCheck record
    grammar_check = GrammarCheck.objects.create(
        user=user if user.is_authenticated else None,
        input_text=input_text,
        romaji_text=romaji_text,
        english_text=english_text,
        corrected_text="",  # optional AI correction later
        feedback={"errors": detected_errors, "explanations": explanations}
    )

    return explanations, grammar_check