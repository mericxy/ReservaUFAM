import React, { useEffect, useState } from "react";
import { apiFetch } from "../../api";

function ActivityIndicator() {
  const [lastActivity, setLastActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLastActivity();
    
    // Atualizar a cada minuto
    const interval = setInterval(fetchLastActivity, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchLastActivity = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const data = await apiFetch("/api/admin/reservations/", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (data && data.length > 0) {
        // Ordenar por data de criação e pegar a mais recente
        const sortedReservations = data.sort((a, b) => 
          new Date(b.created_at || b.initial_date) - new Date(a.created_at || a.initial_date)
        );
        setLastActivity(sortedReservations[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar última atividade:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const activityDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Agora";
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprovado': return 'text-green-600';
      case 'Pendente': return 'text-yellow-600';
      case 'Reprovado': return 'text-red-600';
      default: return 'text-[rgb(var(--color-text-grays))]';
    }
  };

  if (loading || !lastActivity) {
    return (
      <div className="flex items-center space-x-2 text-sm text-[rgb(var(--color-text-grays))]">
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        <span>Carregando atividade...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      <span className="text-[rgb(var(--color-text))]">
        Última reserva: 
        <span className={`ml-1 font-medium ${getStatusColor(lastActivity.status)}`}>
          {lastActivity.status}
        </span>
        <span className="text-[rgb(var(--color-text-grays))] ml-1">
          • {getTimeAgo(lastActivity.created_at || lastActivity.initial_date)}
        </span>
      </span>
    </div>
  );
}

export default ActivityIndicator;