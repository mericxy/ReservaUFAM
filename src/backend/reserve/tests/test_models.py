import pytest
from django.contrib.auth import get_user_model
from reserve.models import Auditorium, Reservation

User = get_user_model()

@pytest.fixture
def user(db):
    return User.objects.create_user(
        username="teste",
        email="teste@example.com",
        password="Senha123",
        privacy_consent=True,
        data_processing_consent=True,
        siape="1111111",
        cpf="11111111111",
    )

@pytest.fixture
def auditorium(db):
    return Auditorium.objects.create(name="Auditório Central", capacity=50)

@pytest.fixture
def reservation(db, user, auditorium):
    return Reservation.objects.create(
        user=user,
        auditorium=auditorium,
        initial_date="2025-11-03",
        final_date="2025-11-03",
        initial_time="09:00",
        final_time="10:00",
        description="Reunião de Teste"
    )


def test_reservation_str(reservation):
    assert str(reservation) == f"{reservation.auditorium.name} - {reservation.initial_date}"

def test_auditorium_str(auditorium):
    assert str(auditorium) == "Auditório Central"
