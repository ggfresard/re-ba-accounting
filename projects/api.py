
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from projects.models import Flow
from rest_framework import viewsets
from .serializers import FlowConfirmSerializer, FlowSerializer, ProjectSerializer, serializers


class ProjectViewSet(viewsets.ModelViewSet):

    serializer_class = ProjectSerializer

    def get_queryset(self):
        return self.request.user.projects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FlowViewSet(viewsets.ModelViewSet):
    serializer_class = FlowSerializer

    def get_queryset(self):
        queryset = Flow.objects.filter(project__owner=self.request.user)
        return queryset


class FlowConfirmViewSet(viewsets.ViewSet):
    serializer_class = FlowConfirmSerializer

    def get_queryset(self, *args, **kwargs):
        queryset = Flow.objects.filter(project__owner=self.request.user)
        return queryset

    def update(self, request, pk=None, *args, **kwargs):
        qs = self.get_queryset(self)
        flow = get_object_or_404(qs, pk=pk)
        if flow.confirmed or flow.amount >= 0:
            return Response('Flow already confirmed or doesn-t need confirmation', 400)
        serializer = FlowConfirmSerializer(flow, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({}, status=202)
        return Response(serializer.error_messages, status=400)
