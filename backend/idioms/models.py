from django.db import models

class Idiom(models.Model):
    phrase = models.CharField(max_length=200)
    meaning = models.TextField()
    example = models.TextField()
    source_language = models.CharField(max_length=50, default="english")
    target_language = models.CharField(max_length=50, default="english")
    lesson = models.ForeignKey("vocabulary.Lesson", on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.phrase