from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('superuser', 'Superuser'),
        ('regular', 'Regular User'),
    )
    role = models.CharField(
        max_length=20, choices=ROLE_CHOICES, default='regular', verbose_name='Роль',
    )


class PhotoSphere(models.Model):
    title = models.CharField(max_length=255, verbose_name='Название')
    image_path = models.ImageField(upload_to='images/', verbose_name='Путь к изображению')

    class Meta:
        verbose_name = 'Фотосфера'
        verbose_name_plural = 'Фотосферы'

    def __str__(self):
        return self.title


class TeleportationPoint(models.Model):
    photo_sphere = models.ForeignKey(
        PhotoSphere, on_delete=models.CASCADE, verbose_name='Фотосфера',
    )
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    target_photo_sphere = models.ForeignKey(
        PhotoSphere,
        related_name='target_teleportation_points',
        on_delete=models.CASCADE,
        verbose_name='Фотосфера для перемещения',
    )

    def __str__(self):
        return f'Точка перемещения #{self.id}'


class InformationPoints(models.Model):
    photo_sphere = models.ForeignKey(
        PhotoSphere, on_delete=models.CASCADE, verbose_name='Фотосфера',
    )
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    title = models.CharField(max_length=255, verbose_name='Название')
    description = models.CharField(max_length=255, verbose_name='Описание')

    class Meta:
        verbose_name = 'Точка информации'
        verbose_name_plural = 'Точки информации'

    def __str__(self):
        return f'Точка информации #{self.id}'
