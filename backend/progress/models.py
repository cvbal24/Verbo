from django.db import models
from django.contrib.auth.models import User


class Lesson(models.Model):
    title = models.CharField(max_length=200)

    def __str__(self):
        return self.title


class CompletedLesson(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)


class QuizResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
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
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    vocab = models.ForeignKey(Vocabulary, on_delete=models.CASCADE)
    learned_at = models.DateTimeField(auto_now_add=True)