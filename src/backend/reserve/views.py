# Bibliotecas padrão do Django
from django.contrib.auth import login
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.db.models import Q
from django.contrib.auth import authenticate
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


class AdminOrAuthenticatedReadOnlyPermissionMixin:
    """
    Mixin de permissão que permite acesso de leitura para qualquer usuário autenticado
    e acesso de escrita (POST, PUT, PATCH, DELETE) apenas para administradores.
    """
    def get_permissions(self):
        """
        Define permissões dinâmicas baseadas no método HTTP.
        """
        if self.request.method in permissions.SAFE_METHODS: # GET, HEAD, OPTIONS
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

# --- Views de Recursos ---

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

# --- Views de Autenticação e Usuário ---

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
            return Response(CustomUserSerializer(user, context={'request': request}).data, status=status.HTTP_201_CREATED)
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

        identifier = serializer.validated_data['identifier']
        password = serializer.validated_data['password']

        # Testa os backends em settings.py e retorna o usuário com o atributo .backend
        user = authenticate(request, username=identifier, password=password)

        if user:
            if user.status == 'Bloqueado':
                return Response(
                    {"detail": "Esta conta de usuário está bloqueada."},
                    status=status.HTTP_403_FORBIDDEN # 403 Forbidden é mais apropriado aqui
                )
            
            if user.status != 'Aprovado':
                return Response(
                    {"detail": "Esta conta ainda não foi aprovada por um administrador."},
                    status=status.HTTP_403_FORBIDDEN
                )

            login(request, user)
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': CustomUserSerializer(user, context={'request': request}).data
            }, status=status.HTTP_200_OK)
        
        # Se a autenticação falhar (usuário/senha errados), o erro padrão é retornado.
        return Response(
            {"detail": "Credenciais inválidas ou usuário não encontrado."},
            status=status.HTTP_401_UNAUTHORIZED
        )

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
        serializer = CustomUserSerializer(user, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            if "password" in request.data and request.data["password"]:
                user.set_password(request.data["password"])
                user.save()
            
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- Views de Gerenciamento (Admin) ---

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
        
        valid_statuses = [s[0] for s in CustomUser.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({"error": "Status inválido"}, status=status.HTTP_400_BAD_REQUEST)
        
        user.status = new_status
        user.save()
        return Response({"message": f"Status do usuário alterado para {new_status}"})

class AdminReservationListView(generics.ListAPIView):
    """
    View para administradores listarem as reservas, com filtros.
    """
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        """
        Filtra as reservas por status e categoria de recurso.
        """
        from .models import Reservation
        status_filter = self.request.query_params.get('status', 'Pendente')
        category_filter = self.request.query_params.get('category', '').lower()
        queryset = Reservation.objects.filter(status=status_filter, final_date__gte=now().date(), is_deleted=False).order_by('initial_date')
        if category_filter == 'auditorio':
            queryset = queryset.filter(auditorium__isnull=False)
        elif category_filter == 'veiculo':
            queryset = queryset.filter(vehicle__isnull=False)
        elif category_filter == 'sala de reunião':
            queryset = queryset.filter(meeting_room__isnull=False)
        return queryset.select_related('auditorium', 'vehicle', 'meeting_room')

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
        status_action = request.data.get('status') # Ex: "Aprovado" ou "Reprovado"
        
        if status_action == 'Aprovado':
            final_status = Reservation.Status.CONFIRMED
        elif status_action == 'Reprovado':
            final_status = Reservation.Status.CANCELED
        else:
            return Response({"error": "Ação de status inválida."}, status=status.HTTP_400_BAD_REQUEST)
        
        reservation.status = final_status
        reservation.save()
        return Response({"message": f"Reserva atualizada para '{final_status}' com sucesso."}, status=status.HTTP_200_OK)

# --- Views de Reservas (Usuário) ---

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
        
        initial_status = Reservation.Status.CONFIRMED if resource_type == 'meeting_room' else Reservation.Status.PENDING
        
        serializer.save(
            user=self.request.user,
            status=initial_status
        )

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
        reservation = get_object_or_404(Reservation, pk=pk, user=request.user, is_deleted=False)
        reservation.is_deleted = True
        reservation.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

# --- Views Utilitárias ---

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
        if resource_type not in Reservation.ResourceType.values:
             return Response({"error": "Tipo de recurso inválido"}, status=status.HTTP_400_BAD_REQUEST)
        
        reservations = Reservation.objects.filter(
            resource_type=resource_type,
            resource_id=resource_id,
            status=Reservation.Status.CONFIRMED, 
            final_date__gte=now().date(),
            is_deleted=False
        ).values('initial_date', 'final_date', 'initial_time', 'final_time')

        occupied_dates = []
        for r in reservations:
            occupied_dates.append({
                'date': r['initial_date'],
                'initial_time': r['initial_time'],
                'final_time': r['final_time']
            })

        return Response(occupied_dates)