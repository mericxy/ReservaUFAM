import hashlib
import secrets
from datetime import timedelta

import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils import timezone

from reserve.models import PasswordResetToken
from django.conf import settings

User = get_user_model()


def _create_user(**kwargs):
    defaults = {
        "username": "tester",
        "email": "tester@example.com",
        "password": "SenhaForte123!",
        "first_name": "Test",
        "last_name": "User",
        "siape": "7654321",
        "cpf": "12345678901",
        "privacy_consent": True,
        "data_processing_consent": True,
        "status": "Aprovado",
    }
    defaults.update(kwargs)
    return User.objects.create_user(**defaults)


@pytest.mark.django_db
def test_register_user_success(monkeypatch):
    """Deve registrar usuário com sucesso"""
    monkeypatch.setattr("reserve.services.EmailService.send_approval_email", lambda *a, **kw: True)

    client = APIClient()
    url = reverse("register")

    data = {
        "username": "evelim",
        "email": "evelim@example.com",
        "password": "SenhaForte123",
        "first_name": "Evelim",
        "last_name": "Rocha",
        "siape": "1234567",
        "cpf": "12345678900",
        "cellphone": "99999-9999",
        "privacy_consent": True,
        "data_processing_consent": True,
    }

    response = client.post(url, data, format="json")

    assert response.status_code == 201
    assert User.objects.filter(username="evelim").exists()


@pytest.mark.django_db
def test_password_reset_request_creates_token(monkeypatch):
    user = _create_user()
    email_payload = {}

    def fake_send(**kwargs):
        email_payload.update(kwargs)
        return True

    monkeypatch.setattr("reserve.services.EmailService.send_password_reset_email", fake_send)

    client = APIClient()
    url = reverse("password-reset-request")

    response = client.post(url, {"email": user.email}, format="json")

    assert response.status_code == 200
    assert "instruções" in response.data["detail"]
    assert PasswordResetToken.objects.filter(user=user).count() == 1
    assert email_payload.get("user_email") == user.email


@pytest.mark.django_db
def test_password_reset_confirm_updates_password():
    user = _create_user()
    raw_token = "token-secreto"
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    reset = PasswordResetToken.objects.create(
        user=user,
        token_hash=token_hash,
        requested_email=user.email,
        expires_at=timezone.now() + timedelta(minutes=settings.PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES),
    )

    client = APIClient()
    url = reverse("password-reset-confirm")
    payload = {
        "token": raw_token,
        "password": "NovaSenhaSegura123!",
        "password_confirmation": "NovaSenhaSegura123!",
    }

    response = client.post(url, payload, format="json")

    assert response.status_code == 200
    user.refresh_from_db()
    assert user.check_password("NovaSenhaSegura123!")
    reset.refresh_from_db()
    assert reset.used_at is not None


@pytest.mark.django_db
def test_password_reset_rate_limit(monkeypatch):
    user = _create_user()
    monkeypatch.setattr("reserve.services.EmailService.send_password_reset_email", lambda **kwargs: True)

    window_start = timezone.now()
    for _ in range(settings.PASSWORD_RESET_RATE_LIMIT):
        token = PasswordResetToken.objects.create(
            user=user,
            token_hash=hashlib.sha256(secrets.token_urlsafe(8).encode("utf-8")).hexdigest(),
            requested_email=user.email,
            expires_at=timezone.now() + timedelta(minutes=5),
        )
        PasswordResetToken.objects.filter(pk=token.pk).update(created_at=window_start)

    client = APIClient()
    url = reverse("password-reset-request")
    response = client.post(url, {"email": user.email}, format="json")

    assert response.status_code == 200
    assert PasswordResetToken.objects.filter(user=user).count() == settings.PASSWORD_RESET_RATE_LIMIT
