import React, { useEffect, useState } from "react";
import { apiFetch } from "../../api";

function ReservationSummaryCard() {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReservationStats();
  }, []);

  const fetchReservationStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const data = await apiFetch("/api/admin/reservations/", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const pending = data.filter(res => res.status === 'Pendente').length;
      const approved = data.filter(res => res.status === 'Aprovado').length;
      const rejected = data.filter(res => res.status === 'Reprovado').length;
      const total = data.length;

      setStats({ pending, approved, rejected, total });
    } catch (error) {
      setError("Erro ao carregar estatísticas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-rgb(var(--color-bg)) rounded-lg shadow hover:shadow-md transition-shadow">
        <h3 className="font-semibold mb-2 text-[rgb(var(--color-text))]">Resumo de Reservas</h3>
        <p className="text-[rgb(var(--color-text-gray))]">Carregando estatísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rgb(var(--color-bg)) rounded-lg shadow hover:shadow-md transition-shadow">
        <h3 className="font-semibold mb-2 text-[rgb(var(--color-text))]">Resumo de Reservas</h3>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-rgb(var(--color-bg)) border-theme rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[rgb(var(--color-text))]">Resumo de Reservas</h3>
        
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-[rgb(var(--color-text))]">Pendentes</span>
          </div>
          <span className="font-semibold text-yellow-600">{stats.pending}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-[rgb(var(--color-text))]">Aprovadas</span>
          </div>
          <span className="font-semibold text-green-600">{stats.approved}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-[rgb(var(--color-text))]">Reprovadas</span>
          </div>
          <span className="font-semibold text-red-600">{stats.rejected}</span>
        </div>

        <hr className="my-2 text-[rgb(var(--color-text))]" />

        <div className="flex justify-between items-center">
          <span className="font-medium text-[rgb(var(--color-text))]">Total</span>
          <span className="font-bold text-[rgb(var(--color-text))]">{stats.total}</span>
        </div>
      </div>

      <a 
        href="/admin/reservations" 
        className="text-blue-600 hover:underline mt-3 inline-block text-sm"
      >
        Ver detalhes →
      </a>
    </div>
  );
}

export default ReservationSummaryCard;