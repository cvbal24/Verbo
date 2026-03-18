from django.db import models
from django.conf import settings

class PlacementTest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="placement_tests", null=True, blank=True)
    test_name = models.CharField(max_length=100, default="general")
    language = models.CharField(max_length=50, default="english")
    score = models.IntegerField()
    total = models.IntegerField(default=100)
    level = models.CharField(max_length=50)
    recommended_course = models.CharField(max_length=150, blank=True, default="")
    result_breakdown = models.JSONField(default=dict, blank=True)
    taken_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"{self.user} - {self.level}"