from django.http import JsonResponse
from .models import FlashcardReview
from django.utils import timezone

def review_list(request):
    reviews = FlashcardReview.objects.filter(next_review__lte=timezone.now())
    cards = []
    for r in reviews:
        cards.append({
            "id": r.flashcard.id,
            "question": r.flashcard.question,
            "answer": r.flashcard.answer,
            "next_review": r.next_review,
            "last_reviewed": r.last_reviewed,
        })

    return JsonResponse({"cards_due": cards})