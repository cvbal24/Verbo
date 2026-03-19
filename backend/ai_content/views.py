from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from grammar.services import run_grammar_check

from .models import CustomContentAnalysis
from .permissions import IsPremiumUser
from .services import generate_personalized_content


class CustomContentLearnerViewSet(viewsets.ViewSet):
    """
    Premium-only AI Custom Content Learner.
    Analyzes learner-generated text and produces personalized vocabulary,
    grammar feedback, and practice materials.
    """

    permission_classes = [IsPremiumUser]

    @action(detail=False, methods=["post"])
    def analyze(self, request):
        input_text = (request.data.get("input_text") or "").strip()
        target_language = (request.data.get("target_language") or "Japanese").strip()
        try:
            difficulty_level = int(request.data.get("difficulty_level", 1))
        except (TypeError, ValueError):
            return Response(
                {"error": "difficulty_level must be an integer between 1 and 5"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not input_text:
            return Response(
                {"error": "input_text is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        generated_content = generate_personalized_content(
            input_text=input_text,
            target_language=target_language,
            difficulty_level=difficulty_level,
        )
        generated_vocab = generated_content["generated_vocab"]
        practice_materials = generated_content["practice_materials"]
        learner_profile = generated_content["learner_profile"]
        generation_source = generated_content["generation_source"]

        explanations, grammar_check = run_grammar_check(
            user=request.user,
            input_text=input_text,
            romaji_text="",
            english_text=input_text,
        )

        grammar_feedback = {
            "detected_errors": grammar_check.feedback.get("errors", []),
            "explanations": explanations,
            "summary": {
                "error_count": len(grammar_check.feedback.get("errors", [])),
                "sentence_count": learner_profile["sentence_count"],
                "token_count": learner_profile["token_count"],
            },
            "ai_priority_issues": generated_content["grammar_feedback"].get("priority_issues", []),
        }

        analysis = CustomContentAnalysis.objects.create(
            user=request.user,
            input_text=input_text,
            generated_vocab=generated_vocab,
            grammar_feedback=grammar_feedback,
            practice_materials=practice_materials,
        )

        return Response({
            "id": analysis.id,
            "input_text": input_text,
            "generated_vocab": generated_vocab,
            "grammar_feedback": grammar_feedback,
            "grammar_check_id": grammar_check.id,
            "practice_materials": practice_materials,
            "learner_profile": learner_profile,
            "generation_source": generation_source,
            "created_at": analysis.created_at
        })