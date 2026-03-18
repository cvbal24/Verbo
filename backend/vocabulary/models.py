from django.db import models

class Lesson(models.Model):
    language = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return f"{self.title} ({self.language})"


class Word(models.Model):
    lesson = models.ForeignKey("Lesson", on_delete=models.CASCADE, related_name="words")
    script = models.CharField(max_length=100)
    romaji = models.CharField(max_length=100, blank=True, default="")
    english = models.CharField(max_length=100, default="")
    audio_url = models.URLField(blank=True, default="")
    difficulty = models.IntegerField(default=1)
    tags = models.CharField(max_length=255, blank=True, default="")
    mastery_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.script} ({self.english})"