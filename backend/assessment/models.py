from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class Assessment(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title


class Question(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()
    romaji_text = models.TextField(blank=True, null=True)
    english_text = models.TextField(blank=True, null=True)
    difficulty = models.IntegerField(default=1)

    def __str__(self):
        return f"Q{self.id} - {self.text}"


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    text = models.TextField()
    romaji_text = models.TextField(blank=True, null=True)
    english_text = models.TextField(blank=True, null=True)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Answer {self.id} to Q{self.question.id}"


class UserResponse(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.ForeignKey(Answer, on_delete=models.SET_NULL, null=True, blank=True)
    answer_text = models.TextField(blank=True, null=True)
    score = models.IntegerField(default=0)
    feedback = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response by {self.user.username} to Q{self.question.id}"