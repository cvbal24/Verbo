from django.contrib import admin
from .models import Lesson, CompletedLesson, QuizResult, Vocabulary, UserVocabulary

admin.site.register(Lesson)
admin.site.register(CompletedLesson)
admin.site.register(QuizResult)
admin.site.register(Vocabulary)
admin.site.register(UserVocabulary)