from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CompletedLessonViewSet,
    LessonViewSet,
    ProgressSnapshotViewSet,
    QuizResultViewSet,
    UserVocabularyViewSet,
    VocabularyViewSet,
)

router = DefaultRouter()
router.register(r"lessons", LessonViewSet, basename="progress-lesson")
router.register(r"completed-lessons", CompletedLessonViewSet, basename="completed-lesson")
router.register(r"quiz-results", QuizResultViewSet, basename="quiz-result")
router.register(r"vocabulary", VocabularyViewSet, basename="progress-vocabulary")
router.register(r"user-vocabulary", UserVocabularyViewSet, basename="user-vocabulary")
router.register(r"snapshots", ProgressSnapshotViewSet, basename="progress-snapshot")

urlpatterns = [
    path("", include(router.urls)),
]