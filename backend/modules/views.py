from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Module
from .serializers import ModuleSerializer, SavePathSerializer


class ModuleListView(generics.ListAPIView):
    queryset = Module.objects.all().order_by('id')
    serializer_class = ModuleSerializer


class SavePathView(APIView):
    def post(self, request):
        serializer = SavePathSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    'errors': serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                'message': 'Learning path saved successfully.',
                'selected_ids': serializer.validated_data['selected_ids']
            },
            status=status.HTTP_200_OK
        )

