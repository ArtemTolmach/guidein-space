# Generated by Django 5.0 on 2024-01-13 11:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sphereapp', '0013_alter_informationpoints_photo_sphere_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photosphere',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
