# views.py
# Bibliotecas padrão do Django
from django.contrib.auth import login, authenticate
from django.contrib.sessions.models import Session
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.utils import timezone
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from django.conf import settings

# Bibliotecas padrão de utilidades
import hashlib
import secrets
from datetime import timedelta

# Bibliotecas do Django REST Framework
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

# Serializers do projeto (Imports Mesclados)
from .serializers import (
    AuditoriumSerializer, MeetingRoomSerializer, VehicleSerializer,
    CustomUserSerializer, LoginSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    PasswordResetValidateSerializer,
    ReservationListSerializer, 
    ReservationCreateSerializer
)

from .services import EmailService
from .models import PasswordResetToken, CustomUser


class PasswordResetTokenMixin:
    @staticmethod
    def _hash_token(raw_token):
        return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

    def _get_active_token(self, raw_token):
        token_hash = self._hash_token(raw_token)
        token = PasswordResetToken.objects.filter(
            token_hash=token_hash,
            used_at__isnull=True
        ).first()

        if not token:
            return None

        if token.expires_at < timezone.now():
            return None

        return token


class PasswordResetRequestView(PasswordResetTokenMixin, APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].strip().lower()
        user = CustomUser.objects.filter(
            email__iexact=email,
            is_active=True,
            is_anonymized=False
        ).first()

        if user and not self._is_rate_limited(user):
            raw_token = self._create_reset_token(user, request)
            reset_link = self._build_reset_link(raw_token)
            EmailService.send_password_reset_email(
                user_email=user.email,
                user_name=user.get_full_name() or user.username,
                reset_link=reset_link,
                expires_minutes=settings.PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES,
            )

        return Response(
            {"detail": "Se o e-mail estiver cadastrado, enviaremos instruções para redefinir sua senha."},
            status=status.HTTP_200_OK
        )

    def _create_reset_token(self, user, request):
        raw_token = secrets.token_urlsafe(48)
        PasswordResetToken.objects.create(
            user=user,
            token_hash=self._hash_token(raw_token),
            requested_email=user.email,
            request_ip=self._get_client_ip(request),
            user_agent=(request.META.get("HTTP_USER_AGENT") or "")[:255],
            expires_at=timezone.now() + timedelta(
                minutes=settings.PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES
            ),
        )
        return raw_token

    def _get_client_ip(self, request):
        forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")

    def _is_rate_limited(self, user):
        window_start = timezone.now() - timedelta(
            minutes=settings.PASSWORD_RESET_RATE_LIMIT_WINDOW_MINUTES
        )
        recent_requests = PasswordResetToken.objects.filter(
            user=user,
            created_at__gte=window_start
        ).count()
        return recent_requests >= settings.PASSWORD_RESET_RATE_LIMIT

    def _build_reset_link(self, raw_token):
        base_url = getattr(settings, "FRONTEND_BASE_URL", "http://localhost:5173").rstrip("/")
        return f"{base_url}/reset-password?token={raw_token}"


class PasswordResetValidateView(PasswordResetTokenMixin, APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        serializer = PasswordResetValidateSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data["token"]
        reset_token = self._get_active_token(token)

        if not reset_token:
            return Response(
                {"detail": "Token inválido ou expirado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"detail": "Token válido."}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(PasswordResetTokenMixin, APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data["token"]
        reset_token = self._get_active_token(token)

        if not reset_token:
            return Response(
                {"detail": "Token inválido ou expirado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = reset_token.user
        user.set_password(serializer.validated_data["password"])
        user.save()

        reset_token.mark_used()
        PasswordResetToken.objects.filter(
            user=user,
            used_at__isnull=True
        ).exclude(pk=reset_token.pk).update(used_at=timezone.now())

        self._revoke_user_sessions(user)

        return Response({"detail": "Senha atualizada com sucesso."})

    def _revoke_user_sessions(self, user):
        auth_token_set = getattr(user, "auth_token_set", None)
        if auth_token_set is not None:
            auth_token_set.all().delete()

        auth_token = getattr(user, "auth_token", None)
        if auth_token is not None:
            try:
                auth_token.delete()
            except Exception:
                pass

        for session in Session.objects.filter(expire_date__gte=timezone.now()):
            data = session.get_decoded()
            if str(data.get("_auth_user_id")) == str(user.pk):
                session.delete()


class AdminOrAuthenticatedReadOnlyPermissionMixin:
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]


class UpdateUserStatusView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        from .models import CustomUser
        user = get_object_or_404(CustomUser, pk=pk)
        new_status = request.data.get('status')
        
        if not self._is_valid_status(new_status):
            return Response(
                {"error": "Status inválido"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        old_status = user.status
        user.status = new_status
        user.save()
        
        message = self._handle_status_change_notification(
            user, old_status, new_status, request.data
        )
        
        return Response({"message": message})

    def _is_valid_status(self, new_status):
        from .models import CustomUser
        valid_statuses = [s[0] for s in CustomUser.STATUS_CHOICES]
        return new_status in valid_statuses

    def _handle_status_change_notification(self, user, old_status, new_status, data):
        if old_status != 'Aprovado' and new_status == 'Aprovado':
            return self._send_approval_notification(user)
        
        if old_status != 'Reprovado' and new_status == 'Reprovado':
            return self._send_rejection_notification(user, data.get('reason'))
        
        return f"Status do usuário alterado para {new_status}"

    def _send_approval_notification(self, user):
        success = EmailService.send_approval_email(
            user_email=user.email,
            user_name=user.get_full_name() or user.username,
            username=user.username
        )
        email_status = "enviado" if success else "falha no envio"
        return f"Status do usuário alterado para Aprovado. Email: {email_status}"

    def _send_rejection_notification(self, user, reason):
        success = EmailService.send_rejection_email(
            user_email=user.email,
            user_name=user.get_full_name() or user.username,
            reason=reason
        )
        email_status = "enviado" if success else "falha no envio"
        return f"Status do usuário alterado para Reprovado. Email: {email_status}"


class AuditoriumAdminView(AdminOrAuthenticatedReadOnlyPermissionMixin, generics.ListCreateAPIView):
    serializer_class = AuditoriumSerializer

    def get_queryset(self):
        from .models import Auditorium
        return Auditorium.objects.all()


class AuditoriumDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AuditoriumSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        from .models import Auditorium
        return Auditorium.objects.all()


class MeetingRoomAdminView(AdminOrAuthenticatedReadOnlyPermissionMixin, generics.ListCreateAPIView):
    serializer_class = MeetingRoomSerializer

    def get_queryset(self):
        from .models import MeetingRoom
        return MeetingRoom.objects.all()


class MeetingRoomDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MeetingRoomSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        from .models import MeetingRoom
        return MeetingRoom.objects.all()


class VehicleAdminView(AdminOrAuthenticatedReadOnlyPermissionMixin, generics.ListCreateAPIView):
    serializer_class = VehicleSerializer

    def get_queryset(self):
        from .models import Vehicle
        return Vehicle.objects.all()


class VehicleDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        from .models import Vehicle
        return Vehicle.objects.all()


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                CustomUserSerializer(user, context={'request': request}).data, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = self._authenticate_user(request, serializer.validated_data)
        
        if not user:
            return Response(
                {"detail": "Credenciais inválidas ou usuário não encontrado."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        error_response = self._check_user_can_login(user)
        if error_response:
            return error_response
        
        return self._create_login_response(request, user)

    def _authenticate_user(self, request, validated_data):
        return authenticate(
            request,
            username=validated_data['identifier'],
            password=validated_data['password']
        )

    def _check_user_can_login(self, user):
        if user.status == 'Bloqueado':
            return Response(
                {"detail": "Esta conta de usuário está bloqueada."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if user.status != 'Aprovado':
            return Response(
                {"detail": "Esta conta ainda não foi aprovada por um administrador."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return None

    def _create_login_response(self, request, user):
        login(request, user)
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': CustomUserSerializer(user, context={'request': request}).data
        }, status=status.HTTP_200_OK)


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user, context={'request': request})
        return Response(serializer.data)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        serializer = CustomUserSerializer(
            user, 
            data=request.data, 
            partial=True, 
            context={'request': request}
        )

        if serializer.is_valid():
            self._update_password_if_provided(user, request.data)
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _update_password_if_provided(self, user, data):
        if "password" in data and data["password"]:
            user.set_password(data["password"])
            user.save()


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.anonymize()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminUserListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        from .models import CustomUser
        users = CustomUser.objects.all().order_by('-date_joined')
        serializer = CustomUserSerializer(users, many=True, context={'request': request})
        return Response(serializer.data)


class AdminReservationListView(generics.ListAPIView):
    serializer_class = ReservationListSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        status_filter = self.request.query_params.get('status', 'Pendente')
        category_filter = self.request.query_params.get('category', '').lower()
        
        queryset = self._get_base_queryset(status_filter)
        queryset = self._apply_category_filter(queryset, category_filter)
        
        return queryset.select_related('auditorium', 'vehicle', 'meeting_room')

    def _get_base_queryset(self, status_filter):
        from .models import Reservation
        return Reservation.objects.filter(
            status=status_filter,
            final_date__gte=now().date(),
            is_deleted=False
        ).order_by('initial_date')

    def _apply_category_filter(self, queryset, category):
        category_filters = {
            'auditorio': {'auditorium__isnull': False},
            'veiculo': {'vehicle__isnull': False},
            'sala de reunião': {'meeting_room__isnull': False}
        }
        
        filter_params = category_filters.get(category)
        if filter_params:
            return queryset.filter(**filter_params)
        
        return queryset


class UpdateReservationStatusView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        from .models import Reservation
        reservation = get_object_or_404(Reservation, pk=pk)
        status_action = request.data.get('status')
        
        final_status = self._map_status_action(status_action)
        if not final_status:
            return Response(
                {"error": "Ação de status inválida."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reservation.status = final_status
        reservation.save()
        
        return Response(
            {"message": f"Reserva atualizada para '{final_status}' com sucesso."}, 
            status=status.HTTP_200_OK
        )

    def _map_status_action(self, status_action):
        from .models import Reservation
        
        status_mapping = {
            'Aprovado': Reservation.Status.CONFIRMED,
            'Reprovado': Reservation.Status.CANCELED
        }
        
        return status_mapping.get(status_action)


class UserReservationListView(generics.ListAPIView):
    serializer_class = ReservationListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        from .models import Reservation
        return Reservation.objects.filter(
            user=self.request.user,
            final_date__gte=now().date(),
            is_deleted=False
        ).order_by('-initial_date')


class CreateReservationView(generics.CreateAPIView):
    serializer_class = ReservationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CancelReservationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        from .models import Reservation
        reservation = get_object_or_404(
            Reservation, 
            pk=pk, 
            user=request.user, 
            is_deleted=False
        )
        reservation.is_deleted = True
        reservation.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OccupiedDatesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, resource_type, resource_id):
        from .models import Reservation
        
        if not self._is_valid_resource_type(resource_type):
            return Response(
                {"error": "Tipo de recurso inválido"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reservations = self._get_occupied_reservations(resource_type, resource_id)
        occupied_dates = self._format_occupied_dates(reservations)
        
        return Response(occupied_dates)

    def _is_valid_resource_type(self, resource_type):
        from .models import Reservation
        return resource_type in Reservation.ResourceType.values

    def _get_occupied_reservations(self, resource_type, resource_id):
        from .models import Reservation
        return Reservation.objects.filter(
            resource_type=resource_type,
            resource_id=resource_id,
            status=Reservation.Status.CONFIRMED,
            final_date__gte=now().date(),
            is_deleted=False
        ).values('initial_date', 'final_date', 'initial_time', 'final_time')

    def _format_occupied_dates(self, reservations):
        occupied_dates = []
        for r in reservations:
            occupied_dates.append({
                'date': r['initial_date'],
                'initial_time': r['initial_time'],
                'final_time': r['final_time']
            })
        return occupied_dates