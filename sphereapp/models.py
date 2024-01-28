from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('superuser', 'Superuser'),
        ('regular', 'Regular User'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='regular')


class PhotoSphere(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    image_path = models.ImageField(upload_to='images/')

    def __str__(self):
        return self.title


class TeleportationPoint(models.Model):
    photo_sphere = models.ForeignKey(PhotoSphere, on_delete=models.CASCADE, default=1)
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    target_photo_sphere = models.ForeignKey(PhotoSphere, related_name='target_teleportation_points',
                                            on_delete=models.CASCADE)


class InformationPoints(models.Model):
    photo_sphere = models.ForeignKey(PhotoSphere, on_delete=models.CASCADE, default=1)
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)


class StartPositionViewer(models.Model):
    photo_sphere = models.ForeignKey(PhotoSphere, on_delete=models.CASCADE, default=1)
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()

    class Meta:
        verbose_name = 'Стартовая позиция'
        verbose_name_plural = 'Стартовые позиции'

    def __str__(self):
        return f'Стартовая позиция #{self.id}'
