from django.urls import path
from .views import index
from .views import photospheres_api, information_points_api, move_points_api

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', index, name='index'),
    path('api/photospheres/', photospheres_api, name='photospheres_api'),
    path('api/photospheres/information-points/', information_points_api,
         name='information_points_api'),
    path('api/photospheres/move-points/', move_points_api,
         name='move_points_api'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
