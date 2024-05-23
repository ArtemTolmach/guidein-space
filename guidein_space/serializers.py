from rest_framework import serializers

from guidein_space import models


class InformationPointSerializer(serializers.ModelSerializer[models.InformationPoint]):
    class Meta:
        model = models.InformationPoint
        fields = serializers.ALL_FIELDS


class MovePointSerializer(serializers.ModelSerializer[models.MovePoint]):
    class Meta:
        model = models.MovePoint
        fields = serializers.ALL_FIELDS


class PolygonPointSerializer(serializers.ModelSerializer[models.PolygonPoint]):
    class Meta:
        model = models.PolygonPoint
        fields = serializers.ALL_FIELDS


class VideoPointSerializer(serializers.ModelSerializer[models.VideoPoint]):
    class Meta:
        model = models.VideoPoint
        fields = serializers.ALL_FIELDS


class ImagePointSerializer(serializers.ModelSerializer[models.ImagePoint]):
    class Meta:
        model = models.ImagePoint
        fields = serializers.ALL_FIELDS


class PolyLinePointSerializer(serializers.ModelSerializer[models.PolyLinePoint]):
    class Meta:
        model = models.PolyLinePoint
        fields = serializers.ALL_FIELDS


class PhotoSphereSerializer(serializers.ModelSerializer[models.PhotoSphere]):
    move_points = MovePointSerializer(many=True)
    info_points = InformationPointSerializer(many=True)
    polygon_points = PolygonPointSerializer(many=True)
    video_points = VideoPointSerializer(many=True)
    image_points = ImagePointSerializer(many=True)
    polyline_points = PolyLinePointSerializer(many=True)

    class Meta:
        model = models.PhotoSphere
        fields = (
            'image_path',
            'info_points',
            'move_points',
            'polygon_points',
            'video_points',
            'image_points',
            'polyline_points',
        )


class ProjectLocationSerializer(serializers.ModelSerializer[models.Location]):
    class Meta:
        model = models.Location
        fields = ('name', 'id', 'main_sphere')


class LocationPhotoSphereSerializer(serializers.ModelSerializer[models.PhotoSphere]):
    class Meta:
        model = models.PhotoSphere
        fields = ('name', 'id')
