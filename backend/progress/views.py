from django.http import JsonResponse
from .models import CompletedLesson, QuizResult

def progress_stats(request):
    lessons_completed = CompletedLesson.objects.count()
    quizzes_taken = QuizResult.objects.count()

    data = {
        "lessons_completed": lessons_completed,
        "quizzes_taken": quizzes_taken
    }

    return JsonResponse(data)