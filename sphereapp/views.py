from django.http import JsonResponse
from django.shortcuts import render
from .models import PhotoSphere


def index(request):
    return render(request, 'sphereapp/index.html')


def photospheres_api(request):
    photospheres = PhotoSphere.objects.all()
    data = [{'image_path': str(photo.image_path), 'title': photo.title} for photo in photospheres]
    return JsonResponse(data, safe=False)
