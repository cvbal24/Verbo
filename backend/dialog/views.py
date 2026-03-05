from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import DialogMission, DialogNode, DialogChoice
from .serializers import DialogMissionSerializer, DialogNodeSerializer, DialogChoiceSerializer
from progress.models import UserProgress  
from progress.models import Achievement
from rest_framework.permissions import IsAuthenticated

class VocabularyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

class DialogMissionViewSet(viewsets.ModelViewSet):
    queryset = DialogMission.objects.all()
    serializer_class = DialogMissionSerializer

class DialogNodeViewSet(viewsets.ModelViewSet):
    queryset = DialogNode.objects.all()
    serializer_class = DialogNodeSerializer

class DialogChoiceViewSet(viewsets.ModelViewSet):
    queryset = DialogChoice.objects.all()
    serializer_class = DialogChoiceSerializer

    @action(detail=True, methods=["post"])
    def select(self, request, pk=None):
        choice = self.get_object()
        feedback = choice.feedback or "No feedback available."
        next_node = choice.next_node

        # Log progress
        user = request.user if request.user.is_authenticated else None
        if user and choice.node.mission:
            UserProgress.objects.update_or_create(
                user=user,
                mission=choice.node.mission,
                defaults={
                    "current_node": next_node,
                    "completed": next_node.is_end if next_node else False,
                    "score": 0.0
                }
            )
            if user and next_node and next_node.is_end:
                
                Achievement.objects.get_or_create(
                 user=user,
                 title="Mission Completed",
                 defaults={"description": f"You finished {choice.node.mission.title}!"}
              )

        response_data = {
            "selected_choice": choice.choice_text,
            "feedback": feedback,
            "next_node": DialogNodeSerializer(next_node).data if next_node else None
        }
        return Response(response_data)
