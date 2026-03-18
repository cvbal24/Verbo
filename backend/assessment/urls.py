from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssessmentViewSet, QuestionViewSet, AnswerViewSet, UserResponseViewSet, AdaptiveAssessmentViewSet

router = DefaultRouter()
router.register(r"assessments", AssessmentViewSet)
router.register(r"questions", QuestionViewSet)
router.register(r"answers", AnswerViewSet)
router.register(r"user-responses", UserResponseViewSet, basename="user-response")
router.register(r'adaptive', AdaptiveAssessmentViewSet, basename="adaptive")


urlpatterns = [
    path("", include(router.urls)),
]