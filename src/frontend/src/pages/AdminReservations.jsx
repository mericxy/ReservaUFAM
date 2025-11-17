import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../../api";

const formatDateToLocal = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.toLocaleDateString('pt-BR');
};

function AdminReservations() {
    const [reservations, setReservations] = useState({
        pendentes: [],
        aprovadas: [],
        arquivadas: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin } = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            navigate('/');
            return;
        }
        fetchReservations();
    }, [isAuthenticated, isAdmin, navigate]);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("accessToken");
            const headers = { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const [pendentesRes, aprovadasRes, arquivadasRes] = await Promise.allSettled([
                apiFetch("/api/admin/reservations/?status=Pendente", { headers }),
                apiFetch("/api/admin/reservations/?status=Aprovado", { headers }),
                apiFetch("/api/admin/reservations/?status=Reprovado", { headers })
            ]);

            const pendentes = pendentesRes.status === 'fulfilled' ? pendentesRes.value : [];
            const aprovadas = aprovadasRes.status === 'fulfilled' ? aprovadasRes.value : [];
            const arquivadas = arquivadasRes.status === 'fulfilled' ? arquivadasRes.value : [];

            setReservations({ pendentes, aprovadas, arquivadas });

        } catch (error) {
            setError("Não foi possível carregar as reservas. Verifique sua conexão com a internet e tente novamente.");
            if (error.message.includes("401")) {
                setError("Sua sessão expirou por inatividade. Faça login novamente para continuar.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (reservationId, newStatus) => {
        try {
            const token = localStorage.getItem("accessToken");
            await apiFetch(`/api/admin/reservations/${reservationId}/status/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            fetchReservations();
        } catch (error) {
            setError("Erro ao atualizar o status da reserva. Verifique sua conexão com a internet e tente novamente.");
            if (error.message.includes("401")) {
                setError("Sua sessão expirou por inatividade. Faça login novamente para continuar.");
            }
        }
    };

    const renderReservationCard = (reservation, actions) => (
        <div key={reservation.id} className="bg-[rgb(var(--color-bg))] p-4 rounded-lg shadow-md border-theme mb-4">
            <div className="flex justify-between">
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[rgb(var(--color-text))]">Reserva #{reservation.id}</h3>
                    <div className="mt-2 space-y-1 text-sm">
                        <p className='text-[rgb(var(--color-text-grays))]'><span className="font-medium text-[rgb(var(--color-text))]">Recurso:</span> {reservation.auditorium?.name || reservation.meeting_room?.name || reservation.vehicle?.model}</p>
                        <p className='text-[rgb(var(--color-text-grays))]'><span className="font-medium text-[rgb(var(--color-text))]">Solicitante:</span> {reservation.user?.username}</p>
                        <p className='text-[rgb(var(--color-text-grays))]'><span className="font-medium text-[rgb(var(--color-text))]">Data Inicial:</span> {formatDateToLocal(reservation.initial_date)}</p>
                        <p className='text-[rgb(var(--color-text-grays))]'><span className="font-medium text-[rgb(var(--color-text))]">Data Final:</span> {formatDateToLocal(reservation.final_date)}</p>
                        <p className='text-[rgb(var(--color-text-grays))]'><span className="font-medium text-[rgb(var(--color-text))]">Horário:</span> {reservation.initial_time} - {reservation.final_time}</p>
                        <p className='text-[rgb(var(--color-text-grays))]'>
                            <span className="font-medium text-[rgb(var(--color-text))]">Status:</span>
                            <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                                reservation.status === 'Aprovado' 
                                    ? 'bg-green-100 text-green-800' 
                                    : reservation.status === 'Pendente'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                            }`}>
                                {reservation.status}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="ml-4 flex flex-col space-y-2">
                    {actions}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
                Gerenciar Reservas
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[rgb(var(--color-bg))] p-6 rounded-xl shadow-lg border-theme">
                    <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--color-text))]">Reservas Pendentes</h2>
                    <div className="space-y-4">
                        {reservations.pendentes.length > 0 ? (
                            reservations.pendentes.map(reservation =>
                                renderReservationCard(reservation, (
                                    <>
                                        <button onClick={() => handleStatusUpdate(reservation.id, 'Aprovado')}
                                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-lg">
                                            Aprovar
                                        </button>
                                        <button onClick={() => handleStatusUpdate(reservation.id, 'Reprovado')}
                                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg">
                                            Reprovar
                                        </button>
                                    </>
                                ))
                            )
                        ) : (
                            <p className="text-[rgb(var(--color-text-grays))] text-center py-4">Nenhuma reserva pendente</p>
                        )}
                    </div>
                </div>

                <div className="bg-[rgb(var(--color-bg))] p-6 rounded-xl shadow-lg border-theme">
                    <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--color-text))]">Reservas Aprovadas</h2>
                    <div className="space-y-4">
                        {reservations.aprovadas.length > 0 ? (
                            reservations.aprovadas.map(reservation =>
                                renderReservationCard(reservation, (
                                    <button onClick={() => handleStatusUpdate(reservation.id, 'Reprovado')}
                                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg">
                                        Cancelar
                                    </button>
                                ))
                            )
                        ) : (
                            <p className="text-[rgb(var(--color-text-grays))] text-center py-4">Nenhuma reserva aprovada</p>
                        )}
                    </div>
                </div>

                <div className="bg-[rgb(var(--color-bg))] p-6 rounded-xl shadow-lg border-theme">
                    <h2 className="text-xl font-semibold mb-4 text-[rgb(var(--color-text))]">Reservas Arquivadas</h2>
                    <div className="space-y-4">
                        {reservations.arquivadas.length > 0 ? (
                            reservations.arquivadas.map(reservation =>
                                renderReservationCard(reservation, (
                                    <button onClick={() => handleStatusUpdate(reservation.id, 'Aprovado')}
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg">
                                        Restaurar (Aprovar)
                                    </button>
                                ))
                            )
                        ) : (
                            <p className="text-[rgb(var(--color-text-grays))] text-center py-4">Nenhuma reserva arquivada</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminReservations;