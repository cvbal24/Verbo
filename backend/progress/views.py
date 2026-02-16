from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UserProgress, Achievement
from .serializers import UserProgressSerializer, AchievementSerializer

class UserProgressViewSet(viewsets.ModelViewSet):
    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return UserProgress.objects.filter(user=user)

    @action(detail=False, methods=["get"])
    def summary(self, request):
        """Return aggregated progress summary and award achievements if thresholds met."""
        user = request.user
        avg_score = UserProgress.average_score(user)
        mission_rate = UserProgress.mission_completion_rate(user)

        # --- Award achievements based on aggregates ---
        if avg_score >= 80:
            Achievement.objects.get_or_create(
                user=user,
                title="High Scorer",
                defaults={"description": "You maintained an average score above 80%!"}
            )

        completed_missions = UserProgress.objects.filter(user=user, mission__isnull=False, completed=True).count()
        if completed_missions >= 5:
            Achievement.objects.get_or_create(
                user=user,
                title="Mission Master",
                defaults={"description": "You completed 5 dialog missions!"}
            )

        return Response({
            "average_score": avg_score,
            "mission_completion_rate": mission_rate
        })

class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Achievement.objects.filter(user=user)