from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.db import models

# Gerenciador de usuários personalizado
class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O email é obrigatório")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)

        if password:  # Só define a senha se ela for fornecida
            user.set_password(password)
        else:
            user.set_unusable_password()  # Define senha como inutilizável

        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        # Garante que siape e cpf tenham valores padrão para evitar erro
        extra_fields.setdefault('siape', f"ADM{self.model.objects.count() + 1}")
        extra_fields.setdefault('cpf', f"000000000{self.model.objects.count() + 1}"[-11:])

        return self.create_user(username, email, password, **extra_fields)

# Modelo CustomUser
class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Administrator"
        PROFESSOR = "PROFESSOR", "Professor"
        TECHNICIAN = "TECHNICIAN", "Technician"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.TECHNICIAN)
    siape = models.CharField(max_length=7, unique=True)
    cpf = models.CharField(max_length=11, unique=True)
    cellphone = models.CharField(max_length=15, null=True, blank=True)

    STATUS_CHOICES = [
        ('Pendente', 'Pending'),
        ('Aprovado', 'Approved'),
        ('Reprovado', 'Rejected'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pendente', blank=True)

    groups = models.ManyToManyField(Group, related_name='customuser_set', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='customuser_set', blank=True)

    objects = CustomUserManager()  # Define o gerenciador de usuários personalizado

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"

# Model for Auditoriums
class Auditorium(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Unique auditorium name
    capacity = models.IntegerField()  # Seating capacity
    location = models.CharField(max_length=255)  # Location description
    
    def __str__(self):
        return self.name
    
# Model for Meeting Rooms
class MeetingRoom(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Unique meeting room name
    capacity = models.IntegerField()  # Seating capacity
    location = models.CharField(max_length=255)  # Location description
    
    def __str__(self):
        return self.name
    
# Model for Vehicles
class Vehicle(models.Model):
    plate_number = models.CharField(max_length=10, unique=True)  # Unique vehicle plate number
    model = models.CharField(max_length=100)  # Vehicle model
    capacity = models.IntegerField()  # Passenger capacity
    
    def __str__(self):
        return f"{self.model} - {self.plate_number}"
    
# Model to store reservations
class Reservation(models.Model):
    class Status(models.TextChoices):
        PENDING = "Pendente", "Pending"
        CONFIRMED = "Confirmado", "Confirmed"
        CANCELED = "Cancelado", "Canceled"
    
    class ResourceType(models.TextChoices):
        AUDITORIUM = "auditorium", "Auditório"
        MEETING_ROOM = "meeting_room", "Sala de Reunião"
        VEHICLE = "vehicle", "Veículo"
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="reservations")
    initial_date = models.DateField()
    final_date = models.DateField()
    initial_time = models.TimeField()
    final_time = models.TimeField()
    description = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    is_deleted = models.BooleanField(default=False)
    
   # Novos campos para identificar o recurso
    resource_type = models.CharField(max_length=20, choices=ResourceType.choices, null=True)
    resource_id = models.IntegerField(null=True)
    
    # Mantemos as ForeignKeys para manter a integridade referencial
    auditorium = models.ForeignKey(Auditorium, on_delete=models.SET_NULL, null=True, blank=True)
    meeting_room = models.ForeignKey(MeetingRoom, on_delete=models.SET_NULL, null=True, blank=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        # Atualiza o resource_type e resource_id baseado nas ForeignKeys existentes
        if self.auditorium_id:
            self.resource_type = self.ResourceType.AUDITORIUM
            self.resource_id = self.auditorium_id
        elif self.meeting_room_id:
            self.resource_type = self.ResourceType.MEETING_ROOM
            self.resource_id = self.meeting_room_id
        elif self.vehicle_id:
            self.resource_type = self.ResourceType.VEHICLE
            self.resource_id = self.vehicle_id

        # Atualiza o campo apropriado baseado no resource_type e resource_id
        if self.resource_type and self.resource_id:
            if self.resource_type == self.ResourceType.AUDITORIUM:
                self.auditorium_id = self.resource_id
                self.meeting_room = None
                self.vehicle = None
            elif self.resource_type == self.ResourceType.MEETING_ROOM:
                self.meeting_room_id = self.resource_id
                self.auditorium = None
                self.vehicle = None
            elif self.resource_type == self.ResourceType.VEHICLE:
                self.vehicle_id = self.resource_id
                self.auditorium = None
                self.meeting_room = None
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Reservation by {self.user.get_full_name()} ({self.status})"
