import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Erro ao buscar usuário: ${response.status}`);
        }
        const userData = await response.json();
        setUsername(userData.username);
      } catch (error) {
        console.error(error);
        setError("Erro ao carregar dados do usuário");
      }
    };

    const fetchReservations = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user/reservations/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Erro ao buscar reservas: ${response.status}`);
        }
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error('Erro ao buscar reservas:', error);
        setError("Erro ao carregar suas reservas");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchReservations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho com boas-vindas */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
            Bem-vindo, {username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas reservas e faça novas solicitações
          </p>

        {/* Cards de Ação Rápida */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/reservations/create" 
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-green-600 text-xl mb-2">Nova Reserva</div>
            <p className="text-gray-600">Faça uma nova solicitação de reserva</p>
          </Link>

          <Link to="/reservations" 
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-blue-600 text-xl mb-2">Minhas Reservas</div>
            <p className="text-gray-600">Visualize e gerencie suas reservas</p>
          </Link>

          <Link to="/user/profile" 
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-purple-600 text-xl mb-2">Meu Perfil</div>
            <p className="text-gray-600">Atualize suas informações</p>
          </Link>
        </div>

        {/* Seção de Reservas Recentes */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Reservas Recentes</h2>
          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}
          {reservations.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              <p>Você ainda não possui reservas.</p>
              <Link to="/reservations/create" 
                className="text-green-600 hover:text-green-700 font-medium mt-2 inline-block">
                Fazer primeira reserva →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.slice(0, 5).map((reservation, index) => (
                <div key={index} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">
                        {reservation.auditorium?.name || 
                        reservation.meeting_room?.name || 
                        reservation.vehicle?.model}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(reservation.initial_date).toLocaleDateString()} - {reservation.initial_time}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${reservation.status === 'Aprovado' ? 'bg-green-100 text-green-800' : 
                        reservation.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {reservation.status}
                    </span>
                  </div>
                </div>
              ))}
              {reservations.length > 5 && (
                <Link to="/reservations" 
                  className="text-blue-600 hover:text-blue-700 font-medium block text-center mt-4">
                  Ver todas as reservas →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    
    </div>
  );
}

export default Home;
