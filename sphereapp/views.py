import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from sphereapp.forms import UserCreationForm
from sphereapp.models import InformationPoints, PhotoSphere, Project, TeleportationPoint


class Register(View):
    template_name = 'registration/register.html'

    def get(self, request):
        context = {
            'form': UserCreationForm(),
        }
        return render(request, self.template_name, context)

    def post(self, request):
        form = UserCreationForm(request.POST)

        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect('index')
        context = {
            'form': form,
        }
        return render(request, self.template_name, context)


class Logout(View):
    def post(self, request):
        logout(request)
        return redirect('index')


def current_user(request):
    try:
        user = {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'superuser': request.user.is_superuser,
        }
        return JsonResponse(user)
    except AttributeError:
        user = {
            'id': None,
            'username': None,
            'email': None,
            'superuser': False,
        }
        return JsonResponse(user)


def index(request):
    projects = []
    for project in Project.objects.all():
        main_sphere = (
            PhotoSphere.objects.filter(project__name=project).exclude(main_sphere=False).first()
        )
        projects.append({'name': project.name, 'main_sphere_id': main_sphere.id})

    return render(
        request,
        'sphereapp/index.html',
        {
            'projects': projects,
        },
    )


def render_photosphere(request, project, image_id):
    return render(
        request,
        'sphereapp/interface.html',
        {
            'project': project,
            'image_id': image_id,
        },
    )


def get_dropdown_items(_request, project, image_id):
    dropdown_items = [
        {'id': photosphere.id, 'title': photosphere.title}
        for photosphere in PhotoSphere.objects.filter(project__name=project).exclude(id=image_id)
    ]
    return JsonResponse({'dropdown_items': dropdown_items}, safe=False)


def get_photosphere(_request, project, image_id):
    photosphere = PhotoSphere.objects.filter(project__name=project, id=image_id)[0]

    teleportation_points = TeleportationPoint.objects.filter(photo_sphere=photosphere)
    teleportation_data = [
        {
            'x': point.x,
            'y': point.y,
            'z': point.z,
            'target_photo_sphere': point.target_photo_sphere.id,
        }
        for point in teleportation_points
    ]

    information_points = InformationPoints.objects.filter(photo_sphere=photosphere)
    information_data = [
        {
            'x': point.x,
            'y': point.y,
            'z': point.z,
            'title': point.title,
            'description': point.description,
        }
        for point in information_points
    ]

    photosphere_data = {
        'id': photosphere.id,
        'title': photosphere.title,
        'image_path': str(photosphere.image_path),
        'teleportation_points': teleportation_data,
        'information_points': information_data,
    }

    return JsonResponse(photosphere_data, safe=False)


def get_project_photospheres(_request, project):
    photospheres = PhotoSphere.objects.filter(project__name=project)
    data = [{'id': photo.id, 'title': photo.title} for photo in photospheres]

    return JsonResponse(data, safe=False)


@csrf_exempt
def information_points_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            active_panorama_id = data.get('photo_sphere')

            if active_panorama_id:
                photo_sphere = PhotoSphere.objects.get(id=active_panorama_id)

                if request.user.is_superuser:
                    InformationPoints.objects.create(
                        photo_sphere=photo_sphere,
                        x=data['x'],
                        y=data['y'],
                        z=data['z'],
                        title=data['title'],
                        description=data['description'],
                    )
                    return JsonResponse({'success': True})

                return JsonResponse({'success': False, 'error': 'Неправильный ID фотосферы'})

        except AttributeError as exc:
            return JsonResponse({'success': False, 'error': str(exc)})
    return JsonResponse({'success': False, 'error': 'Неправильный метод запроса'})


@csrf_exempt
def move_points_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            active_panorama_id = data.get('photo_sphere')
            title = data.get('title')

            if active_panorama_id and title:
                photo_sphere = PhotoSphere.objects.get(id=active_panorama_id)

                target_photo_sphere = PhotoSphere.objects.get(title=title)
                if request.user.is_superuser:
                    TeleportationPoint.objects.create(
                        photo_sphere=photo_sphere,
                        x=data['x'],
                        y=data['y'],
                        z=data['z'],
                        target_photo_sphere=target_photo_sphere,
                    )
                    return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'error': 'Неправильный ID фотосферы'})

        except AttributeError as exc:
            return JsonResponse({'success': False, 'error': str(exc)})
    return JsonResponse({'success': False, 'error': 'Неправильный метод запроса'})
