from rest_framework import serializers
from django.db.models import Q
from .models import CustomUser, Auditorium, MeetingRoom, Vehicle, Reservation

def validate_positive_capacity(value):
    """
    Garante que o valor da capacidade seja um número inteiro positivo maior que zero.
    """
    if value <= 0:
        raise serializers.ValidationError("Capacity must be a positive number greater than zero.")
    return value

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    privacy_consent = serializers.BooleanField(required=True)
    data_processing_consent = serializers.BooleanField(required=True)
    is_self = serializers.SerializerMethodField() 

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'password', 'first_name', 'last_name',
            'siape', 'role', 'cpf', 'cellphone', 'status', 'is_staff', 'is_self',
            'privacy_consent', 'data_processing_consent', 'privacy_consent_date'
        ]
        read_only_fields = ['id', 'is_staff', 'privacy_consent_date'] 

    def get_is_self(self, obj):
        """
        Verifica se o usuário sendo serializado é o mesmo que fez a requisição.
        """
        request = self.context.get('request', None)
        if request and hasattr(request, "user"):
            return obj == request.user
        return False
    
    def validate_privacy_consent(self, value):
        """
        Valida se o consentimento de privacidade foi dado.
        """
        if not value:
            raise serializers.ValidationError(
                "O consentimento para tratamento de dados pessoais é obrigatório conforme a LGPD."
            )
        return value
    
    def validate_data_processing_consent(self, value):
        """
        Valida se o consentimento para processamento de dados foi dado.
        """
        if not value:
            raise serializers.ValidationError(
                "O consentimento para processamento de dados é obrigatório para utilizar o sistema."
            )
        return value
    
    def create(self, validated_data):
        from django.utils import timezone
        
        # Registra data e IP do consentimento
        request = self.context.get('request')
        if request:
            validated_data['privacy_consent_date'] = timezone.now()
            # Captura o IP do usuário
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                validated_data['privacy_consent_ip'] = x_forwarded_for.split(',')[0]
            else:
                validated_data['privacy_consent_ip'] = request.META.get('REMOTE_ADDR')
        
        return CustomUser.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    """
    Valida se os campos 'identifier' e 'password' foram enviados na requisição.
    A lógica de autenticação foi movida para a view.
    """
    identifier = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
class AuditoriumSerializer(serializers.ModelSerializer):

    capacity = serializers.IntegerField(validators=[validate_positive_capacity])
    
    class Meta:
        model = Auditorium
        fields = ['id', 'name', 'capacity', 'location']

    def validate_location(self, value):
        if not value.strip():
            raise serializers.ValidationError("Location cannot be empty.")
        return value

class MeetingRoomSerializer(serializers.ModelSerializer):

    capacity = serializers.IntegerField(validators=[validate_positive_capacity])
    
    class Meta:
        model = MeetingRoom
        fields = ['id', 'name', 'capacity', 'location']

    def validate_location(self, value):
        if not value.strip():
            raise serializers.ValidationError("Location cannot be empty.")
        return value

class VehicleSerializer(serializers.ModelSerializer):
    
    capacity = serializers.IntegerField(validators=[validate_positive_capacity])
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