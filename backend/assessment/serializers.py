from rest_framework import serializers
from .models import Assessment, Question, Answer, UserResponse

# --- Answer ---
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = [
            "id",
            "text",
            "romaji_text",
            "english_text",
            "example_sentence_romaji",
            "example_sentence_english",
            "is_correct",
        ]

# --- Question ---
class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = [
            "id",
            "text",
            "romaji_text",
            "english_text",
            "example_sentence_romaji",
            "example_sentence_english",
            "question_type",
            "difficulty",
            "answers",
        ]

# --- Assessment ---
class AssessmentSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Assessment
        fields = [
            "id",
            "title",
            "description",
            "created_at",
            "lesson",      # will be nested in LessonSerializer
            "questions",
        ]

# --- UserResponse ---
class UserResponseSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)
    selected_answer = AnswerSerializer(read_only=True)
    user = serializers.StringRelatedField(read_only=True)  # shows username

    class Meta:
        model = UserResponse
        fields = [
            "id",
            "user",
            "question",
            "answer_text",
            "selected_answer",
            "score",
            "submitted_at",
        ]