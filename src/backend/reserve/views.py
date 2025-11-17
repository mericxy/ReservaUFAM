# views.py
from django.contrib.auth import login, authenticate
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.db.models import Q
from django.utils.translation import gettext_lazy as _

from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

from .serializers import (
    AuditoriumSerializer, MeetingRoomSerializer, VehicleSerializer,
    CustomUserSerializer, 
    ReservationListSerializer, 
    ReservationCreateSerializer,
    LoginSerializer
)
from .services import EmailService


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