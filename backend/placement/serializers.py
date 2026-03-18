from rest_framework import serializers

from .models import PlacementTest


class PlacementTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementTest
        fields = [
            "id",
            "user",
            "test_name",
            "language",
            "score",
            "total",
            "level",
            "recommended_course",
            "result_breakdown",
            "taken_at",
        ]
        read_only_fields = ["user", "taken_at"]
