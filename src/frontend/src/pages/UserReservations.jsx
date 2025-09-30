import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";

function UserReservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }

        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch("http://127.0.0.1:8000/api/user/reservations/", {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Erro ao buscar reservas');
                }
                
                const data = await response.json();
                setReservations(data);
            } catch (error) {
                console.error('Erro:', error);
                setError("Não foi possível carregar suas reservas");
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [isAuthenticated, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <BackButton />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
                    Minhas Reservas
                </h1>
                
                {error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reservations.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <p className="text-gray-600 mb-4">Você ainda não possui reservas.</p>
                                <a 
                                    href="/reservations/create" 
                                    className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                                >
                                    Fazer uma Reserva
                                </a>
                            </div>
                        ) : (
                            reservations.map((reservation) => (
                                <div key={reservation.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-lg">
                                            {reservation.auditorium?.name || 
                                             reservation.meeting_room?.name || 
                                             reservation.vehicle?.model}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                                            ${reservation.status === 'Aprovado' ? 'bg-green-100 text-green-800' : 
                                              reservation.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-red-100 text-red-800'}`}>
                                            {reservation.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div>
                                            <p><span className="font-medium">Data Inicial:</span> {new Date(reservation.initial_date).toLocaleDateString()}</p>
                                            <p><span className="font-medium">Hora Inicial:</span> {reservation.initial_time}</p>
                                        </div>
                                        <div>
                                            <p><span className="font-medium">Data Final:</span> {new Date(reservation.final_date).toLocaleDateString()}</p>
                                            <p><span className="font-medium">Hora Final:</span> {reservation.final_time}</p>
                                        </div>
                                    </div>
                                    {reservation.description && (
                                        <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            <span className="font-medium">Descrição:</span> {reservation.description}
                                        </p>
                                    )}
                                    {reservation.status === 'Pendente' && (
                                        <div className="mt-4 flex justify-end">
                                            <button 
                                                onClick={() => handleCancelReservation(reservation.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                                            >
                                                Cancelar Reserva
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserReservations;