# Generated by Django 5.0 on 2024-01-30 14:37

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sphereapp', '0005_alter_teleportationpoint_options_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Название')),
                ('bio', models.CharField(blank=True, default='', max_length=1000, verbose_name='Био')),
            ],
            options={
                'verbose_name': 'Проект',
                'verbose_name_plural': 'Проекты',
            },
        ),
        migrations.AddField(
            model_name='photosphere',
            name='main_sphere',
            field=models.BooleanField(default=False, verbose_name='Основная сфера'),
        ),
        migrations.AlterField(
            model_name='photosphere',
            name='image_path',
            field=models.ImageField(upload_to='', verbose_name='Путь к изображению'),
        ),
        migrations.AddField(
            model_name='photosphere',
            name='project',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='photo_spheres', to='sphereapp.project', verbose_name='Проект'),
            preserve_default=False,
        ),
    ]
