import uuid

from colorfield.fields import ColorField  # type: ignore[import-untyped]
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
    cover = models.ImageField(
        upload_to='covers/',
        default='covers/default_cover.png',
        verbose_name='Обложка',
    )
    main_location = models.ForeignKey(
        'Location',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='project_main_location',
        verbose_name='Основная локация',
    )

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'

    def __str__(self):
        return self.name


class Location(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='photo_spheres',
        verbose_name='Проект',
    )
    main_sphere = models.ForeignKey(
        'PhotoSphere',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='location_main_sphere',
        verbose_name='Основная фотосфера',
    )

    class Meta:
        verbose_name = 'Локация'
        verbose_name_plural = 'Локации'

    def __str__(self):
        return self.name


class PhotoSphere(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название')
    image_path = models.ImageField(verbose_name='Путь к изображению')
    location = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name='photo_spheres',
        verbose_name='Локация',
    )

    class Meta:
        verbose_name = 'Фотосфера'
        verbose_name_plural = 'Фотосферы'

    def __str__(self):
        return self.name


class MovePoint(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    photo_sphere = models.ForeignKey(
        PhotoSphere,
        on_delete=models.CASCADE,
        related_name='move_points',
        verbose_name='Фотосфера',
    )
    pitch = models.FloatField(verbose_name='Долгота')
    yaw = models.FloatField(verbose_name='Широта')
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
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    photo_sphere = models.ForeignKey(
        PhotoSphere,
        on_delete=models.CASCADE,
        related_name='info_points',
        verbose_name='Фотосфера',
    )
    pitch = models.FloatField(verbose_name='Долгота')
    yaw = models.FloatField(verbose_name='Широта')
    title = models.CharField(max_length=255, verbose_name='Заголовок', blank=True)
    description = models.CharField(max_length=255, verbose_name='Описание', blank=True)

    class Meta:
        verbose_name = 'Точка информации'
        verbose_name_plural = 'Точки информации'

    def __str__(self):
        return f'Точка информации #{self.id}'


class PolygonPoint(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    photo_sphere = models.ForeignKey(
        PhotoSphere,
        on_delete=models.CASCADE,
        related_name='polygon_points',
        verbose_name='Фотосфера',
    )
    coordinates = models.JSONField(
        blank=True,
        default=list,
        verbose_name='Координаты точек полигона',
    )
    opacity = models.CharField(max_length=20, default='1', verbose_name='Прозрачность полигона')
    fill = ColorField(format='rgba', verbose_name='Цвет заливки')
    stroke = ColorField(format='rgba', verbose_name='Цвет границы')
    stroke_width = models.IntegerField(blank=True, default=1, verbose_name='Ширина границы')
    title = models.CharField(max_length=255, blank=True, verbose_name='Заголовок')
    description = models.CharField(max_length=255, blank=True, verbose_name='Описание')

    class Meta:
        verbose_name = 'Полигон'
        verbose_name_plural = 'Полигоны'

    def __str__(self):
        return f'Полигон #{self.id}'


class VideoPoint(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    video = models.FileField(upload_to='videos/', verbose_name='Видео')
    photo_sphere = models.ForeignKey(
        PhotoSphere,
        on_delete=models.CASCADE,
        related_name='video_points',
        verbose_name='Фотосфера',
    )
    coordinates = models.JSONField(verbose_name='Координаты точек видео')
    enable_chroma_key = models.BooleanField(default=False, verbose_name='Хромакей')
    color_chroma_key = models.CharField(
        max_length=35,
        default='rgba(4, 244, 5, 1);',
        verbose_name='Цвет хромакея',
    )

    class Meta:
        verbose_name = 'Видео'
        verbose_name_plural = 'Видео'

    def __str__(self):
        return f'Видео #{self.id}'


class ImagePoint(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ImageField(upload_to='images/', verbose_name='Изображение')
    photo_sphere = models.ForeignKey(
        PhotoSphere,
        on_delete=models.CASCADE,
        related_name='image_points',
        verbose_name='Фотосфера',
    )
    coordinates = models.JSONField(verbose_name='Координаты точек изображения')

    class Meta:
        verbose_name = 'Изображение'
        verbose_name_plural = 'Изображения'

    def __str__(self):
        return f'Изображение #{self.id}'


class PolyLinePoint(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    photo_sphere = models.ForeignKey(
        PhotoSphere,
        on_delete=models.CASCADE,
        related_name='polyline_points',
        verbose_name='Фотосфера',
    )
    coordinates = models.JSONField(blank=True, default=list, verbose_name='Координаты точек линии')

    title = models.CharField(max_length=255, blank=True, verbose_name='Заголовок')
    description = models.CharField(max_length=255, blank=True, verbose_name='Описание')
    stroke = ColorField(format='rgba', verbose_name='Цвет линии')
    stroke_width = models.CharField(
        max_length=20,
        blank=True,
        default=1,
        verbose_name='Ширина линии',
    )
    stroke_linecap = models.CharField(
        max_length=20,
        blank=True,
        verbose_name='Cтиль концов линии',
    )
    stroke_linejoin = models.CharField(
        max_length=20,
        blank=True,
        verbose_name='Стиль соединения углов линии',
    )

    class Meta:
        verbose_name = 'Линия'
        verbose_name_plural = 'Линии'

    def __str__(self):
        return f'Линия #{self.id}'
