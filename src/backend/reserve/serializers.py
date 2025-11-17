# serializers.py
from rest_framework import serializers
from django.db.models import Q
from django.db import transaction
from .models import CustomUser, Auditorium, MeetingRoom, Vehicle, Reservation


def validate_positive_capacity(value):
    """
    Garante que o valor da capacidade seja um número inteiro positivo maior que zero.
    """
    if value <= 0:
        raise serializers.ValidationError(
            "Capacity must be a positive number greater than zero."
        )
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


class ReservationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para CRIAR reservas. Aceita um array de 'dates'.
    """
    dates = serializers.ListField(
        child=serializers.DateField(),
        write_only=True,
        required=True,
        allow_empty=False
    )
    auditorium = serializers.PrimaryKeyRelatedField(
        queryset=Auditorium.objects.all(), required=False, allow_null=True
    )
    meeting_room = serializers.PrimaryKeyRelatedField(
        queryset=MeetingRoom.objects.all(), required=False, allow_null=True
    )
    vehicle = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = Reservation
        fields = [
            'id',
            'auditorium',
            'meeting_room',
            'vehicle',
            'initial_time',
            'final_time',
            'description',
            'dates',
        ]

    def _determine_initial_status(self, resource_data):
        """
        Determina o status inicial baseado no tipo de recurso.
        """
        if resource_data.get('meeting_room'):
            return Reservation.Status.CONFIRMED
        return Reservation.Status.PENDING

    def validate(self, data):
        resource_count = sum([
            1 for k in ['auditorium', 'meeting_room', 'vehicle'] if data.get(k)
        ])
        if resource_count != 1:
            raise serializers.ValidationError(
                "Exatamente um recurso (auditório, sala ou veículo) deve ser fornecido."
            )

        if data.get('initial_time') >= data.get('final_time'):
            raise serializers.ValidationError(
                "O horário final deve ser após o horário inicial."
            )

        return data

    @transaction.atomic
    def create(self, validated_data):
        user = self.context['request'].user
        dates_to_create = validated_data.pop('dates')
        new_reservations = []

        resource_data = {
            'auditorium': validated_data.pop('auditorium', None),
            'meeting_room': validated_data.pop('meeting_room', None),
            'vehicle': validated_data.pop('vehicle', None),
        }
        resource_data = {k: v for k, v in resource_data.items() if v is not None}

        common_data = validated_data
        initial_status = self._determine_initial_status(resource_data)

        for date in dates_to_create:
            has_conflict = Reservation.objects.filter(
                **resource_data,
                status=Reservation.Status.CONFIRMED,
                initial_date=date,
                is_deleted=False,
                initial_time__lt=common_data['final_time'],
                final_time__gt=common_data['initial_time']
            ).exists()

            if has_conflict:
                raise serializers.ValidationError(
                    f"Conflito de horário detectado para o dia {date.strftime('%d/%m/%Y')}. "
                    "Este horário já está reservado e confirmado."
                )

            reservation = Reservation.objects.create(
                user=user,
                initial_date=date,
                final_date=date,
                status=initial_status,
                **resource_data,
                **common_data
            )
            new_reservations.append(reservation)

        return new_reservations[0]


class ReservationListSerializer(serializers.ModelSerializer):
    """
    Serializer para LISTAR reservas (Antigo ReservationSerializer).
    """
    user = CustomUserSerializer(read_only=True)
    auditorium = AuditoriumSerializer(read_only=True)
    meeting_room = MeetingRoomSerializer(read_only=True)
    vehicle = VehicleSerializer(read_only=True)
    resource_type = serializers.ChoiceField(
        choices=Reservation.ResourceType.choices,
        read_only=True
    )
    resource_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id', 'user', 'initial_date', 'final_date', 'initial_time',
            'final_time', 'description', 'status', 'resource_type',
            'resource_id', 'is_deleted',
            'auditorium', 'meeting_room', 'vehicle'
        ]

    def validate(self, data):
        initial_date = data.get('initial_date')
        final_date = data.get('final_date')
        initial_time = data.get('initial_time')
        final_time = data.get('final_time')

        if initial_date and final_date and initial_date > final_date:
            raise serializers.ValidationError(
                "A data inicial deve ser anterior à data final"
            )

        if initial_date == final_date and initial_time and final_time and initial_time >= final_time:
            raise serializers.ValidationError(
                "O horário inicial deve ser anterior ao horário final no mesmo dia"
            )

        return data