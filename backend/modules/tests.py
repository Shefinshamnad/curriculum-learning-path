from django.test import TestCase
from rest_framework.test import APIClient

from .models import Module


class SavePathAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.basics = Module.objects.create(
            title="Web Development Basics",
            description="Learn web development fundamentals.",
            tier="Beginner",
        )

        self.advanced_js = Module.objects.create(
            title="Advanced JavaScript",
            description="Learn advanced JavaScript.",
            tier="Advanced",
            prerequisite=self.basics,
        )

    def test_save_path_rejects_missing_prerequisite(self):
        response = self.client.post(
            "/api/save-path/",
            {"selected_ids": [self.advanced_js.id]},
            format="json",
        )

        self.assertEqual(response.status_code, 400)

    def test_save_path_accepts_valid_path(self):
        response = self.client.post(
            "/api/save-path/",
            {"selected_ids": [self.basics.id, self.advanced_js.id]},
            format="json",
        )

        self.assertEqual(response.status_code, 200)

