import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("http://127.0.0.1:8000/api/admin/reservations/", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar reservas');
            }

            const data = await response.json();

            const pendentes = data.filter(res => res.status === 'Pendente');
            const aprovadas = data.filter(res => res.status === 'Aprovado');
            const arquivadas = data.filter(res => res.status === 'Reprovado');

            setReservations({ pendentes, aprovadas, arquivadas });
        } catch (error) {
            console.error('Erro:', error);
            setError("Não foi possível carregar as reservas");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (reservationId, newStatus) => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`http://127.0.0.1:8000/api/admin/reservations/${reservationId}/status/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar status');
            }

            fetchReservations();
        } catch (error) {
            console.error('Erro:', error);
            setError("Erro ao atualizar o status da reserva");
        }
    };

    const renderReservationCard = (reservation, actions) => (
        <div key={reservation.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex justify-between">
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">Reserva #{reservation.id}</h3>
                    <div className="mt-2 space-y-1 text-sm">
                        <p><span className="font-medium text-gray-700">Recurso:</span> {reservation.auditorium?.name || reservation.meeting_room?.name || reservation.vehicle?.model}</p>
                        <p><span className="font-medium text-gray-700">Solicitante:</span> {reservation.user?.username}</p>
                        <p><span className="font-medium text-gray-700">Data Inicial:</span> {new Date(reservation.initial_date).toLocaleDateString()}</p>
                        <p><span className="font-medium text-gray-700">Data Final:</span> {new Date(reservation.final_date).toLocaleDateString()}</p>
                        <p><span className="font-medium text-gray-700">Horário:</span> {reservation.initial_time} - {reservation.final_time}</p>
                        <p>
                            <span className="font-medium text-gray-700">Status:</span>
                            <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                                reservation.status === 'Aprovado' 
                                    ? 'bg-green-100 text-green-800' 
                                    : reservation.status === 'Pendente'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
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
                {/* Reservas Pendentes */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Reservas Pendentes</h2>
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
                            <p className="text-gray-500 text-center py-4">Nenhuma reserva pendente</p>
                        )}
                    </div>
                </div>

                {/* Reservas Aprovadas */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Reservas Aprovadas</h2>
                    <div className="space-y-4">
                        {reservations.aprovadas.length > 0 ? (
                            reservations.aprovadas.map(reservation =>
                                renderReservationCard(reservation, null)
                            )
                        ) : (
                            <p className="text-gray-500 text-center py-4">Nenhuma reserva aprovada</p>
                        )}
                    </div>
                </div>

                {/* Reservas Arquivadas */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Reservas Arquivadas</h2>
                    <div className="space-y-4">
                        {reservations.arquivadas.length > 0 ? (
                            reservations.arquivadas.map(reservation =>
                                renderReservationCard(reservation, (
                                    <button onClick={() => handleStatusUpdate(reservation.id, 'Aprovado')}
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg">
                                        Restaurar
                                    </button>
                                ))
                            )
                        ) : (
                            <p className="text-gray-500 text-center py-4">Nenhuma reserva arquivada</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminReservations;
