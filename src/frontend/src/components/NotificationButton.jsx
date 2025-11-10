import React, { useEffect, useState } from "react";
import { apiFetch } from "../../api";

function NotificationButton({ onClick, className = "" }) {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingReservations();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchPendingReservations, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchPendingReservations = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const data = await apiFetch("/api/admin/reservations/", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const pendingReservations = data.filter(res => res.status === 'Pendente');
      setPendingCount(pendingReservations.length);
    } catch (error) {
      console.error("Erro ao carregar reservas pendentes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-all duration-200 ${className}`}
      title="Ver últimas reservas"
    >
      <svg
        className="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 16"
      >
        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
      </svg>
      <span className="sr-only">Notificações</span>
      
      {!loading && pendingCount > 0 && (
        <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2">
          {pendingCount > 99 ? '99+' : pendingCount}
        </div>
      )}
    </button>
  );
}

export default NotificationButton;