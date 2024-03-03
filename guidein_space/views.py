from django.contrib.auth import login, logout
from django.db.models import F
from django.shortcuts import redirect
from django.views import View
from django.views.generic import FormView, ListView, TemplateView
from rest_framework import generics, permissions

from guidein_space import models, serializers
from guidein_space.forms import UserCreationForm


class RegisterView(FormView):
    template_name = 'registration/register.html'
    form_class = UserCreationForm

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('index')


class LogoutView(View):
    @staticmethod
    def post(request):
        logout(request)
        return redirect('index')


class IndexView(ListView):
    template_name = 'guidein_space/index.html'
    queryset = models.Project.objects.annotate(
        main_sphere__id=F('main_location__main_sphere__id'),
    )


class RenderPhotosphereView(TemplateView):
    template_name = 'guidein_space/interface.html'

    def dispatch(self, *args, **kwargs):
        if not models.Project.objects.filter(name=kwargs['project']).first():
            return redirect('index')

        return super().dispatch(self.request, *args, **kwargs)

    def get(self, *_args, **kwargs):
        location = models.Location.objects.filter(
            pk=kwargs.get('location_id'),
            project__name=kwargs.get('project'),
        ).first()
        photosphere = models.PhotoSphere.objects.filter(
            pk=kwargs.get('image_id'),
            location_id=kwargs.get('location_id'),
        ).first()

        if not location:
            project = (
                models.Project.objects.filter(
                    name=kwargs['project'],
                )
                .annotate(
                    main_sphere__id=F('main_location__main_sphere__id'),
                )
                .first()
            )

            kwargs['location_id'] = project.main_location_id
            kwargs['image_id'] = project.main_sphere__id

            return redirect('render-photosphere', **kwargs)

        if not photosphere:
            kwargs['image_id'] = location.main_sphere_id

            return redirect('render-photosphere', **kwargs)

        context = self.get_context_data(**kwargs)

        return self.render_to_response(context)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context.update(
            {
                'project': kwargs.get('project'),
                'location_id': kwargs.get('location_id'),
                'image_id': kwargs.get('image_id'),
                'is_superuser': str(self.request.user.is_superuser).lower(),
            },
        )

        return context


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
