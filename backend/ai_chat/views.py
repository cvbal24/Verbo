import os
import json
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from google import genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# STEP 1: Initialize the Google GenAI Client
api_key = os.getenv("GENAI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

# The name of the AI model we want to use.
MODEL_NAME = "gemini-2.5-flash-lite"


# STEP 2: Define the View (API Endpoint Handler)
@csrf_exempt  # Disable CSRF for simplicity in this demo.
@api_view(["POST"])  # Only allow POST requests.
def chat_view(request):
    """
    Handle a chat request from the frontend.

    Expected request body (JSON):
    {
        "message": "How do I say 'thank you' in French?",
        "language": "French"
    }

    Returns (JSON):
    {
        "reply": "In French, you say 'Merci'."
    }
    or
    {
        "error": "Something went wrong"
    }
    """
    if client is None:
        return JsonResponse(
            {"error": "GENAI_API_KEY is not set in environment variables."},
            status=500,
        )

    try:
        body = json.loads(request.body.decode("utf-8"))
        user_message = body.get("message", "")
        target_language = body.get("language", "any language")

        # Construct the tutoring prompt
        prompt = (
            f"You are a Foreign Language Tutor. "
            f"The student is learning {target_language}. "
            f"Their question: '{user_message}'. "
            f"Respond with clear teaching, examples, and encouragement."
        )

        # Send to AI model
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        reply = response.text if response else "Sorry, I could not generate a reply."

        return JsonResponse({"reply": reply})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)