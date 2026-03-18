from django.db import models
from django.conf import settings

class UserPreference(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="preference", null=True, blank=True)
    learning_style = models.CharField(max_length=100, default="visual")
    difficulty = models.CharField(max_length=50, default="beginner")
    guided_prompts_enabled = models.BooleanField(default=True)
    step_by_step_enabled = models.BooleanField(default=True)
    current_path = models.CharField(max_length=150, blank=True, default="")
    current_step = models.IntegerField(default=1)
    navigation_progress = models.JSONField(default=dict, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.user)