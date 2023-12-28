from django.http import JsonResponse
from django.shortcuts import render
from .models import PhotoSphere, TeleportationPoint, InformationPoints


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
            'title': photo.title,
            'image_path': str(photo.image_path),
            'teleportation_points': teleportation_data,
            'information_points': information_data
        })

    return JsonResponse(data, safe=False)
