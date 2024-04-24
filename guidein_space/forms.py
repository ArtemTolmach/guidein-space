from typing import TYPE_CHECKING, Any

from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm as DjangoUserCreationForm
from django.utils.translation import gettext_lazy as _

from guidein_space import models

if TYPE_CHECKING:
    from typing import Self

User = get_user_model()


class UserCreationForm(DjangoUserCreationForm[models.User]):
    email = forms.EmailField(
        label=_('Email'),
        max_length=254,
        widget=forms.EmailInput(attrs={'autocomplete': 'email'}),
    )

    class Meta(DjangoUserCreationForm.Meta):
        model = User
        fields = ('username', 'email')


class ProjectForm(forms.ModelForm[models.Project]):
    class Meta:
        model = models.Project
        fields = ('name', 'bio', 'cover', 'main_location')

    def __init__(self: 'Self', *args: 'Any', **kwargs: 'Any') -> None:
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            self.fields['main_location'].widget.choices = [
                (location.pk, location.name)
                for location in models.Location.objects.filter(project=self.instance)
            ]
        else:
            self.fields['main_location'].widget.choices = []


class LocationForm(forms.ModelForm[models.Location]):
    class Meta:
        model = models.Location
        fields = ('name', 'project', 'main_sphere')

    def __init__(self: 'Self', *args: 'Any', **kwargs: 'Any') -> None:
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            self.fields['main_sphere'].widget.choices = [
                (sphere.pk, sphere.name)
                for sphere in models.PhotoSphere.objects.filter(location=self.instance)
            ]
        else:
            self.fields['main_sphere'].widget.choices = []
