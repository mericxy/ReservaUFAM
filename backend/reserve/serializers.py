from rest_framework import serializers
from .models import CustomUser, Auditorium, MeetingRoom, Vehicle, Reservation

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)  # Garante que a senha seja fornecida

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'siape', 'role', 'cpf', 'cellphone', 'status', 'is_staff']
        read_only_fields = ['id', 'is_staff']  # is_staff será somente leitura

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def get_user(self, identifier):
        return CustomUser.objects.filter(
            Q(username=identifier) | Q(email=identifier) | Q(siape=identifier)
        ).first()

    def validate(self, attrs):
        identifier = attrs.get('identifier')
        password = attrs.get('password')

        user = self.get_user(identifier)

        if not user or not user.check_password(password):
            raise serializers.ValidationError(_('Invalid credentials or user not found'))

        attrs['user'] = user
        return attrs

class AuditoriumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auditorium
        fields = ['id', 'name', 'capacity', 'location']

    def validate_location(self, value):
        if not value.strip():
            raise serializers.ValidationError("Location cannot be empty.")
        return value

class MeetingRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingRoom
        fields = ['id', 'name', 'capacity', 'location']

    def validate_location(self, value):
        if not value.strip():
            raise serializers.ValidationError("Location cannot be empty.")
        return value

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'plate_number', 'model', 'capacity']

class ReservationSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    resource_type = serializers.ChoiceField(choices=Reservation.ResourceType.choices)
    resource_id = serializers.IntegerField()

    class Meta:
        model = Reservation
        fields = ['id', 'user', 'initial_date', 'final_date', 'initial_time', 
                 'final_time', 'description', 'status', 'resource_type', 
                 'resource_id', 'is_deleted']

    def validate(self, data):
        # Valida datas e horários
        initial_date = data.get('initial_date')
        final_date = data.get('final_date')
        initial_time = data.get('initial_time')
        final_time = data.get('final_time')

        if initial_date > final_date:
            raise serializers.ValidationError(
                "A data inicial deve ser anterior à data final"
            )

        if initial_date == final_date and initial_time >= final_time:
            raise serializers.ValidationError(
                "O horário inicial deve ser anterior ao horário final no mesmo dia"
            )

        # Verifica se o recurso existe
        resource_type = data.get('resource_type')
        resource_id = data.get('resource_id')
        
        resource_model = {
            'auditorium': Auditorium,
            'meeting_room': MeetingRoom,
            'vehicle': Vehicle
        }.get(resource_type)
        
        if not resource_model:
            raise serializers.ValidationError("Tipo de recurso inválido")
            
        try:
            resource = resource_model.objects.get(id=resource_id)
        except resource_model.DoesNotExist:
            raise serializers.ValidationError(f"{resource_type} com ID {resource_id} não existe")

        # Verifica se já existe uma reserva para este recurso no mesmo período
        if Reservation.objects.filter(
            resource_type=resource_type,
            resource_id=resource_id,
            initial_date=initial_date,
            final_date=final_date,
            initial_time__lt=final_time,
            final_time__gt=initial_time,
            is_deleted=False
        ).exists():
            raise serializers.ValidationError(
                "Este recurso já está reservado para o período selecionado"
            )

        return data