from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from guidein_space import models, serializers
from guidein_space.serializers import UserSerializer


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class GetPhotosphereView(generics.RetrieveAPIView):
    queryset = models.PhotoSphere.objects.all()
    serializer_class = serializers.PhotoSphereSerializer


class GetProjectLocationsView(generics.ListAPIView):
    serializer_class = serializers.ProjectLocationSerializer
    lookup_field = 'project__name'
    lookup_url_kwarg = 'project'

    def get_queryset(self):
        return models.Location.objects.filter(
            project__name=self.kwargs.get('project'),
            main_sphere__isnull=False,
        )


class GetLocationPhotospheresView(generics.ListAPIView):
    serializer_class = serializers.LocationPhotoSphereSerializer
    lookup_field = 'location__id'
    lookup_url_kwarg = 'location'

    def get_queryset(self):
        return models.PhotoSphere.objects.filter(location__id=self.kwargs['location_id'])


class GetAllProjectsList(generics.ListAPIView):
    queryset = models.Project.objects.filter(
        main_location__isnull=False,
        main_location__main_sphere__isnull=False,
    )
    serializer_class = serializers.AllProjectsList


class CreateInformationPointView(generics.CreateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = models.InformationPoint.objects.all()
    serializer_class = serializers.InformationPointSerializer


class CreateMovePointView(generics.CreateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = models.MovePoint.objects.all()
    serializer_class = serializers.MovePointSerializer


class CreatePolygonPointView(generics.CreateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = models.PolygonPoint.objects.all()
    serializer_class = serializers.PolygonPointSerializer


class CreateVideoPointView(generics.CreateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = models.VideoPoint.objects.all()
    serializer_class = serializers.VideoPointSerializer


class CreateImagePointView(generics.CreateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = models.ImagePoint.objects.all()
    serializer_class = serializers.ImagePointSerializer


class CreatePolyLinePointView(generics.CreateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = models.PolyLinePoint.objects.all()
    serializer_class = serializers.PolyLinePointSerializer
