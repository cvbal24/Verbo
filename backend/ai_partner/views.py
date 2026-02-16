from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ConversationLog
from .permissions import IsPremiumUser
from grammar.services import run_grammar_check


class AIConversationViewSet(viewsets.ViewSet):
    """
    Premium-only AI Conversation Partner.
    Learners practice free-form dialogue: they decide what to say,
    and the AI responds naturally with adaptive difficulty.
    """

    permission_classes = [IsPremiumUser]

    @action(detail=False, methods=["post"])
    def converse(self, request):
        user = request.user
        input_text = request.data.get("input_text")
        difficulty = int(request.data.get("difficulty", 1))

        if not input_text:
            return Response({"error": "No input_text provided"}, status=400)

        # --- AI logic placeholder ---
        # In production, integrate with an AI model (e.g., GPT or NMT).
        # For now, simulate adaptive responses.
        if difficulty == 1:
            response_text = f"わかりました！『{input_text}』ですね。簡単な返事をします: はい、そうです！"
            romaji = f"Wakarimashita! '{input_text}' desu ne. Kantan na henji o shimasu: Hai, sou desu!"
            english = f"Got it! You said '{input_text}'. Here’s a simple reply: Yes, that’s right!"
        elif difficulty == 2:
            response_text = f"面白いですね！『{input_text}』についてもっと教えてください。"
            romaji = f"Omoshiroi desu ne! '{input_text}' ni tsuite motto oshiete kudasai."
            english = f"That’s interesting! Please tell me more about '{input_text}'."
        else:
            response_text = f"なるほど！『{input_text}』について詳しく説明できますか？例えば、理由や背景など。"
            romaji = f"Naruhodo! '{input_text}' ni tsuite kuwashiku setsumei dekimasu ka? Tatoeba, riyuu ya haikei nado."
            english = f"I see! Can you explain more about '{input_text}'? For example, the reasons or background."

        # Save conversation log
        ConversationLog.objects.create(
            user=user,
            input_text=input_text,
            response_text=response_text,
            difficulty_level=difficulty
        )

        explanations, grammar_check = run_grammar_check(
         user=request.user,
         input_text=input_text,
         romaji_text=romaji,
        english_text=english
        )


        return Response({
            "learner_input": input_text,
            "ai_reply": {
                "script": response_text,
                "romaji": romaji,
                "english": english
            },
            "difficulty_level": difficulty
        })