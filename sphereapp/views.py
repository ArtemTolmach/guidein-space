from django.contrib.auth import authenticate, login, logout
from django.db.models import F
from django.shortcuts import redirect
from django.views import View
from django.views.generic import FormView, TemplateView
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


class IndexView(TemplateView):
    template_name = 'sphereapp/index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        projects = models.Project.objects.filter(
            photo_spheres__main_sphere=True,
        ).annotate(main_sphere_id=F('photo_spheres__id'))

        context.update({
            'projects': projects,
        })

        return context


class RenderPhotosphereView(TemplateView):
    template_name = 'sphereapp/interface.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            'project': kwargs['project'],
            'image_id': kwargs['image_id'],
            'is_superuser': str(self.request.user.is_superuser).lower(),
        })
        return context


class GetPhotosphereView(generics.RetrieveAPIView):
    queryset = models.PhotoSphere.objects.all()
    serializer_class = serializers.PhotoSphereSerializer


class GetProjectPhotospheresView(generics.ListAPIView):
    serializer_class = serializers.ProjectPhotoSphereSerializer
    lookup_field = 'project__name'
    lookup_url_kwarg = 'project'

    def get_queryset(self):
        return models.PhotoSphere.objects.filter(project__name=self.kwargs['project'])


class CreateInformationPointView(generics.CreateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = models.InformationPoints.objects.all()
    serializer_class = serializers.InformationPointSerializer


class CreateMovePointView(generics.CreateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = models.TeleportationPoint.objects.all()
    serializer_class = serializers.MovePointSerializer
