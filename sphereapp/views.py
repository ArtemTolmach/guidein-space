from django.http import JsonResponse
from django.shortcuts import render
from .models import PhotoSphere, TeleportationPoint, InformationPoints
from django.views.decorators.csrf import csrf_exempt
import json


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
