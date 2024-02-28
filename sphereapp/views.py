from django.contrib.auth import authenticate, login, logout
from django.db.models import F
from django.shortcuts import redirect
from django.views import View
from django.views.generic import FormView, ListView, TemplateView
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from sphereapp import models, serializers
from sphereapp.forms import UserCreationForm


class RegisterView(FormView):
    template_name = 'registration/register.html'
    form_class = UserCreationForm

    def form_valid(self, form):
        form.save()
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')
        user = authenticate(username=username, password=password)
        login(self.request, user)
        return redirect('index')


class LogoutView(View):
    @staticmethod
    def post(request):
        logout(request)
        return redirect('index')


class CurrentUserView(APIView):
    @staticmethod
    def get(request):
        return Response({'is_superuser': request.user.is_superuser})


class IndexView(ListView):
    template_name = 'sphereapp/index.html'
    queryset = models.Project.objects.values('name', 'main_location__id').annotate(
        main_sphere__id=F('main_location__main_sphere__id'),
    )


class RenderPhotosphereView(TemplateView):
    template_name = 'sphereapp/interface.html'

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
        return models.Location.objects.filter(project__name=self.kwargs['project'])


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
