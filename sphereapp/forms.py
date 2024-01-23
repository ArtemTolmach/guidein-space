from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm as DjangoUserCreationForm
from django.utils.translation import gettext_lazy as _

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
