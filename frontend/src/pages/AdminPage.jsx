import { useEffect, useState } from "react";

function AdminPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          throw new Error('Erro ao carregar dados do administrador');
        }
        const userData = await response.json();
        setUsername(userData.username);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        setError("Não foi possível carregar os dados do administrador");
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
      <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text mb-6">
        Painel Administrativo
      </h1>
      <h2 className="text-xl mb-4">Bem-vindo, {username}!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-2">Gerenciar Reservas</h3>
          <p className="text-gray-600">Visualize e gerencie todas as reservas</p>
          <a href="/admin/reservations" className="text-blue-600 hover:underline mt-2 inline-block">
            Acessar →
          </a>
        </div>

        <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-2">Gerenciar Usuários</h3>
          <p className="text-gray-600">Administre os usuários do sistema</p>
          <a href="/admin/users" className="text-blue-600 hover:underline mt-2 inline-block">
            Acessar →
          </a>
        </div>

        <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-2">Gerenciar Recursos</h3>
          <p className="text-gray-600">Configure os recursos disponíveis</p>
          <a href="/admin/resources" className="text-blue-600 hover:underline mt-2 inline-block">
            Acessar →
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
