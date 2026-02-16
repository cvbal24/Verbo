from django.db import models
from django.contrib.auth.models import User
from vocabulary.models import Lesson
from dialog.models import DialogMission, DialogNode
from assessment.models import Assessment
from django.conf import settings

class UserProgress(models.Model):
    user = models.ForeignKey( settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, null=True, blank=True)
    mission = models.ForeignKey(DialogMission, on_delete=models.CASCADE, null=True, blank=True)
    current_node = models.ForeignKey(DialogNode, on_delete=models.SET_NULL, null=True, blank=True)
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, null=True, blank=True)
    completed = models.BooleanField(default=False)
    score = models.FloatField(default=0.0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} progress"

    # --- Aggregation Helpers ---
    @staticmethod
    def average_score(user):
        """Return average score across all assessments for a user."""
        progresses = UserProgress.objects.filter(user=user, assessment__isnull=False)
        if not progresses.exists():
            return 0.0
        return sum(p.score for p in progresses) / progresses.count()

    @staticmethod
    def mission_completion_rate(user):
        """Return percentage of missions completed by a user."""
        missions = UserProgress.objects.filter(user=user, mission__isnull=False)
        if not missions.exists():
            return 0.0
        completed = missions.filter(completed=True).count()
        return (completed / missions.count()) * 100


class Achievement(models.Model):
    user = models.ForeignKey( settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
)
    title = models.CharField(max_length=255)
    description = models.TextField()
    earned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"