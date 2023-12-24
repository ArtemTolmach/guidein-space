from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from .models import PhotoSphere
from django.conf import settings
import os
from django.core.serializers import serialize


def index(request):
    return render(request, 'sphereapp/index.html')


def photospheres_api(request):
    photospheres = PhotoSphere.objects.all()
    data = [{'image_path': str(photo.image_path), 'title': photo.title} for photo in photospheres]
    return JsonResponse(data, safe=False)
