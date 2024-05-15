import typing

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from guidein_space import models


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['is_superuser'] = user.is_superuser

        return token


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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs: typing.ClassVar[dict[str, dict[str, bool]]] = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
