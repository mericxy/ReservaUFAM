import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_register_user_success(monkeypatch):
    """Deve registrar usuário com sucesso"""
    # Mock do e-mail para evitar envio real
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
