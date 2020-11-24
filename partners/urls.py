from rest_framework import urlpatterns
from partners.serializers import PartnerSerializer
from rest_framework import routers
from .api import PartnerViewSet

router = routers.DefaultRouter()
router.register('api/partners', PartnerViewSet, 'partners')

urlpatterns = router.urls
