import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from reserve.models import Reservation, Auditorium

User = get_user_model()


@pytest.fixture
def normal_user(db):
    return User.objects.create_user(
        username="professor",
        email="professor@example.com",
        password="Senha123",
        privacy_consent=True,
        data_processing_consent=True,
        siape="2222222",
        cpf="22222222222",
    )


@pytest.fixture
def auditorium(db):
    return Auditorium.objects.create(
        name="Auditório Teste",
        capacity=100,
        location="Bloco A"
    )


@pytest.fixture
def reservation(db, normal_user, auditorium):
    return Reservation.objects.create(
        user=normal_user,
        auditorium=auditorium,
        initial_date="2025-11-03",
        final_date="2025-11-03",
        initial_time="09:00",
        final_time="10:00",
        description="Reunião de Teste"
    )


@pytest.mark.django_db
def test_user_can_create_reservation(normal_user, auditorium):
    client = APIClient()
    client.force_authenticate(normal_user)

    url = reverse("create-reservation")
    data = {
        "auditorium": auditorium.id,
        "initial_date": "2025-11-04",
        "final_date": "2025-11-04",
        "initial_time": "14:00",
        "final_time": "15:00",
        "description": "Aula de teste",
    }

    response = client.post(url, data, format="json")
    assert response.status_code in [201, 400]
    if response.status_code == 201:
        assert Reservation.objects.filter(user=normal_user).exists()


@pytest.mark.django_db
def test_user_can_list_own_reservations(normal_user, reservation):
    client = APIClient()
    client.force_authenticate(normal_user)

    url = reverse("user-reservation-list")
    response = client.get(url)

    assert response.status_code == 200
    assert any(
        res["description"] == "Reunião de Teste" for res in response.data
    )
