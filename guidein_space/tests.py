from django.test import Client, TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from guidein_space import serializers
from guidein_space.forms import LocationForm, ProjectForm, UserCreationForm
from guidein_space.models import InformationPoint, Location, PhotoSphere, Project, User


class TestForms(TestCase):
    def test_user_creation_form(self):
        form = UserCreationForm(
            data={
                'username': 'test',
                'email': 'test@example.com',
                'password1': 'complex_password123!',
                'password2': 'complex_password123!',
            },
        )
        self.assertTrue(form.is_valid())

    def test_project_form(self):
        form = ProjectForm(data={'name': 'Test Project', 'bio': 'This is a test project'})
        self.assertTrue(form.is_valid())

    def test_location_form(self):
        project = Project.objects.create(name='Test Project', bio='This is a test project')
        form = LocationForm(data={'name': 'Test Location', 'project': project})
        self.assertTrue(form.is_valid())


class TestViews(TestCase):
    def setUp(self):
        self.client = Client()
        self.project = Project.objects.create(name='Test Project', bio='This is a test project')
        self.location = Location.objects.create(name='Test Location', project=self.project)
        self.photosphere = PhotoSphere.objects.create(
            name='Test PhotoSphere',
            location=self.location,
        )

    def test_index_view(self):
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, 200)

    def test_register_view(self):
        response = self.client.post(
            reverse('register'),
            data={
                'username': 'test',
                'email': 'test@example.com',
                'password1': 'password',
                'password2': 'password',
            },
        )
        self.assertEqual(response.status_code, 200)

    def test_render_photosphere_view(self):
        response = self.client.get(
            reverse(
                'render-photosphere',
                args=[self.project.name, self.location.id, self.photosphere.id],
            ),
        )
        self.assertEqual(response.status_code, 200)


class TestAPIViews(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.project = Project.objects.create(name='Test Project', bio='This is a test project')
        self.location = Location.objects.create(name='Test Location', project=self.project)
        self.photosphere = PhotoSphere.objects.create(
            name='Test PhotoSphere',
            location=self.location,
        )
        self.location.main_sphere = self.photosphere
        self.location.save()

    def test_get_photosphere_view(self):
        response = self.client.get(f'/api/photosphere/{self.photosphere.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializers.PhotoSphereSerializer(self.photosphere).data)

    def test_get_project_locations_view(self):
        response = self.client.get(f'/api/locations/{self.project.name}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            serializers.ProjectLocationSerializer(
                Location.objects.filter(project=self.project),
                many=True,
            ).data,
        )

    def test_get_location_photospheres_view(self):
        response = self.client.get(f'/api/photospheres/{self.location.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            serializers.LocationPhotoSphereSerializer(
                PhotoSphere.objects.filter(location=self.location.id),
                many=True,
            ).data,
        )

    def test_create_information_point_view(self):
        user = User.objects.create_superuser(
            'admin',
            'admin@example.com',
            'password',
        )
        self.client.force_authenticate(user=user)

        data = {
            'photo_sphere': self.photosphere.id,
            'pitch': 0,
            'yaw': 0,
            'title': 'Test Information Point',
            'description': 'This is a test information point',
        }
        response = self.client.post('/api/photospheres/information-points/', data, format='json')
        information_point = InformationPoint.objects.filter(
            photo_sphere=self.photosphere.id,
        ).first()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data,
            serializers.InformationPointSerializer(information_point).data,
        )
