from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from sphereapp.models import InformationPoints, PhotoSphere, TeleportationPoint

User = get_user_model()


class TeleportationPointInline(admin.TabularInline):
    model = TeleportationPoint
    extra = 1
    fk_name = 'photo_sphere'


class InformationPointsInline(admin.TabularInline):
    model = InformationPoints
    extra = 1
    fk_name = 'photo_sphere'


@admin.register(PhotoSphere)
class PhotoSphereAdmin(admin.ModelAdmin):
    inlines = (TeleportationPointInline, InformationPointsInline)


@admin.register(TeleportationPoint)
class TeleportationPointAdmin(admin.ModelAdmin):
    pass


@admin.register(InformationPoints)
class InformationPointsAdmin(admin.ModelAdmin):
    pass


@admin.register(User)
class UserAdmin(UserAdmin):
    pass
