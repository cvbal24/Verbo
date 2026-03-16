import os
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from google import genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

api_key = os.getenv("GENAI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None
MODEL_NAME = "gemini-2.5-flash-lite"


class ChatViewSet(viewsets.ViewSet):
    """
    A ViewSet for handling chat requests with Google GenAI.
    """

    @action(detail=False, methods=["post"])
    def chat(self, request):
        if client is None:
            return Response(
                {"error": "GENAI_API_KEY is not set in environment variables."},
                status=500,
            )

        try:
            user_message = request.data.get("message", "")
            target_language = request.data.get("language", "any language")

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
            return Response({"reply": reply})

        except Exception as e:
            return Response({"error": str(e)}, status=500)