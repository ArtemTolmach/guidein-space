from django.db import models


class PhotoSphere(models.Model):
    title = models.CharField(max_length=255)
    image_path = models.ImageField(upload_to='images/')

    def __str__(self):
        return self.title


class TeleportationPoint(models.Model):
    photo_sphere = models.ForeignKey(PhotoSphere, on_delete=models.CASCADE, default=13)
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    target_photo_sphere = models.ForeignKey(PhotoSphere, related_name='target_teleportation_points',
                                            on_delete=models.CASCADE)


class InformationPoints(models.Model):
    photo_sphere = models.ForeignKey(PhotoSphere, on_delete=models.CASCADE, default=13)
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
