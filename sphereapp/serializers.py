from rest_framework import serializers

from sphereapp import models


class InformationPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.InformationPoint
        fields = serializers.ALL_FIELDS


class MovePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MovePoint
        fields = serializers.ALL_FIELDS


class PhotoSphereSerializer(serializers.ModelSerializer):
    move_points = MovePointSerializer(many=True)
    info_points = InformationPointSerializer(many=True)

    class Meta:
        model = models.PhotoSphere
        fields = ('image_path', 'info_points', 'move_points')


class ProjectPhotoSphereSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PhotoSphere
        fields = ('name', 'id')
