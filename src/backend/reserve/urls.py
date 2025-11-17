# reserve/urls.py

from django.urls import path
from rest_framework_simplejwt import views as jwt_views

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
    DeleteAccountView,
    AuditoriumAdminView,
    AuditoriumDetailAdminView,
    MeetingRoomAdminView,
    MeetingRoomDetailAdminView,
    VehicleAdminView,
    VehicleDetailAdminView,
    OccupiedDatesView,
    AdminUserListView,
    UpdateUserStatusView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    PasswordResetValidateView
)

urlpatterns = [
    # --- Autenticação e Usuário ---
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'), 
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path("user/", UserDetailView.as_view(), name="user-detail"),
    path("user/profile/", UserProfileView.as_view(), name="user-profile"),
    path("user/delete/", DeleteAccountView.as_view(), name="user-delete-account"),
    path('auth/password/forgot/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('auth/password/reset/validate/', PasswordResetValidateView.as_view(), name='password-reset-validate'),
    path('auth/password/reset/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('user/reservations/create/', CreateReservationView.as_view(), name='create-reservation'),
    path('admin/reservations/', AdminReservationListView.as_view(), name='admin-reservation-list'),
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:pk>/status/', UpdateUserStatusView.as_view(), name='update-user-status'),
    path('admin/reservations/<int:pk>/status/', UpdateReservationStatusView.as_view(), name='update-reservation-status'),
    path('user/reservations/', UserReservationListView.as_view(), name='user-reservation-list'),
    path('user/reservations/<int:pk>/cancel/', CancelReservationView.as_view(), name='cancel-reservation'),
    path('resources/auditoriums/', AuditoriumAdminView.as_view(), name='auditoriums'),
    path('resources/meeting-rooms/', MeetingRoomAdminView.as_view(), name='meeting-rooms'),
    path('resources/vehicles/', VehicleAdminView.as_view(), name='vehicles'),
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
