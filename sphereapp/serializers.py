from rest_framework import serializers

from sphereapp.models import InformationPoints, PhotoSphere, TeleportationPoint


class InformationPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = InformationPoints
        fields = serializers.ALL_FIELDS


class MovePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeleportationPoint
        fields = serializers.ALL_FIELDS


class PhotoSphereSerializer(serializers.ModelSerializer):
    move_points = MovePointSerializer(many=True)
    info_points = InformationPointSerializer(many=True)

    class Meta:
        model = PhotoSphere
        fields = ('image_path', 'info_points', 'move_points')


class ProjectPhotoSphereSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhotoSphere
        fields = ('title', 'id')
