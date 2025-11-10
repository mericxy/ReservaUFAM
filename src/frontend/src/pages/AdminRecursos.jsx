import React, { useState, useEffect } from 'react';
import MessagePopup from '../components/MessagePopup';
import { apiFetch } from '../../api';

function AdminRecursos() {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formModified, setFormModified] = useState(false);
  const [selectedType, setSelectedType] = useState('auditorium');
  const [newResource, setNewResource] = useState({
    name: '',
    location: '',
    capacity: '',
    model: '',
    plate_number: ''
  });

  const [resources, setResources] = useState({
    auditorium: [],
    meeting_room: [],
    vehicle: []
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const token = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const results = await Promise.allSettled([
        apiFetch("/api/auditorium-admin/", { headers }),
        apiFetch("/api/meeting-room-admin/", { headers }),
        apiFetch("/api/vehicle-admin/", { headers }),
      ]);

      const auditoriumData =
        results[0].status === "fulfilled" ? results[0].value : [];
      const meetingRoomData =
        results[1].status === "fulfilled" ? results[1].value : [];
      const vehicleData =
        results[2].status === "fulfilled" ? results[2].value : [];

      if (
        results.every((r) => r.status === "rejected")
      ) {
        throw new Error("Nenhum recurso pôde ser carregado.");
      }

      setResources({
        auditorium: auditoriumData,
        meeting_room: meetingRoomData,
        vehicle: vehicleData
      });
    } catch (error) {
      handleError("Erro ao carregar recursos. Por favor, tente novamente mais tarde.");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource(prev => ({ ...prev, [name]: value }));
    setFormModified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formModified) return;

    try {
      const resourceType =
        selectedType === "meeting_room"
          ? "meeting-room-admin"
          : `${selectedType}-admin`;

      const token = localStorage.getItem("accessToken");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      await apiFetch(`/api/${resourceType}/`, {
        method: "POST",
        headers,
        body: JSON.stringify(newResource),
      });

      handleSuccess("Recurso adicionado com sucesso!");
      fetchResources();
      setNewResource({
        name: "",
        location: "",
        capacity: "",
        model: "",
        plate_number: "",
      });
      setFormModified(false);
    } catch (error) {

      // Detecção específica de token expirado
      if (error.message.includes("401")) {
        handleError("Sua sessão expirou. Faça login novamente.");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
        return;
      }
      handleError("Erro ao adicionar recurso");
    }
  };

  const handleDelete = async (id, type) => {
    try {
      const resourceType =
        type === "meeting_room" ? "meeting-room-admin" : `${type}-admin`;

      const token = localStorage.getItem("accessToken");

      await apiFetch(`/api/${resourceType}/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleSuccess("Recurso removido com sucesso!");
      fetchResources();
    } catch (error) {

      if (error.message.includes("401")) {
        handleError("Sua sessão expirou. Faça login novamente.");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
        return;
      }

      handleError("Erro ao remover recurso");
    }
  };

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
        Gerenciar Recursos
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Adicionar Novo Recurso</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Recurso
                <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="auditorium">Auditório</option>
                <option value="meeting_room">Sala de Reunião</option>
                <option value="vehicle">Veículo</option>
              </select>
            </div>

            {selectedType !== 'vehicle' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newResource.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={newResource.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={newResource.model}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Placa
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="plate_number"
                    value={newResource.plate_number}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacidade
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="capacity"
              value={newResource.capacity}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!formModified}
              className={`font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md
                ${formModified 
                  ? 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Adicionar Recurso
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Recursos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Auditórios */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Auditórios</h2>
          <div className="space-y-3">
            {resources.auditorium.length > 0 ? (
              resources.auditorium.map(resource => (
                <div key={resource.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{resource.name}</h3>
                      <p className="text-sm text-gray-600">Local: {resource.location}</p>
                      <p className="text-sm text-gray-600">Capacidade: {resource.capacity} pessoas</p>
                    </div>
                    <button
                      onClick={() => handleDelete(resource.id, 'auditorium')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum auditório cadastrado</p>
            )}
          </div>
        </div>

        {/* Salas de Reunião */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Salas de Reunião</h2>
          <div className="space-y-3">
            {resources.meeting_room.length > 0 ? (
              resources.meeting_room.map(resource => (
                <div key={resource.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{resource.name}</h3>
                      <p className="text-sm text-gray-600">Local: {resource.location}</p>
                      <p className="text-sm text-gray-600">Capacidade: {resource.capacity} pessoas</p>
                    </div>
                    <button
                      onClick={() => handleDelete(resource.id, 'meeting_room')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma sala de reunião cadastrada</p>
            )}
          </div>
        </div>

        {/* Veículos */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Veículos</h2>
          <div className="space-y-3">
            {resources.vehicle.length > 0 ? (
              resources.vehicle.map(resource => (
                <div key={resource.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{resource.model}</h3>
                      <p className="text-sm text-gray-600">Placa: {resource.plate_number}</p>
                      <p className="text-sm text-gray-600">Capacidade: {resource.capacity} pessoas</p>
                    </div>
                    <button
                      onClick={() => handleDelete(resource.id, 'vehicle')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum veículo cadastrado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRecursos;