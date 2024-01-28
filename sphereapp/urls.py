from django.urls import path, include
from .views import index, photospheres_api, information_points_api, move_points_api, Register, Logout, current_user, start_position_api
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', index, name='index'),
    path('api/photospheres/', photospheres_api, name='photospheres_api'),
    path('api/photospheres/information-points/', information_points_api,
         name='information_points_api'),
    path('api/photospheres/move-points/', move_points_api,
         name='move_points_api'),
    path('api/photospheres/start-position/',
         start_position_api,
         name='start_position_api'
         ),
    path('', include('django.contrib.auth.urls')),
    path('register/', Register.as_view(), name='register'),
    path('logout/', Logout.as_view(), name='logout'),
    path('api/current-user/', current_user, name='current_user'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
