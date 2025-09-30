from django.test import TestCase
from django.db import connection
from django.contrib.auth import get_user_model
from datetime import date, time
from .models import Auditorium, Reservation

User = get_user_model()

class ReservationDatabaseTest(TestCase):
    def setUp(self):
        """Configuração inicial dos dados no banco"""
        self.user = User.objects.create_user(
            username="reservation_user",
            password="testpassword",
            siape="1234569",
            cpf="98765432100"
        )

        self.auditorium = Auditorium.objects.create(
            name="Auditório Principal",
            capacity=150,
            location="Bloco A"
        )

    def test_create_reservation(self):
        """Testa a criação e recuperação de uma reserva no banco PostgreSQL"""
        reservation = Reservation.objects.create(
            user=self.user,
            initial_date=date(2024, 6, 10),
            final_date=date(2024, 6, 11),
            initial_time=time(9, 0),
            final_time=time(11, 0),
            description="Palestra sobre tecnologia",
            status=Reservation.Status.CONFIRMED,
            auditorium=self.auditorium
        )

        reservation_from_db = Reservation.objects.get(id=reservation.id)

        self.assertEqual(reservation_from_db.user, self.user)
        self.assertEqual(reservation_from_db.auditorium, self.auditorium)
        self.assertEqual(reservation_from_db.initial_date, date(2024, 6, 10))
        self.assertEqual(reservation_from_db.final_date, date(2024, 6, 11))
        self.assertEqual(reservation_from_db.initial_time, time(9, 0))
        self.assertEqual(reservation_from_db.final_time, time(11, 0))
        self.assertEqual(reservation_from_db.description, "Palestra sobre tecnologia")
        self.assertEqual(reservation_from_db.status, Reservation.Status.CONFIRMED)
