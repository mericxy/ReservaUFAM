import React, { useEffect, useState } from "react";
import { apiFetch } from "../../api";

function RecentReservations({ onClose, isOpen }) {
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchRecentReservations();
    }
  }, [isOpen]);

  const fetchRecentReservations = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const data = await apiFetch("/api/admin/reservations/", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Ordenar por data de criação (mais recentes primeiro) e pegar apenas as 10 últimas
      const sortedReservations = data.sort((a, b) => new Date(b.created_at || b.initial_date) - new Date(a.created_at || a.initial_date));
      setRecentReservations(sortedReservations.slice(0, 10));
    } catch (error) {
      setError("Não foi possível carregar as reservas recentes");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Reprovado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-[rgb(var(--color-text))]';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay com blur */}
      <div className="fixed inset-0 backdrop-blur-sm z-40"></div>
      
      {/* Popup Centralizado */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-[rgb(var(--color-bg))] rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden border-theme">
          <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
              📋 Últimas Reservas
            </h2>
            <button
              onClick={onClose}
              className="text-[rgb(var(--color-text-grays))] hover:text-[rgb(var(--color-text))] text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[calc(85vh-120px)]">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-[rgb(var(--color-text-grays))]">Carregando reservas recentes...</div>
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-8">{error}</div>
            ) : recentReservations.length === 0 ? (
              <div className="text-[rgb(var(--color-text-grays))] text-center py-8">
                Nenhuma reserva encontrada
              </div>
            ) : (
              <div className="space-y-4">
                {recentReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="bg-[rgb(var(--color-bg))] border-theme rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-[rgb(var(--color-text))]">
                          Reserva #{reservation.id}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(reservation.status)}`}
                        >
                          {reservation.status}
                        </span>
                      </div>
                      <span className="text-xs text-[rgb(var(--color-text-grays))]">
                        {formatDateTime(reservation.created_at || reservation.initial_date)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p>
                          <span className="font-medium text-[rgb(var(--color-text-grays))]">Recurso:</span>{" "}
                          {reservation.auditorium?.name || 
                           reservation.meeting_room?.name || 
                           reservation.vehicle?.model || "Não especificado"}
                        </p>
                        <p>
                          <span className="font-medium text-[rgb(var(--color-text-grays))]">Solicitante:</span>{" "}
                          {reservation.user?.username || "Não informado"}
                        </p>
                        <p>
                          <span className="font-medium text-[rgb(var(--color-text-grays))]">Email:</span>{" "}
                          {reservation.user?.email || "Não informado"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p>
                          <span className="font-medium text-[rgb(var(--color-text-grays))]">Data Inicial:</span>{" "}
                          {new Date(reservation.initial_date).toLocaleDateString('pt-BR')}
                        </p>
                        <p>
                          <span className="font-medium text-[rgb(var(--color-text-grays))]">Data Final:</span>{" "}
                          {new Date(reservation.final_date).toLocaleDateString('pt-BR')}
                        </p>
                        <p>
                          <span className="font-medium text-[rgb(var(--color-text-grays))]">Horário:</span>{" "}
                          {reservation.initial_time} - {reservation.final_time}
                        </p>
                      </div>
                    </div>

                    {reservation.purpose && (
                      <div className="mt-3 pt-3 border-t border-theme">
                        <p className="text-sm">
                          <span className="font-medium text-[rgb(var(--color-text-grays))]">Finalidade:</span>{" "}
                          {reservation.purpose}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-[rgb(var(--color-bg))] flex justify-between items-center">
            <p className="text-sm text-[rgb(var(--color-text-grays))]">
              Mostrando as {recentReservations.length} reservas mais recentes
            </p>
            <div className="space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[rgb(var(--color-bg))]0 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
              <a
                href="/admin/reservations"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Ver Todas
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecentReservations;