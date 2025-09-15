from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O email é obrigatório")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("status", "Aprovado")

        extra_fields.setdefault('siape', f"ADM{self.model.objects.count() + 1}")
        extra_fields.setdefault('cpf', f"000000000{self.model.objects.count() + 1}"[-11:])

        return self.create_user(username, email, password, **extra_fields)

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
        ('Bloqueado', 'Blocked'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pendente', blank=True)

    groups = models.ManyToManyField(Group, related_name='customuser_set', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='customuser_set', blank=True)

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"

class Auditorium(models.Model):
    name = models.CharField(max_length=100, unique=True)  
    capacity = models.IntegerField()  
    location = models.CharField(max_length=255) 
    
    def __str__(self):
        return self.name
    
class MeetingRoom(models.Model):
    name = models.CharField(max_length=100, unique=True)
    capacity = models.IntegerField()
    location = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name
    
class Vehicle(models.Model):
    plate_number = models.CharField(max_length=10, unique=True) 
    model = models.CharField(max_length=100) 
    capacity = models.IntegerField() 
    
    def __str__(self):
        return f"{self.model} - {self.plate_number}"
    
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
    
    resource_type = models.CharField(max_length=20, choices=ResourceType.choices, null=True)
    resource_id = models.IntegerField(null=True)
    
    auditorium = models.ForeignKey(Auditorium, on_delete=models.SET_NULL, null=True, blank=True)
    meeting_room = models.ForeignKey(MeetingRoom, on_delete=models.SET_NULL, null=True, blank=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if self.auditorium_id:
            self.resource_type = self.ResourceType.AUDITORIUM
            self.resource_id = self.auditorium_id
        elif self.meeting_room_id:
            self.resource_type = self.ResourceType.MEETING_ROOM
            self.resource_id = self.meeting_room_id
        elif self.vehicle_id:
            self.resource_type = self.ResourceType.VEHICLE
            self.resource_id = self.vehicle_id

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
