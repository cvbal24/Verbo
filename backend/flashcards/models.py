from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta
from django.utils import timezone


class Flashcard(models.Model):
    question = models.CharField(max_length=200)
    answer = models.CharField(max_length=200)

    def __str__(self):
        return self.question


class FlashcardReview(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    flashcard = models.ForeignKey(Flashcard, on_delete=models.CASCADE)

    last_reviewed = models.DateTimeField(null=True, blank=True)
    next_review = models.DateTimeField(null=True, blank=True)

    interval = models.IntegerField(default=1)

    def schedule_next(self):
        self.interval *= 2
        self.next_review = timezone.now() + timedelta(days=self.interval)
        self.last_reviewed = timezone.now()
        self.save()