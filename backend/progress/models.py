from django.db import models
from django.conf import settings


class Lesson(models.Model):
    title = models.CharField(max_length=200)
    language = models.CharField(max_length=50, default="english")

    def __str__(self):
        return self.title


class CompletedLesson(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "lesson"], name="unique_completed_lesson_per_user"),
        ]


class QuizResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    score = models.IntegerField()
    total = models.IntegerField()
    taken_at = models.DateTimeField(auto_now_add=True)


class Vocabulary(models.Model):
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=200)

    def __str__(self):
        return self.word


class UserVocabulary(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    vocab = models.ForeignKey(Vocabulary, on_delete=models.CASCADE)
    learned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "vocab"], name="unique_user_vocab"),
        ]


class ProgressSnapshot(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lessons_completed = models.IntegerField(default=0)
    quizzes_taken = models.IntegerField(default=0)
    average_quiz_score = models.FloatField(default=0.0)
    vocabulary_learned = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]