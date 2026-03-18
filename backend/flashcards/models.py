from django.db import models
from django.conf import settings
from datetime import timedelta
from django.utils import timezone


class Flashcard(models.Model):
    question = models.CharField(max_length=200)
    answer = models.CharField(max_length=200)
    language = models.CharField(max_length=50, default="english")
    lesson = models.ForeignKey("vocabulary.Lesson", on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.question


class FlashcardReview(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    flashcard = models.ForeignKey(Flashcard, on_delete=models.CASCADE)

    last_reviewed = models.DateTimeField(null=True, blank=True)
    next_review = models.DateTimeField(null=True, blank=True)

    interval = models.IntegerField(default=1)
    repetitions = models.IntegerField(default=0)
    ease_factor = models.FloatField(default=2.5)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "flashcard"], name="unique_user_flashcard_review"),
        ]

    def schedule_next(self, quality=3):
        quality = max(0, min(5, int(quality)))
        if quality < 3:
            self.repetitions = 0
            self.interval = 1
        else:
            self.repetitions += 1
            if self.repetitions == 1:
                self.interval = 1
            elif self.repetitions == 2:
                self.interval = 3
            else:
                self.interval = max(1, int(round(self.interval * self.ease_factor)))

        self.ease_factor = max(1.3, self.ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
        self.next_review = timezone.now() + timedelta(days=self.interval)
        self.last_reviewed = timezone.now()
        self.save()