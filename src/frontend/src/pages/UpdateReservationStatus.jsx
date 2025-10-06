import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function UpdateReservationStatus() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin } = useAuth();
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            navigate('/');
            return;
        }

        const fetchReservation = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch(`http://127.0.0.1:8000/api/admin/reservations/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Erro ao buscar reserva');
                }
                
                const data = await response.json();
                setReservation(data);
            } catch (error) {
                console.error('Erro:', error);
                setError("Não foi possível carregar os dados da reserva");
            } finally {
                setLoading(false);
            }
        };

        fetchReservation();
    }, [id, isAuthenticated, isAdmin, navigate]);

    const handleStatusUpdate = async (newStatus) => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`http://127.0.0.1:8000/api/admin/reservations/${id}/status/`, {
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

            navigate('/admin/reservations');
        } catch (error) {
            console.error('Erro:', error);
            setError("Erro ao atualizar o status da reserva");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="absolute left-5 top-20">
                <a href="/admin/reservations" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="36" fill="currentColor" className="bi bi-arrow-left-short" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/>
                    </svg>
                </a>
            </div>

            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
                Atualizar Status da Reserva
            </h1>

            {error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            ) : reservation ? (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Detalhes da Reserva #{reservation.id}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <p><span className="font-medium">Solicitante:</span> {reservation.user?.username}</p>
                                <p><span className="font-medium">Status Atual:</span> {reservation.status}</p>
                                <p><span className="font-medium">Data Inicial:</span> {new Date(reservation.initial_date).toLocaleDateString()}</p>
                                <p><span className="font-medium">Data Final:</span> {new Date(reservation.final_date).toLocaleDateString()}</p>
                                <p><span className="font-medium">Hora Inicial:</span> {reservation.initial_time}</p>
                                <p><span className="font-medium">Hora Final:</span> {reservation.final_time}</p>
                            </div>
                            <div className="mt-4">
                                <p className="font-medium">Descrição:</p>
                                <p className="mt-2 text-gray-600">{reservation.description}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => handleStatusUpdate('Aprovado')}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors duration-300">
                                Aprovar
                            </button>
                            <button
                                onClick={() => handleStatusUpdate('Reprovado')}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors duration-300">
                                Reprovar
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-600">Reserva não encontrada.</p>
            )}
        </div>
    );
}

export default UpdateReservationStatus;
