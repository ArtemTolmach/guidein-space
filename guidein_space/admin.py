from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from guidein_space import forms, models

User = get_user_model()


class LocationInline(admin.TabularInline[models.Location, models.Project]):
    model = models.Location
    form = forms.LocationForm
    extra = 1
    fk_name = 'project'


class PhotoSphereInline(admin.TabularInline[models.PhotoSphere, models.Location]):
    model = models.PhotoSphere
    extra = 1
    fk_name = 'location'


class MovePointInline(admin.TabularInline[models.MovePoint, models.PhotoSphere]):
    model = models.MovePoint
    extra = 1
    fk_name = 'photo_sphere'


class InformationPointInline(admin.TabularInline[models.InformationPoint, models.PhotoSphere]):
    model = models.InformationPoint
    extra = 1
    fk_name = 'photo_sphere'


class PolygonPointInline(admin.TabularInline[models.PolygonPoint, models.PhotoSphere]):
    model = models.PolygonPoint
    extra = 1
    fk_name = 'photo_sphere'


class VideoPointInline(admin.TabularInline[models.VideoPoint, models.PhotoSphere]):
    model = models.VideoPoint
    extra = 1
    fk_name = 'photo_sphere'


class ImagePointInline(admin.TabularInline[models.ImagePoint, models.PhotoSphere]):
    model = models.ImagePoint
    extra = 1
    fk_name = 'photo_sphere'


class PolyLineInline(admin.TabularInline[models.PolyLinePoint, models.PhotoSphere]):
    model = models.PolyLinePoint
    extra = 1
    fk_name = 'photo_sphere'


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin[models.Project]):
    form = forms.ProjectForm
    inlines = (LocationInline,)


@admin.register(models.Location)
class LocationAdmin(admin.ModelAdmin[models.Location]):
    form = forms.LocationForm
    inlines = (PhotoSphereInline,)


@admin.register(models.PhotoSphere)
class PhotoSphereAdmin(admin.ModelAdmin[models.PhotoSphere]):
    inlines = (
        MovePointInline,
        InformationPointInline,
        PolygonPointInline,
        VideoPointInline,
        ImagePointInline,
        PolyLineInline,
    )


@admin.register(models.MovePoint)
class MovePointAdmin(admin.ModelAdmin[models.MovePoint]):
    pass


@admin.register(models.InformationPoint)
class InformationPointAdmin(admin.ModelAdmin[models.InformationPoint]):
    pass


@admin.register(models.PolygonPoint)
class PolygonPointAdmin(admin.ModelAdmin[models.PolygonPoint]):
    pass


@admin.register(models.VideoPoint)
class VideoPointAdmin(admin.ModelAdmin[models.VideoPoint]):
    pass


@admin.register(models.PolyLinePoint)
class PolyLinePointAdmin(admin.ModelAdmin[models.PolyLinePoint]):
    pass


@admin.register(models.ImagePoint)
class ImagePointAdmin(admin.ModelAdmin[models.ImagePoint]):
    pass


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    pass
