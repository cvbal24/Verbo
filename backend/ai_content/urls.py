from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomContentLearnerViewSet

router = DefaultRouter()
router.register(r'customcontent', CustomContentLearnerViewSet, basename='customcontent')

urlpatterns = [
    path('', include(router.urls)),
]