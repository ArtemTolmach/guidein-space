from typing import TYPE_CHECKING, Any

from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm as DjangoUserCreationForm
from django.utils.translation import gettext_lazy as _

from guidein_space import models

if TYPE_CHECKING:
    from typing import Self

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

    def __init__(self: 'Self', *args: 'Any', **kwargs: 'Any') -> None:
        super().__init__(*args, **kwargs)
        queryset = self.fields['main_location'].queryset
        if self.instance.pk:
            queryset = models.Location.objects.filter(
                project=self.instance,
            )
        else:
            queryset = queryset.none()

        self.fields['main_location'].queryset = queryset


class LocationForm(forms.ModelForm):
    class Meta:
        model = models.Location
        fields = forms.ALL_FIELDS

    def __init__(self: 'Self', *args: 'Any', **kwargs: 'Any') -> None:
        super().__init__(*args, **kwargs)
        queryset = self.fields['main_sphere'].queryset
        if self.instance.pk:
            queryset = models.PhotoSphere.objects.filter(
                location=self.instance,
            )
        else:
            queryset = queryset.none()

        self.fields['main_sphere'].queryset = queryset
