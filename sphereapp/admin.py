from django.contrib import admin
from .models import PhotoSphere, TeleportationPoint


class TeleportationPointInline(admin.TabularInline):
    model = TeleportationPoint
    extra = 1
    fk_name = 'photo_sphere'


@admin.register(PhotoSphere)
class PhotoSphereAdmin(admin.ModelAdmin):
    inlines = [TeleportationPointInline]


@admin.register(TeleportationPoint)
class TeleportationPointAdmin(admin.ModelAdmin):
    pass
