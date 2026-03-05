from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import GrammarCheck, GrammarError
from .serializers import GrammarErrorSerializer, GrammarCheckSerializer
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def check_grammar(request):
    """
    API endpoint for grammar checking.
    Detects errors based on stored GrammarError rules and logs the check.
    """
    language = request.data.get("language", "english").lower()
    input_text = request.data.get("input_text")
    romaji_text = request.data.get("romaji_text", "")
    english_text = request.data.get("english_text", "")

    if not input_text:
        return Response({"error": "No input_text provided"}, status=status.HTTP_400_BAD_REQUEST)

    detected_errors = []
    explanations = []

    rules = GrammarError.objects.filter(language=language)
    for rule in rules:
        if rule.example_incorrect in input_text or rule.example_incorrect in english_text:
            detected_errors.append(rule.error_code)
            explanations.append(GrammarErrorSerializer(rule).data)

    grammar_check = GrammarCheck.objects.create(
        user=request.user,
        input_text=input_text,
        romaji_text=romaji_text,
        english_text=english_text,
        corrected_text="",
        feedback={"language": language, "errors": detected_errors, "explanations": explanations}
    )

    return Response({
        "id": grammar_check.id,
        "language": language,
        "input_text": input_text,
        "romaji_text": romaji_text,
        "english_text": english_text,
        "errors_detected": detected_errors,
        "explanations": explanations,
        "created_at": grammar_check.created_at,
        "message": "No grammar issues detected." if not detected_errors else None
    })

class GrammarCheckViewSet(viewsets.ViewSet):
    queryset = GrammarCheck.objects.all() 
    serializer_class = GrammarCheckSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"])
    def check(self, request):
        language = request.data.get("language", "english").lower()
        input_text = request.data.get("input_text")
        romaji_text = request.data.get("romaji_text", "")
        english_text = request.data.get("english_text", "")

        if not input_text:
            return Response({"error": "No input_text provided"}, status=400)

        # Detect errors by querying GrammarError rules for this language
        detected_errors = []
        explanations = []

        rules = GrammarError.objects.filter(language=language)
        for rule in rules:
            if rule.example_incorrect in input_text or rule.example_incorrect in english_text:
                detected_errors.append(rule.error_code)
                explanations.append(GrammarErrorSerializer(rule).data)

        grammar_check = GrammarCheck.objects.create(
            user=request.user if request.user.is_authenticated else None,
            input_text=input_text,
            romaji_text=romaji_text,
            english_text=english_text,
            corrected_text="",  # could be filled by AI later
            feedback={"language": language, "errors": detected_errors, "explanations": explanations}
        )

        return Response({
            "id": grammar_check.id,
            "language": language,
            "input_text": input_text,
            "romaji_text": romaji_text,
            "english_text": english_text,
            "errors_detected": detected_errors,
            "explanations": explanations,
            "created_at": grammar_check.created_at
        })