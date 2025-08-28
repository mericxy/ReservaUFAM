import React, { useState, useEffect } from 'react';
import MessagePopup from '../components/MessagePopup';

function AdminUsuarios() {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [usuarios, setUsuarios] = useState({
    pendentes: [],
    aprovados: [],
    arquivados: []
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    const token = localStorage.getItem("accessToken");
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/users/', { headers });

      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }

      const data = await response.json();
      
      const pendentes = data.filter(user => user.status === 'Pendente')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const aprovados = data.filter(user => user.status === 'Aprovado')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const arquivados = data.filter(user => user.status === 'Reprovado' || user.status === 'Bloqueado')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setUsuarios({
        pendentes,
        aprovados,
        arquivados
      });
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      handleError("Erro ao carregar usuários. Por favor, tente novamente mais tarde.");
    }
  };

  const handleError = (errorMessage) => {
    setMessage({ text: errorMessage, type: 'error' });
  };

  const handleSuccess = (successMessage) => {
    setMessage({ text: successMessage, type: 'success' });
  };

  const clearMessage = () => {
    setMessage({ text: "", type: "" });
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://127.0.0.1:8000/api/admin/users/${userId}/status/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Erro ao atualizar status do usuário');

      handleSuccess(`Usuário ${newStatus.toLowerCase()} com sucesso!`);
      fetchUsuarios();
    } catch (error) {
      console.error('Erro:', error);
      handleError("Erro ao atualizar status do usuário");
    }
  };

  const renderUsuarioCard = (usuario, actions) => (
    <div key={usuario.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">{usuario.username}</h3>
          <div className="mt-2 space-y-1 text-sm">
            <p><span className="font-medium text-gray-700">Email:</span> {usuario.email}</p>
            <p><span className="font-medium text-gray-700">SIAPE:</span> {usuario.siape}</p>
            <p><span className="font-medium text-gray-700">CPF:</span> {usuario.cpf}</p>
            <p><span className="font-medium text-gray-700">Telefone:</span> {usuario.cellphone}</p>
            <p>
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                usuario.status === 'Aprovado' 
                  ? 'bg-green-100 text-green-800' 
                  : usuario.status === 'Pendente'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
              }`}>
                {usuario.status}
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

  return (
    <div className="container mx-auto px-4 py-8">
      {message.text && (
        <MessagePopup
          message={message.text}
          type={message.type}
          onClose={clearMessage}
        />
      )}

      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
        Gerenciar Usuários
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Usuários Pendentes */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Usuários Pendentes</h2>
          <div className="space-y-4">
            {usuarios.pendentes.length > 0 ? (
              usuarios.pendentes.map(usuario => 
                renderUsuarioCard(usuario, (
                  <>
                    <button
                      onClick={() => handleStatusChange(usuario.id, 'Aprovado')}
                      className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-lg"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleStatusChange(usuario.id, 'Reprovado')}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg"
                    >
                      Reprovar
                    </button>
                  </>
                ))
              )
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum usuário pendente</p>
            )}
          </div>
        </div>

        {/* Usuários Aprovados */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Usuários Aprovados</h2>
          <div className="space-y-4">
            {usuarios.aprovados.length > 0 ? (
              usuarios.aprovados.map(usuario => 
                renderUsuarioCard(usuario, (
                  <button
                    onClick={() => handleStatusChange(usuario.id, 'Bloqueado')}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-lg"
                  >
                    Bloquear
                  </button>
                ))
              )
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum usuário aprovado</p>
            )}
          </div>
        </div>

        {/* Usuários Arquivados */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Usuários Arquivados</h2>
          <div className="space-y-4">
            {usuarios.arquivados.length > 0 ? (
              usuarios.arquivados.map(usuario => 
                renderUsuarioCard(usuario, (
                  <button
                    onClick={() => handleStatusChange(usuario.id, 'Aprovado')}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg"
                  >
                    Restaurar
                  </button>
                ))
              )
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum usuário arquivado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsuarios;
