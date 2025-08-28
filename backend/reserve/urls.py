from django.urls import path
from . import views
from .views import (
    RegisterView,
    LoginView,
    CreateReservationView,
    AdminReservationListView,
    UpdateReservationStatusView,
    UserReservationListView,
    CancelReservationView,
    UserDetailView,
    UserProfileView,
    AuditoriumAdminView,
    AuditoriumDetailAdminView,
    MeetingRoomAdminView,
    MeetingRoomDetailAdminView,
    VehicleAdminView,
    VehicleDetailAdminView,
    OccupiedDatesView,
    CustomTokenObtainPairView,
    AdminUserListView,
    UpdateUserStatusView
)
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    # Home
    path('', views.index, name='index'),

    # Cadastro de usuário
    path('register/', RegisterView.as_view(), name='register'),

    # Login de usuário (token) - Para obter token
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

    # Visualizar os detalhes do usuário logado
    path("user/", UserDetailView.as_view(), name="user-detail"),  # Nova rota para pegar o usuário logado
    
    # Profile do usuário
    path("user/profile/", UserProfileView.as_view(), name="user-profile"),

    # Solicitação de reserva
    path('user/reservations/create/', CreateReservationView.as_view(), name='create-reservation'),

    # Lista de reservas para administradores
    path('admin/reservations/', AdminReservationListView.as_view(), name='admin-reservation-list'),

    # Lista de usuários para administradores
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),

    # Atualizar status de um usuário
    path('admin/users/<int:pk>/status/', UpdateUserStatusView.as_view(), name='update-user-status'),

    # Aprovar/Reprovar reserva (admin)
    path('admin/reservations/<int:pk>/status/', UpdateReservationStatusView.as_view(), name='update-reservation-status'),

    # Lista de reservas do usuário logado
    path('user/reservations/', UserReservationListView.as_view(), name='user-reservation-list'),

    # Cancelar reserva
    path('user/reservations/<int:pk>/cancel/', CancelReservationView.as_view(), name='cancel-reservation'),

    # Rotas para visualização de recursos (usuários comuns)
    path('resources/auditoriums/', AuditoriumAdminView.as_view(), name='auditoriums'),
    path('resources/meeting-rooms/', MeetingRoomAdminView.as_view(), name='meeting-rooms'),
    path('resources/vehicles/', VehicleAdminView.as_view(), name='vehicles'),

    # Rotas para gerenciamento de recursos (admin)
    path('auditorium-admin/', AuditoriumAdminView.as_view(), name='auditorium-admin'),
    path('auditorium-admin/<int:pk>/', AuditoriumDetailAdminView.as_view(), name='auditorium-detail-admin'),
    
    path('meeting-room-admin/', MeetingRoomAdminView.as_view(), name='meeting-room-admin'),
    path('meeting-room-admin/<int:pk>/', MeetingRoomDetailAdminView.as_view(), name='meeting-room-detail-admin'),
    
    path('vehicle-admin/', VehicleAdminView.as_view(), name='vehicle-admin'),
    path('vehicle-admin/<int:pk>/', VehicleDetailAdminView.as_view(), name='vehicle-detail-admin'),

    # Rota para buscar datas ocupadas de um recurso
    path('resources/occupied-dates/<str:resource_type>/<int:resource_id>/', 
         OccupiedDatesView.as_view(), 
         name='occupied-dates'),
]
