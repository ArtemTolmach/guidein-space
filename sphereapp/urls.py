from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

from sphereapp import views

urlpatterns = [
    path('', include('django.contrib.auth.urls')),
    path('', views.IndexView.as_view(), name='index'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path(
        '<str:project>/<int:location_id>/<int:image_id>/',
        views.RenderPhotosphereView.as_view(),
        name='render-photosphere',
    ),
    path(
        '<str:project>/<int:location_id>/',
        views.RenderPhotosphereView.as_view(),
        name='render-location-photosphere',
    ),
    path(
        '<str:project>/',
        views.RenderPhotosphereView.as_view(),
        name='render-project-photosphere',
    ),
    path(
        'api/photosphere/<int:pk>/',
        views.GetPhotosphereView.as_view(),
        name='get-photosphere',
    ),
    path(
        'api/locations/<str:project>/',
        views.GetProjectLocationsView.as_view(),
        name='get-project-locations',
    ),
    path(
        'api/photospheres/<int:location_id>/',
        views.GetLocationPhotospheresView.as_view(),
        name='get-location-photospheres',
    ),
    path(
        'api/photospheres/information-points/',
        views.CreateInformationPointView.as_view(),
        name='information-points-api',
    ),
    path(
        'api/photospheres/move-points/',
        views.CreateMovePointView.as_view(),
        name='move-points-api',
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
