from django.db import models
from django.conf import settings

class ConversationLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    input_text = models.TextField()
    response_text = models.TextField()
    difficulty_level = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation by {self.user} at {self.created_at}"