from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

from sphereapp import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<str:project>/<int:image_id>', views.render_photosphere, name='render-photosphere'),
    path(
        'api/photosphere/<str:project>/<int:image_id>',
        views.get_photosphere,
        name='get-photosphere',
    ),
    path(
        'api/photospheres/<str:project>',
        views.get_project_photospheres,
        name='get-project-photospheres',
    ),
    path(
        'api/dropdown-items/<str:project>/<int:image_id>',
        views.get_dropdown_items,
        name='dropdown-items',
    ),
    path(
        'api/photospheres/information-points/',
        views.information_points_api,
        name='information-points-api',
    ),
    path('api/photospheres/move-points/', views.move_points_api, name='move-points-api'),
    path('', include('django.contrib.auth.urls')),
    path('register/', views.Register.as_view(), name='register'),
    path('logout/', views.Logout.as_view(), name='logout'),
    path('api/current-user/', views.current_user, name='current-user'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
