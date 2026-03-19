from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import CustomContentAnalysis


class CustomContentLearnerEndpointTests(APITestCase):
    endpoint = "/ai-content/custom-content-learner/analyze/"

    def setUp(self):
        self.user_model = get_user_model()

    def test_non_premium_user_is_forbidden(self):
        user = self.user_model.objects.create_user(
            username="free_user",
            password="testpass123",
        )
        user.is_premium = False
        self.client.force_authenticate(user=user)

        response = self.client.post(self.endpoint, {"input_text": "I like reading novels."}, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_premium_user_requires_input_text(self):
        user = self.user_model.objects.create_user(
            username="premium_missing",
            password="testpass123",
        )
        user.is_premium = True
        self.client.force_authenticate(user=user)

        response = self.client.post(self.endpoint, {"input_text": "  "}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_premium_user_gets_personalized_analysis(self):
        user = self.user_model.objects.create_user(
            username="premium_user",
            password="testpass123",
        )
        user.is_premium = True
        self.client.force_authenticate(user=user)

        payload = {
            "input_text": "I read books every weekend. Reading books helps me relax and learn new ideas.",
        }

        response = self.client.post(self.endpoint, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("generated_vocab", response.data)
        self.assertIn("grammar_feedback", response.data)
        self.assertIn("practice_materials", response.data)
        self.assertIn("learner_profile", response.data)
        self.assertIn("generation_source", response.data)
        self.assertGreaterEqual(len(response.data["generated_vocab"]), 1)
        self.assertGreaterEqual(len(response.data["practice_materials"]), 1)
        self.assertIn(response.data["generation_source"], ["llm", "local-fallback"])

        saved = CustomContentAnalysis.objects.get(id=response.data["id"])
        self.assertEqual(saved.user_id, user.id)
        self.assertEqual(saved.input_text, payload["input_text"])

    def test_invalid_difficulty_level_returns_400(self):
        user = self.user_model.objects.create_user(
            username="premium_invalid_difficulty",
            password="testpass123",
        )
        user.is_premium = True
        self.client.force_authenticate(user=user)

        response = self.client.post(
            self.endpoint,
            {
                "input_text": "I study every day.",
                "difficulty_level": "advanced",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
