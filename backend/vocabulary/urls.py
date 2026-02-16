from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, WordViewSet

router = DefaultRouter()
router.register(r"lessons", LessonViewSet, basename="lesson")
router.register(r"words", WordViewSet, basename="word")

urlpatterns = [
    path("", include(router.urls)),
]