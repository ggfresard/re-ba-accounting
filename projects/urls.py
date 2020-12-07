from rest_framework import routers
from .api import FlowViewSet, ProjectViewSet, FlowConfirmViewSet

router = routers.DefaultRouter()
router.register('projects', ProjectViewSet, 'projects')
router.register('flows/confirm', FlowConfirmViewSet, 'flows.confirm')
router.register('flows', FlowViewSet, 'flows')

urlpatterns = router.urls
