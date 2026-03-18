from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import DialogMission, DialogNode, DialogChoice
from .serializers import DialogMissionSerializer, DialogNodeSerializer, DialogChoiceSerializer
from achievements.models import Achievement

class DialogMissionViewSet(viewsets.ModelViewSet):
    queryset = DialogMission.objects.all()
    serializer_class = DialogMissionSerializer
    permission_classes = [IsAuthenticated]

class DialogNodeViewSet(viewsets.ModelViewSet):
    queryset = DialogNode.objects.all()
    serializer_class = DialogNodeSerializer
    permission_classes = [IsAuthenticated]

class DialogChoiceViewSet(viewsets.ModelViewSet):
    queryset = DialogChoice.objects.all()
    serializer_class = DialogChoiceSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["post"])
    def select(self, request, pk=None):
        choice = self.get_object()
        feedback = choice.feedback or "No feedback available."
        next_node = choice.next_node

        # Record mission completion as a user achievement when there is no next node.
        if request.user.is_authenticated and next_node is None:
            Achievement.objects.get_or_create(
                user=request.user,
                category="milestone",
                title="Mission Completed",
                milestone=f"You finished {choice.node.mission.title}!",
                defaults={"metadata": {"mission_id": choice.node.mission_id}},
            )

        response_data = {
            "selected_choice": choice.choice_text,
            "feedback": feedback,
            "next_node": DialogNodeSerializer(next_node).data if next_node else None
        }
        return Response(response_data)
