from rest_framework import serializers

from guidein_space import models


class InformationPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.InformationPoint
        fields = serializers.ALL_FIELDS


class MovePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MovePoint
        fields = serializers.ALL_FIELDS


class PolygonPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PolygonPoint
        fields = serializers.ALL_FIELDS


class VideoPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.VideoPoint
        fields = serializers.ALL_FIELDS


class ImagePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ImagePoint
        fields = serializers.ALL_FIELDS


class PolyLinePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PolyLinePoint
        fields = serializers.ALL_FIELDS


class PhotoSphereSerializer(serializers.ModelSerializer):
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


class ProjectLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Location
        fields = ('name', 'id', 'main_sphere')


class AllProjectsList(serializers.ModelSerializer):
    main_location = ProjectLocationSerializer()

    class Meta:
        model = models.Project
        fields = serializers.ALL_FIELDS


class LocationPhotoSphereSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PhotoSphere
        fields = ('name', 'id')
