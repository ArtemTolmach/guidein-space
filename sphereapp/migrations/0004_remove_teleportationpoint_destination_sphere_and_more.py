# Generated by Django 5.0 on 2023-12-27 13:09

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sphereapp', '0003_teleportationpoint'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='teleportationpoint',
            name='destination_sphere',
        ),
        migrations.AddField(
            model_name='teleportationpoint',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='teleportationpoint',
            name='photo_sphere',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='sphereapp.photosphere'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='teleportationpoint',
            name='target_photo_sphere',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='target_points', to='sphereapp.photosphere'),
        ),
    ]
