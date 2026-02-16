from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProgressViewSet, AchievementViewSet

router = DefaultRouter()
router.register(r'progress', UserProgressViewSet, basename='progress')
router.register(r'achievements', AchievementViewSet, basename='achievement')


urlpatterns = [
    path('', include(router.urls)),
]