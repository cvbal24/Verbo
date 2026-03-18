from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import FlashcardReviewViewSet, FlashcardViewSet

router = DefaultRouter()
router.register(r"cards", FlashcardViewSet, basename="flashcard")
router.register(r"reviews", FlashcardReviewViewSet, basename="flashcard-review")

urlpatterns = [
    path("", include(router.urls)),
]