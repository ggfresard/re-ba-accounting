from rest_framework import urlpatterns
from partners.serializers import PartnerSerializer
from rest_framework import routers
from .api import ExpenseViewSet, PartnerViewSet

router = routers.DefaultRouter()
router.register('partners', PartnerViewSet, 'partners')
router.register('expenses', ExpenseViewSet, 'expenses')

urlpatterns = router.urls
