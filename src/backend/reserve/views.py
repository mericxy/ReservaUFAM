# views.py
# Bibliotecas padrão do Django
from django.contrib.auth import login, authenticate
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.db.models import Q
from django.utils.translation import gettext_lazy as _

# Bibliotecas do Django REST Framework
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

# Serializers do projeto
from .serializers import (
    AuditoriumSerializer, MeetingRoomSerializer, VehicleSerializer,
    CustomUserSerializer, ReservationSerializer, LoginSerializer
)

from .services import EmailService
class AdminOrAuthenticatedReadOnlyPermissionMixin:
    """
    Mixin de permissão que permite acesso de leitura para qualquer usuário autenticado
    e acesso de escrita (POST, PUT, PATCH, DELETE) apenas para administradores.
    """
    def get_permissions(self):
        """
        Define permissões dinâmicas baseadas no método HTTP.
        """
        if self.request.method in permissions.SAFE_METHODS:  # GET, HEAD, OPTIONS
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

class UpdateUserStatusView(APIView):
    """
    View para administradores atualizarem o status de um usuário.
    """
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        """
        Altera o status de um usuário específico (ex: aprovar, bloquear).
        """
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
        """
        Valida se o status fornecido é válido.
        """
        from .models import CustomUser
        valid_statuses = [s[0] for s in CustomUser.STATUS_CHOICES]
        return new_status in valid_statuses

    def _handle_status_change_notification(self, user, old_status, new_status, data):
        """
        Envia notificações apropriadas baseadas na mudança de status.
        Retorna uma mensagem descrevendo o resultado da operação.
        """
        if old_status != 'Aprovado' and new_status == 'Aprovado':
            return self._send_approval_notification(user)
        
        if old_status != 'Reprovado' and new_status == 'Reprovado':
            return self._send_rejection_notification(user, data.get('reason'))
        
        return f"Status do usuário alterado para {new_status}"

    def _send_approval_notification(self, user):
        """
        Envia e-mail de aprovação e retorna mensagem de status.
        """
        success = EmailService.send_approval_email(
            user_email=user.email,
            user_name=user.get_full_name() or user.username,
            username=user.username
        )
        email_status = "enviado" if success else "falha no envio"
        return f"Status do usuário alterado para Aprovado. Email: {email_status}"

    def _send_rejection_notification(self, user, reason):
        """
        Envia e-mail de rejeição e retorna mensagem de status.
        """
        success = EmailService.send_rejection_email(
            user_email=user.email,
            user_name=user.get_full_name() or user.username,
            reason=reason
        )
        email_status = "enviado" if success else "falha no envio"
        return f"Status do usuário alterado para Reprovado. Email: {email_status}"

class AuditoriumAdminView(AdminOrAuthenticatedReadOnlyPermissionMixin, generics.ListCreateAPIView):
    """
    View para listar (GET) e criar (POST) Auditórios.
    """
    serializer_class = AuditoriumSerializer

    def get_queryset(self):
        """
        Retorna a lista de todos os auditórios.
        """
        from .models import Auditorium
        return Auditorium.objects.all()

class AuditoriumDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    """
    View para ver detalhes, atualizar e deletar um Auditório específico.
    Apenas administradores têm acesso.
    """
    serializer_class = AuditoriumSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        """
        Retorna o queryset para buscar um auditório.
        """
        from .models import Auditorium
        return Auditorium.objects.all()

class MeetingRoomAdminView(AdminOrAuthenticatedReadOnlyPermissionMixin, generics.ListCreateAPIView):
    """
    View para listar (GET) e criar (POST) Salas de Reunião.
    """
    serializer_class = MeetingRoomSerializer

    def get_queryset(self):
        """
        Retorna a lista de todas as salas de reunião.
        """
        from .models import MeetingRoom
        return MeetingRoom.objects.all()

class MeetingRoomDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    """
    View para ver detalhes, atualizar e deletar uma Sala de Reunião específica.
    """
    serializer_class = MeetingRoomSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        """
        Retorna o queryset para buscar uma sala de reunião.
        """
        from .models import MeetingRoom
        return MeetingRoom.objects.all()

class VehicleAdminView(AdminOrAuthenticatedReadOnlyPermissionMixin, generics.ListCreateAPIView):
    """
    View para listar (GET) e criar (POST) Veículos.
    """
    serializer_class = VehicleSerializer

    def get_queryset(self):
        """
        Retorna a lista de todos os veículos.
        """
        from .models import Vehicle
        return Vehicle.objects.all()

class VehicleDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    """
    View para ver detalhes, atualizar e deletar um Veículo específico.
    """
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        """
        Retorna o queryset para buscar um veículo.
        """
        from .models import Vehicle
        return Vehicle.objects.all()

class RegisterView(APIView):
    """
    View para registrar novos usuários. O acesso é público.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Cria um novo usuário com os dados fornecidos.
        """
        serializer = CustomUserSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                CustomUserSerializer(user, context={'request': request}).data, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """
    View de login que retorna tokens de acesso/refresh e os dados do usuário.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        """
        Autentica o usuário e retorna os tokens e dados do perfil.
        """
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = self._authenticate_user(request, serializer.validated_data)
        
        if not user:
            return Response(
                {"detail": "Credenciais inválidas ou usuário não encontrado."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Verifica se o usuário pode fazer login
        error_response = self._check_user_can_login(user)
        if error_response:
            return error_response
        
        return self._create_login_response(request, user)

    def _authenticate_user(self, request, validated_data):
        """
        Autentica o usuário usando as credenciais fornecidas.
        """
        return authenticate(
            request,
            username=validated_data['identifier'],
            password=validated_data['password']
        )

    def _check_user_can_login(self, user):
        """
        Verifica se o usuário está em um estado válido para login.
        Retorna None se o usuário pode fazer login, ou um Response com erro.
        """
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
        """
        Cria a resposta de login com tokens e dados do usuário.
        """
        login(request, user)
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': CustomUserSerializer(user, context={'request': request}).data
        }, status=status.HTTP_200_OK)

class UserDetailView(APIView):
    """
    View que retorna os detalhes do usuário atualmente autenticado.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna os dados do usuário que está fazendo a requisição.
        """
        serializer = CustomUserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

class UserProfileView(APIView):
    """
    View para um usuário ver e editar seu próprio perfil.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna os dados do perfil do usuário logado.
        """
        serializer = CustomUserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        """
        Atualiza os dados do perfil do usuário logado.
        """
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
        """
        Atualiza a senha do usuário se fornecida nos dados da requisição.
        """
        if "password" in data and data["password"]:
            user.set_password(data["password"])
            user.save()

class DeleteAccountView(APIView):
    """
    View para um usuário solicitar a exclusão (anonimização) de sua própria conta.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        """
        Aciona o processo de anonimização para o usuário autenticado.
        """
        user = request.user
        user.anonymize()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AdminUserListView(APIView):
    """
    View para administradores listarem todos os usuários do sistema.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        """
        Retorna uma lista de todos os usuários, ordenados pela data de criação.
        """
        from .models import CustomUser
        users = CustomUser.objects.all().order_by('-date_joined')
        serializer = CustomUserSerializer(users, many=True, context={'request': request})
        return Response(serializer.data)

class AdminReservationListView(generics.ListAPIView):
    """
    View para administradores listarem as reservas, com filtros por status e categoria.
    """
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        """
        Retorna reservas filtradas por status e categoria.
        """
        status_filter = self.request.query_params.get('status', 'Pendente')
        category_filter = self.request.query_params.get('category', '').lower()
        
        queryset = self._get_base_queryset(status_filter)
        queryset = self._apply_category_filter(queryset, category_filter)
        
        return queryset.select_related('auditorium', 'vehicle', 'meeting_room')

    def _get_base_queryset(self, status_filter):
        """
        Cria o queryset base com filtros comuns (status, data futura, não deletadas).
        """
        from .models import Reservation
        return Reservation.objects.filter(
            status=status_filter,
            final_date__gte=now().date(),
            is_deleted=False
        ).order_by('initial_date')

    def _apply_category_filter(self, queryset, category):
        """
        Aplica filtro de categoria ao queryset baseado no tipo de recurso.
        """
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
    """
    View para um admin confirmar ou cancelar uma reserva.
    """
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        """
        Altera o status de uma reserva específica.
        """
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
        """
        Mapeia a ação de status recebida para o status final da reserva.
        Retorna None se a ação for inválida.
        """
        from .models import Reservation
        
        status_mapping = {
            'Aprovado': Reservation.Status.CONFIRMED,
            'Reprovado': Reservation.Status.CANCELED
        }
        
        return status_mapping.get(status_action)

class UserReservationListView(generics.ListAPIView):
    """
    View para um usuário listar apenas as suas próprias reservas.
    """
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retorna as reservas ativas do usuário logado.
        """
        from .models import Reservation
        return Reservation.objects.filter(
            user=self.request.user,
            final_date__gte=now().date(),
            is_deleted=False
        ).order_by('-initial_date')

class CreateReservationView(generics.CreateAPIView):
    """
    View para um usuário criar uma nova reserva.
    """
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retorna o queryset base para a criação.
        """
        from .models import Reservation
        return Reservation.objects.all()

    def perform_create(self, serializer):
        """
        Define o usuário e o status inicial da reserva antes de salvar.
        """
        from .models import Reservation
        resource_type = serializer.validated_data['resource_type']
        initial_status = self._determine_initial_status(resource_type)
        
        serializer.save(
            user=self.request.user,
            status=initial_status
        )

    def _determine_initial_status(self, resource_type):
        """
        Determina o status inicial baseado no tipo de recurso.
        Salas de reunião são confirmadas automaticamente, outros recursos ficam pendentes.
        """
        from .models import Reservation
        
        if resource_type == 'meeting_room':
            return Reservation.Status.CONFIRMED
        
        return Reservation.Status.PENDING

class CancelReservationView(APIView):
    """
    View para um usuário cancelar (soft delete) uma de suas reservas.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        """
        Marca uma reserva como deletada (is_deleted=True).
        """
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
    """
    View que retorna uma lista de datas e horários já ocupados
    para um recurso específico.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, resource_type, resource_id):
        """
        Busca no banco as reservas confirmadas para o recurso.
        """
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
        """
        Valida se o tipo de recurso fornecido é válido.
        """
        from .models import Reservation
        return resource_type in Reservation.ResourceType.values

    def _get_occupied_reservations(self, resource_type, resource_id):
        """
        Busca as reservas confirmadas e futuras para o recurso especificado.
        """
        from .models import Reservation
        return Reservation.objects.filter(
            resource_type=resource_type,
            resource_id=resource_id,
            status=Reservation.Status.CONFIRMED,
            final_date__gte=now().date(),
            is_deleted=False
        ).values('initial_date', 'final_date', 'initial_time', 'final_time')

    def _format_occupied_dates(self, reservations):
        """
        Formata as reservas para o formato esperado pelo frontend.
        """
        occupied_dates = []
        for r in reservations:
            occupied_dates.append({
                'date': r['initial_date'],
                'initial_time': r['initial_time'],
                'final_time': r['final_time']
            })
        return occupied_dates