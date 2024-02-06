from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm as DjangoUserCreationForm
from django.utils.translation import gettext_lazy as _

from sphereapp import models

User = get_user_model()


class UserCreationForm(DjangoUserCreationForm):
    email = forms.EmailField(
        label=_('Email'),
        max_length=254,
        widget=forms.EmailInput(attrs={'autocomplete': 'email'}),
    )

    class Meta(DjangoUserCreationForm.Meta):
        model = User
        fields = ('username', 'email')


class ProjectForm(forms.ModelForm):
    class Meta:
        model = models.Project
        fields = forms.ALL_FIELDS

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        queryset = self.fields['main_sphere'].queryset
        if self.instance.pk:
            queryset = models.PhotoSphere.objects.filter(
                project=self.instance,
            )
        else:
            queryset = queryset.none()

        self.fields['main_sphere'].queryset = queryset
