from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('superuser', 'Superuser'),
        ('regular', 'Regular User'),
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='regular',
        verbose_name='Роль',
    )


class Project(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    bio = models.CharField(max_length=1000, blank=True, default='', verbose_name='Био')

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'

    def __str__(self):
        return self.name


class PhotoSphere(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    image_path = models.ImageField(verbose_name='Путь к изображению')
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='photo_spheres',
        verbose_name='Проект',
    )
    main_sphere = models.BooleanField(default=False, verbose_name='Основная фотосфера')

    class Meta:
        verbose_name = 'Фотосфера'
        verbose_name_plural = 'Фотосферы'

    def __str__(self):
        return self.name


class MovePoint(models.Model):
    photo_sphere = models.ForeignKey(
        PhotoSphere,
        on_delete=models.CASCADE,
        related_name='move_points',
        verbose_name='Фотосфера',
    )
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    target_photo_sphere = models.ForeignKey(
        PhotoSphere,
        related_name='target_move_points',
        on_delete=models.CASCADE,
        verbose_name='Целевая фотосфера',
    )

    class Meta:
        verbose_name = 'Точка перемещения'
        verbose_name_plural = 'Точки перемещения'

    def __str__(self):
        return f'Точка перемещения #{self.id}'


class InformationPoint(models.Model):
    photo_sphere = models.ForeignKey(
        PhotoSphere,
        on_delete=models.CASCADE,
        related_name='info_points',
        verbose_name='Фотосфера',
    )
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    title = models.CharField(max_length=255, verbose_name='Заголовок')
    description = models.CharField(max_length=255, verbose_name='Описание')

    class Meta:
        verbose_name = 'Точка информации'
        verbose_name_plural = 'Точки информации'

    def __str__(self):
        return f'Точка информации #{self.id}'
