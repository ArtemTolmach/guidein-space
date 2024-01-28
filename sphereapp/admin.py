from django.contrib import admin
from .models import PhotoSphere, TeleportationPoint, InformationPoints, StartPositionViewer
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

User = get_user_model()


class TeleportationPointInline(admin.TabularInline):
    model = TeleportationPoint
    extra = 1
    fk_name = 'photo_sphere'


class InformationPointsInline(admin.TabularInline):
    model = InformationPoints
    extra = 1
    fk_name = 'photo_sphere'


class StartPositionInline(admin.TabularInline):
    model = StartPositionViewer
    extra = 1
    fk_name = 'photo_sphere'


@admin.register(PhotoSphere)
class PhotoSphereAdmin(admin.ModelAdmin):
    inlines = [TeleportationPointInline, InformationPointsInline, StartPositionInline]


@admin.register(TeleportationPoint)
class TeleportationPointAdmin(admin.ModelAdmin):
    pass


@admin.register(InformationPoints)
class InformationPointsAdmin(admin.ModelAdmin):
    pass


@admin.register(StartPositionViewer)
class StartPositionAdmin(admin.ModelAdmin):
    pass


@admin.register(User)
class UserAdmin(UserAdmin):
    pass
