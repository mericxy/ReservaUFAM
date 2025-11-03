import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from reserve.models import Auditorium

User = get_user_model()

@pytest.fixture
def admin_user(db):
    return User.objects.create_superuser(
        username="admin",
        email="admin@example.com",
        password="Admin123",
        siape="000001",
        cpf="00000000001",
    )

@pytest.mark.django_db
def test_admin_can_create_auditorium(admin_user):
    client = APIClient()
    client.force_authenticate(admin_user)

    url = reverse("auditorium-admin")
    payload = {"name": "Auditório Central", "capacity": 150, "location": "Bloco 1"}

    response = client.post(url, payload, format="json")

    assert response.status_code == 201
    assert Auditorium.objects.filter(name="Auditório Central").exists()


@pytest.mark.django_db
def test_list_auditoriums_authenticated(admin_user):
    Auditorium.objects.create(name="Auditório B", capacity=80, location="Bloco 2")

    client = APIClient()
    client.force_authenticate(admin_user)

    url = reverse("auditorium-admin")
    response = client.get(url)

    assert response.status_code == 200
    assert len(response.data) > 0
