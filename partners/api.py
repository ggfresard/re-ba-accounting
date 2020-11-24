from partners.models import Partner
from rest_framework import viewsets, permissions
from .serializers import PartnerSerializer


class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = PartnerSerializer
