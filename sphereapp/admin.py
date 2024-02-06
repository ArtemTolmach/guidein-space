from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from sphereapp import models

User = get_user_model()


class PhotoSphereInline(admin.TabularInline):
    model = models.PhotoSphere
    extra = 1
    fk_name = 'project'


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
