from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from drf_spectacular import views as spectacular_views

from guidein_space import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('api/schema/', spectacular_views.SpectacularAPIView.as_view(), name='schema'),
    path(
        'api/schema/swagger-ui/',
        spectacular_views.SpectacularSwaggerView.as_view(url_name='schema'),
        name='swagger-ui',
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
    path(
        'api/photospheres/polygon-points/',
        views.CreatePolygonPointView.as_view(),
        name='polygon-points-api',
    ),
    path(
        'api/photospheres/video-points/',
        views.CreateVideoPointView.as_view(),
        name='video-points-api',
    ),
    path(
        'api/photospheres/image-points/',
        views.CreateImagePointView.as_view(),
        name='image-points-api',
    ),
    path(
        'api/photospheres/polyline-points/',
        views.CreatePolyLinePointView.as_view(),
        name='polyline-points-api',
    ),
    path(
        'api/photospheres/get-project-list/',
        views.GetAllProjectsList.as_view(),
        name='get-all-projects',
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
