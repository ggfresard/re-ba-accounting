from partners.models import Partner
from rest_framework import viewsets, permissions
from .serializers import ExpenseSerializer, PartnerSerializer


class PartnerViewSet(viewsets.ModelViewSet):

    serializer_class = PartnerSerializer

    def get_queryset(self):
        return self.request.user.partners.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        return self.request.user.expenses.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
