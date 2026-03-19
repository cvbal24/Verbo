from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Lesson, Word


class VocabularyBootstrapTests(APITestCase):
    def setUp(self):
        user_model = get_user_model()
        user = user_model.objects.create_user(
            username="vocab_user",
            password="testpass123",
        )
        self.client.force_authenticate(user=user)

    def test_lessons_endpoint_bootstraps_when_empty(self):
        self.assertEqual(Lesson.objects.count(), 0)
        self.assertEqual(Word.objects.count(), 0)

        response = self.client.get("/vocabulary/lessons/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 4)
        self.assertGreater(Word.objects.count(), 0)

    def test_words_endpoint_bootstraps_specific_language(self):
        self.assertEqual(Word.objects.count(), 0)

        response = self.client.get("/vocabulary/words/?language=Spanish")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        for item in response.data:
            self.assertEqual(item["lesson_language"].lower(), "spanish")

        self.assertTrue(Lesson.objects.filter(language__iexact="Spanish").exists())
        self.assertTrue(Word.objects.filter(lesson__language__iexact="Spanish").exists())

    def test_languages_endpoint_returns_available_packs(self):
        self.assertEqual(Word.objects.count(), 0)

        response = self.client.get("/vocabulary/languages/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 4)

        for row in response.data:
            self.assertIn("language", row)
            self.assertIn("lesson_count", row)
            self.assertIn("word_count", row)
            self.assertGreater(row["lesson_count"], 0)
            self.assertGreater(row["word_count"], 0)

        returned_languages = {row["language"].lower() for row in response.data}
        self.assertTrue({"japanese", "korean", "spanish", "chinese"}.issubset(returned_languages))
