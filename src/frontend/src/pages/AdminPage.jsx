import { useEffect, useState } from "react";
import { apiFetch } from "../../api";
import NotificationButton from "../components/NotificationButton";
import RecentReservations from "../components/RecentReservations";
import ReservationSummaryCard from "../components/ReservationSummaryCard";
import ActivityIndicator from "../components/ActivityIndicator";

function AdminPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRecentReservations, setShowRecentReservations] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const userData = await apiFetch("/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(userData.username);
      } catch (error) {
        setError("Não foi possível carregar os dados do administrador. Verifique sua conexão com a internet e tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
            Painel Administrativo
          </h1>
          <h2 className="text-xl text-[rgb(var(--color-text))] mt-2">Bem-vindo, {username}!</h2>
          <div className="mt-3 rgb(var(--color-bg))">
            <ActivityIndicator />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <NotificationButton 
            onClick={() => setShowRecentReservations(true)}
            className="shadow-lg"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ReservationSummaryCard />
        
        <div className="p-4 bg-rgb(var(--color-bg)) border-theme rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-2 text-[rgb(var(--color-text))]">Gerenciar Reservas</h3>
          <p className="text-[rgb(var(--color-text-gray))]">Visualize e gerencie todas as reservas</p>
          <a href="/admin/reservations" className="text-blue-600 hover:underline mt-2 inline-block">
            Acessar →
          </a>
        </div>

        <div className="p-4 bg-rgb(var(--color-bg)) border-theme rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-2 text-[rgb(var(--color-text))]">Gerenciar Usuários</h3>
          <p className="text-[rgb(var(--color-text-gray))]">Administre os usuários do sistema</p>
          <a href="/admin/users" className="text-blue-600 hover:underline mt-2 inline-block">
            Acessar →
          </a>
        </div>

        <div className="p-4 bg-rgb(var(--color-bg)) border-theme rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-2 text-[rgb(var(--color-text))]">Gerenciar Recursos</h3>
          <p className="text-[rgb(var(--color-text-gray))]">Configure os recursos disponíveis</p>
          <a href="/admin/resources" className="text-blue-600 hover:underline mt-2 inline-block">
            Acessar →
          </a>
        </div>
      </div>
      
      <RecentReservations
        isOpen={showRecentReservations}
        onClose={() => setShowRecentReservations(false)}
      />
    </div>
  );
}

export default AdminPage;
