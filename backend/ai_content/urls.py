from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomContentLearnerViewSet

router = DefaultRouter()
router.register(r'customcontent', CustomContentLearnerViewSet, basename='customcontent')

analyze_custom_content = CustomContentLearnerViewSet.as_view({"post": "analyze"})

urlpatterns = [
    path('custom-content-learner/analyze/', analyze_custom_content, name='custom-content-analyze'),
    path('', include(router.urls)),
]