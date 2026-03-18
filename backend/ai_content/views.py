from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import CustomContentAnalysis
from .permissions import IsPremiumUser
from grammar.services import run_grammar_check


class CustomContentLearnerViewSet(viewsets.ViewSet):
    """
    Premium-only AI Custom Content Learner.
    Analyzes learner-generated text and produces personalized vocabulary,
    grammar feedback, and practice materials.
    """

    permission_classes = [IsPremiumUser]

    @action(detail=False, methods=["post"])
    def analyze(self, request):
        user = request.user
        input_text = request.data.get("input_text")

        if not input_text:
            return Response({"error": "No input_text provided"}, status=status.HTTP_400_BAD_REQUEST)

        # --- AI logic placeholder ---
        # In production, integrate with NLP/AI models.
        # For now, simulate analysis.
        generated_vocab = [
            {"word": "海", "romaji": "umi", "english": "ocean"},
            {"word": "きれい", "romaji": "kirei", "english": "beautiful"}
        ]

        grammar_feedback = {
            "error_code": "particle_misuse",
            "description": "In Japanese, particles mark grammatical roles. 'を' marks the object, 'へ' marks direction.",
            "example_correct": "私は学校へ行く。",
            "example_incorrect": "私は学校へ行くを。"
        }

        practice_materials = [
            {"type": "fill_in_blank", "question": "私は学校___行く。", "answer": "へ"},
            {"type": "translation", "question": "Translate: The ocean is beautiful.", "answer": "海はきれいです。"}
        ]

        analysis = CustomContentAnalysis.objects.create(
            user=user,
            input_text=input_text,
            generated_vocab=generated_vocab,
            grammar_feedback=grammar_feedback,
            practice_materials=practice_materials
        )

        explanations, grammar_check = run_grammar_check(
            user=request.user,
            input_text=input_text,
            romaji_text="",
            english_text=input_text,
        )


        return Response({
            "id": analysis.id,
            "input_text": input_text,
            "generated_vocab": generated_vocab,
            "grammar_feedback": grammar_feedback,
            "grammar_explanations": explanations,
            "grammar_check_id": grammar_check.id,
            "practice_materials": practice_materials,
            "created_at": analysis.created_at
        })