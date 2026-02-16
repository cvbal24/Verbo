from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DialogMissionViewSet, DialogNodeViewSet, DialogChoiceViewSet

router = DefaultRouter()
router.register(r'missions', DialogMissionViewSet, basename='mission')
router.register(r'nodes', DialogNodeViewSet, basename='node')
router.register(r'choices', DialogChoiceViewSet, basename='choice')

urlpatterns = [
    path('', include(router.urls)),
]