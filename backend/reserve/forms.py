#forms.py
from django import forms
from django.contrib.auth.models import User
from .models import UserProfile, AdminProfile, Auditorium, MeetingRoom, Vehicle, Reservation
import re


# Custom validator for CPF (Brazilian format)
def validate_cpf(value):
    if not re.match(r'\d{11}$', value):
        raise forms.ValidationError("Invalid CPF format. Must contain exactly 11 digits.")
    
    # Custom validator for SIAPE
def validate_siape(value):
    if not re.match(r'\d{7}$', value):
        raise forms.ValidationError("Invalid SIAPE format. Must contain exactly 7 digits.")

# Custom validator for password security
def validate_password(value):
    if not re.match(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$', value):
        raise forms.ValidationError("Password must be 8-12 characters long and include at least one uppercase letter, one lowercase letter, and one special character.")


# User Registration Form
class UserProfileForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(), validators=[validate_password])
    cpf = forms.CharField(validators=[validate_cpf])
    siape = forms.CharField(validators=[validate_siape])
    
    class Meta:
        model = UserProfile
        fields = ['name', 'email', 'cellphone', 'cpf', 'siape', 'password']

# Auditorium Form
class AuditoriumForm(forms.ModelForm):
    class Meta:
        model = Auditorium
        fields = ['name', 'capacity', 'location']

# Meeting Room Form
class MeetingRoomForm(forms.ModelForm):
    class Meta:
        model = MeetingRoom
        fields = ['name', 'capacity', 'location']

# Vehicle Form
class VehicleForm(forms.ModelForm):
    class Meta:
        model = Vehicle
        fields = ['plate_number', 'model', 'capacity']

# Reservation Form with conflict validation
class ReservationForm(forms.ModelForm):
    class Meta:
        model = Reservation
        fields = ['initial_date', 'final_date', 'initial_time', 'final_time', 'description', 'auditorium', 'meeting_room', 'vehicle']

    def clean(self):
        cleaned_data = super().clean()
        initial_date = cleaned_data.get('initial_date')
        final_date = cleaned_data.get('final_date')
        initial_time = cleaned_data.get('initial_time')
        final_time = cleaned_data.get('final_time')
        auditorium = cleaned_data.get('auditorium')
        meeting_room = cleaned_data.get('meeting_room')
        vehicle = cleaned_data.get('vehicle')
        
        # Ensure only one resource is selected
        selected_resources = [auditorium, meeting_room, vehicle]
        if sum(bool(resource) for resource in selected_resources) != 1:
            raise forms.ValidationError("You must select exactly one resource (Auditorium, Meeting Room, or Vehicle).")
        
        # Validate reservation conflicts
        if Reservation.objects.filter(
            initial_date=initial_date,
            final_date=final_date,
            initial_time__lt=final_time,
            final_time__gt=initial_time,
            auditorium=auditorium if auditorium else None,
            meeting_room=meeting_room if meeting_room else None,
            vehicle=vehicle if vehicle else None
        ).exists():
            raise forms.ValidationError("This resource is already booked for the selected date and time.")
        
        return cleaned_data