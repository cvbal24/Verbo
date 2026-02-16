from django.db import models
from django.conf import settings

class CustomContentAnalysis(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    input_text = models.TextField()
    generated_vocab = models.JSONField(default=list)   # personalized vocabulary
    grammar_feedback = models.JSONField(default=dict) # grammar explanations
    practice_materials = models.JSONField(default=list) # exercises, quizzes
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"CustomContentAnalysis by {self.user} at {self.created_at}"