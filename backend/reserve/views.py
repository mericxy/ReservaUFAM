# Bibliotecas padrão do Django
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from rest_framework.permissions import IsAuthenticated

# Django Rest Framework
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db.models import Q

# Django Rest Framework Simple JWT
from rest_framework_simplejwt.tokens import RefreshToken

# Modelos
from .models import CustomUser, Reservation, Auditorium, MeetingRoom, Vehicle

# Serializers
from .serializers import (
    AuditoriumSerializer, MeetingRoomSerializer, VehicleSerializer,
    CustomUserSerializer, ReservationSerializer, LoginSerializer
)

def index(request):
    return JsonResponse({'message': 'Ola do Django!'})

# Modificação na view de token (login)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.utils.translation import gettext_lazy as _

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Primeiro chamamos o método de validação original para verificar as credenciais
        data = super().validate(attrs)
        
        # Verificamos o status do usuário - DEVE SER APROVADO
        if self.user.status != 'Aprovado':
            raise AuthenticationFailed(
                _('Sua conta ainda não foi aprovada pelo administrador.')
            )
            
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Painel do administrador para gerenciar auditórios
class AuditoriumAdminView(generics.ListCreateAPIView):
    queryset = Auditorium.objects.all()
    serializer_class = AuditoriumSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

class AuditoriumDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Auditorium.objects.all()
    serializer_class = AuditoriumSerializer
    permission_classes = [permissions.IsAdminUser]

# Painel do administrador para gerenciar salas de reunião
class MeetingRoomAdminView(generics.ListCreateAPIView):
    queryset = MeetingRoom.objects.all()
    serializer_class = MeetingRoomSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

class MeetingRoomDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MeetingRoom.objects.all()
    serializer_class = MeetingRoomSerializer
    permission_classes = [permissions.IsAdminUser]

# Painel do administrador para gerenciar veículos
class VehicleAdminView(generics.ListCreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

class VehicleDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAdminUser]

# Cadastro de usuário
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]  # Permite acesso sem autenticação

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # O serializer já chama create_user() e lida com a senha
            return Response(CustomUserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login de usuário
class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']  # Aqui você obtém o usuário do serializer
        
        # Gera o token
        token = RefreshToken.for_user(user)  # Agora 'user' está definido
        
        # Faz o login
        login(request, user)
        
        # Retorna o token e dados do usuário
        return Response({
            'token': str(token.access_token),  # Retorna o access token
            'user': CustomUserSerializer(user).data
        }, status=status.HTTP_200_OK)

# Visualizar os detalhes do usuário logado
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]  # Apenas usuários logados podem acessar

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)

# Adicione esta view ao arquivo views.py
class AdminUserListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        users = CustomUser.objects.all().order_by('-date_joined')
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data)
    
    # View para atualizar o status de um usuário
class UpdateUserStatusView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        user = get_object_or_404(CustomUser, pk=pk)
        status = request.data.get('status')
        if status not in ['Pendente', 'Aprovado', 'Reprovado', 'Bloqueado']:
            return Response({"error": "Status inválido"}, status=status.HTTP_400_BAD_REQUEST)
        
        user.status = status
        user.save()
        return Response({"message": f"Status do usuário alterado para {status}"})
    
# Profile do usuário
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Apenas usuários logados podem acessar

    def get(self, request):
        """Retorna os dados do usuário logado"""
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        """Permite que o usuário edite seu próprio perfil"""
        user = request.user
        serializer = CustomUserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            # Se o usuário estiver alterando a senha, tratamos corretamente
            if "password" in request.data:
                user.set_password(request.data["password"])
                user.save()
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Listagem de reservas para administradores
class AdminReservationListView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
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

# Listagem de reservas para usuário comum
class UserReservationListView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reservation.objects.filter(
            user=self.request.user,
            final_date__gte=now().date(),
            is_deleted=False
        ).order_by('-initial_date')

# Criação de reservas
class CreateReservationView(generics.CreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Define o status inicial baseado no tipo de recurso
        resource_type = serializer.validated_data['resource_type']
        initial_status = 'Aprovado' if resource_type == 'meeting_room' else 'Pendente'
        
        serializer.save(
            user=self.request.user,
            status=initial_status
        )

# Aprovar/Reprovar reserva
class UpdateReservationStatusView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        reservation = get_object_or_404(Reservation, pk=pk)
        status_choice = request.data.get('status')
        if status_choice not in ['Aprovado', 'Reprovado']:
            return Response({"error": "Status inválido."}, status=status.HTTP_400_BAD_REQUEST)
        reservation.status = status_choice
        reservation.save()
        return Response({"message": f"Reserva {status_choice.lower()} com sucesso."}, status=status.HTTP_200_OK)

# Cancelar reserva (marcar como deletada)
class CancelReservationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        reservation = get_object_or_404(Reservation, pk=pk, user=request.user, is_deleted=False)
        reservation.is_deleted = True
        reservation.save()
        return Response({"message": "Reserva cancelada com sucesso."}, status=status.HTTP_200_OK)

# View para buscar datas ocupadas de um recurso
class OccupiedDatesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, resource_type, resource_id):
        try:
            # Mapeia o tipo de recurso para o campo correto
            resource_field = {
                'auditorium': 'auditorium_id',
                'meeting_room': 'meeting_room_id',
                'vehicle': 'vehicle_id'
            }.get(resource_type)

            if not resource_field:
                return Response(
                    {"error": "Tipo de recurso inválido"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Busca as reservas do recurso
            reservations = Reservation.objects.filter(
                **{resource_field: resource_id},
                status='Aprovado',
                final_date__gte=now().date(),
                is_deleted=False
            ).values('initial_date', 'final_date', 'initial_time', 'final_time')

            # Formata as datas para retornar
            occupied_dates = []
            for reservation in reservations:
                occupied_dates.append({
                    'date': reservation['initial_date'],
                    'initial_time': reservation['initial_time'],
                    'final_time': reservation['final_time']
                })

            return Response(occupied_dates)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
