from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.views import View
from django.shortcuts import render, redirect
from .models import PhotoSphere, TeleportationPoint, InformationPoints, StartPositionViewer
from .forms import UserCreationForm
import json


class Register(View):
    template_name = 'registration/register.html'

    def get(self, request):
        context = {
            'form': UserCreationForm()
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
            'form': form
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
    except Exception as e:
        user = {
            'id': None,
            'username': None,
            'email': None,
            'superuser': False,
        }
        return JsonResponse(user)


def index(request):
    return render(request, 'sphereapp/index.html')


def photospheres_api(request):
    photospheres = PhotoSphere.objects.all()
    data = []

    for photo in photospheres:
        teleportation_points = TeleportationPoint.objects.filter(photo_sphere=photo)
        teleportation_data = [{
            'x': point.x,
            'y': point.y,
            'z': point.z,
            'target_photo_sphere': point.target_photo_sphere.title
        } for point in teleportation_points]

        information_points = InformationPoints.objects.filter(photo_sphere=photo)
        information_data = [{
            'x': point.x,
            'y': point.y,
            'z': point.z,
            'title': point.title,
            'description': point.description
        } for point in information_points]

        data.append({
            'id': photo.id,
            'title': photo.title,
            'image_path': str(photo.image_path),
            'teleportation_points': teleportation_data,
            'information_points': information_data
        })

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
                        description=data['description']
                    )
                    return JsonResponse({'success': True})
                else:
                    return JsonResponse({'success': False, 'error': 'Invalid photo sphere ID'})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})


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
                return JsonResponse({'success': False, 'error': 'Invalid photo sphere ID'})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})


@csrf_exempt
def start_position_api(request):
    if request.method == 'GET':
        try:
            active_panorama_id = request.GET.get('photo_sphere')

            if active_panorama_id:
                photo_sphere = PhotoSphere.objects.get(id=active_panorama_id)
                start_position = StartPositionViewer.objects.filter(photo_sphere=photo_sphere).first()

                if start_position:
                    response_data = {
                        'success': True,
                        'start_position': {
                            'x': start_position.x,
                            'y': start_position.y,
                            'z': start_position.z,
                        }
                    }
                else:
                    response_data = {'success': False, 'error': 'Начальная позиция не найдена для указанной фотосферы.'}

                return JsonResponse(response_data)

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            active_panorama_id = data.get('photo_sphere')

            if active_panorama_id:
                photo_sphere = PhotoSphere.objects.get(id=active_panorama_id)

                if request.user.is_superuser:
                    StartPositionViewer.objects.create(
                        photo_sphere=photo_sphere,
                        x=data['x'],
                        y=data['y'],
                        z=data['z'],
                    )
                    return JsonResponse({'success': True})
                else:
                    return JsonResponse({'success': False, 'error': 'Неправильный АйДи фотосферы'})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    if request.method == 'DELETE':
        try:
            photo_sphere_id = request.GET.get('photo_sphere')

            if request.user.is_superuser:
                if photo_sphere_id:
                    StartPositionViewer.objects.filter(photo_sphere_id=photo_sphere_id).delete()
                    return JsonResponse({'success': True})
                else:
                    return JsonResponse({'success': False, 'error': 'Не указан photo_sphere в запросе'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})