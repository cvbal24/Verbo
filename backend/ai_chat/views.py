import os
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from google import genai
from dotenv import load_dotenv
from .models import ConversationLog

# Load environment variables
load_dotenv()

api_key = os.getenv("GENAI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None
MODEL_NAME = "gemini-2.5-flash-lite"


class ChatViewSet(viewsets.ViewSet):
    """
    A ViewSet for handling chat requests with Google GenAI.
    """
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"])
    def chat(self, request):
        if client is None:
            return Response(
                {"error": "GENAI_API_KEY is not set in environment variables."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        user_message = request.data.get("message", "").strip()
        if not user_message:
            return Response({"error": "message is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_language = request.data.get("language", "any language")
            difficulty_level = int(request.data.get("difficulty_level", 1))

            prompt = (
                f"You are a Foreign Language Tutor. "
                f"The student is learning {target_language}. "
                f"Their question: '{user_message}'. "
                f"Respond with clear teaching, examples, and encouragement."
            )

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )

            reply = response.text if response else "Sorry, I could not generate a reply."
            ConversationLog.objects.create(
                user=request.user,
                input_text=user_message,
                response_text=reply,
                difficulty_level=max(1, min(5, difficulty_level)),
            )
            return Response({"reply": reply})

        except Exception:
            return Response(
                {"error": "AI service is temporarily unavailable."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )