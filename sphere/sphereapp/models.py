from django.db import models

class PhotoSphere(models.Model):
    title = models.CharField(max_length=255)
    image_path = models.ImageField(upload_to='images/')
