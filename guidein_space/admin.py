from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from guidein_space import forms, models

User = get_user_model()


class LocationInline(admin.TabularInline):
    model = models.Location
    extra = 1
    fk_name = 'project'


class PhotoSphereInline(admin.TabularInline):
    model = models.PhotoSphere
    extra = 1
    fk_name = 'location'


class MovePointInline(admin.TabularInline):
    model = models.MovePoint
    extra = 1
    fk_name = 'photo_sphere'


class InformationPointInline(admin.TabularInline):
    model = models.InformationPoint
    extra = 1
    fk_name = 'photo_sphere'


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    form = forms.ProjectForm
    inlines = (LocationInline,)


@admin.register(models.Location)
class LocationAdmin(admin.ModelAdmin):
    form = forms.LocationForm
    inlines = (PhotoSphereInline,)


@admin.register(models.PhotoSphere)
class PhotoSphereAdmin(admin.ModelAdmin):
    inlines = (MovePointInline, InformationPointInline)


@admin.register(models.MovePoint)
class MovePointAdmin(admin.ModelAdmin):
    pass


@admin.register(models.InformationPoint)
class InformationPointAdmin(admin.ModelAdmin):
    pass


@admin.register(User)
class UserAdmin(UserAdmin):
    pass
