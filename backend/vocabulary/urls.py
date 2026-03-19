from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AvailableLanguagePacksView, LessonViewSet, WordViewSet

router = DefaultRouter()
router.register(r"lessons", LessonViewSet, basename="lesson")
router.register(r"words", WordViewSet, basename="word")

urlpatterns = [
    path("languages/", AvailableLanguagePacksView.as_view(), name="vocabulary-languages"),
    path("", include(router.urls)),
]