import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import MessagePopup from "../components/MessagePopup";
import { generateTimeOptions } from "../utils/dateUtils";
import { resourceTranslations } from "../constants/reservation";
import { useMessages } from "../hooks/useMessages";
import { useResources } from "../hooks/useResources";
import ResourceSelector from "../components/ResourceSelector";
import TimeSelector from "../components/TimeSelector";
import DateSelector from "../components/DateSelector";
import ReservationDetails from "../components/ReservationDetails";
import { apiFetch } from "../../api";

const initialReservationState = {
  resource_type: "",
  resource_id: "",
  initial_time: "",
  final_time: "",
  description: ""
};

const CreateReservation = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { message, handleError, handleSuccess, clearMessage } = useMessages();

  const [formData, setFormData] = useState(initialReservationState);
  const [selectedDates, setSelectedDates] = useState(undefined);
  const [formModified, setFormModified] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const { resources, occupiedDates } = useResources(formData, handleError);
  const timeOptions = generateTimeOptions();

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    if (name === "initial_time") {
      newFormData.final_time = "";
      setSelectedDates(undefined);
    }
    
    if (name === "final_time") {
        setSelectedDates(undefined);
    }

    if (name === "resource_type") {
      newFormData.resource_id = "";
      newFormData.initial_time = "";
      newFormData.final_time = "";
      setSelectedDates(undefined);
      setSelectedResource(null);
    }

    if (name === "resource_id") {
      const resource = resources[formData.resource_type]?.find(
        (r) => r.id === parseInt(value)
      );
      setSelectedResource(resource);
      newFormData.initial_time = "";
      newFormData.final_time = "";
      setSelectedDates(undefined);
    }

    setFormData(newFormData);
    setFormModified(true);
  };

  const handleDatesChange = (dates) => {
    setSelectedDates(dates);
    setFormModified(true);
  };
  
  const formatDatesToSend = (date) => {
      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = date.getUTCDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formModified) return;

    const requiredFields = ["resource_type", "resource_id", "initial_time", "final_time", "description"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        handleError("Por favor, preencha todos os campos obrigatórios (recurso, horário e descrição).");
        return;
      }
    }

    let datesToSend = [];
    if (selectedDates?.from) {
      if (!selectedDates.to) {
        handleError("Selecione uma data final para o intervalo.");
        return;
      }
      let currentDate = new Date(Date.UTC(
          selectedDates.from.getUTCFullYear(), 
          selectedDates.from.getUTCMonth(), 
          selectedDates.from.getUTCDate()
      ));
      let endDate = new Date(Date.UTC(
          selectedDates.to.getUTCFullYear(), 
          selectedDates.to.getUTCMonth(), 
          selectedDates.to.getUTCDate()
      ));

      while (currentDate <= endDate) {
        datesToSend.push(formatDatesToSend(currentDate));
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      }
    } else if (Array.isArray(selectedDates) && selectedDates.length > 0) {
      datesToSend = selectedDates.map(date => formatDatesToSend(date));
    } else {
      handleError("Por favor, selecione pelo menos um dia no calendário.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        handleError("Sua sessão expirou por inatividade. Faça login novamente para continuar.");
        navigate("/");
        return;
      }

      const reservationData = {
        ...formData,
        resource_id: parseInt(formData.resource_id),
        dates: datesToSend,
      };
      
      reservationData[formData.resource_type] = parseInt(formData.resource_id);

      await apiFetch("/api/user/reservations/create/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      });

      handleSuccess("Reserva(s) criada(s) com sucesso!");
      setFormData(initialReservationState);
      setSelectedDates(undefined);
      setFormModified(false);
      setSelectedResource(null);
    } catch (error) {
        console.error("Erro completo do backend:", error);
        
        let errorMessage = "Erro desconhecido. Tente novamente.";

        if (error.message.includes("Failed to fetch")) {
            errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
        
        } else if (error.message.includes("400")) {
            try {
                const errorJsonString = error.message.substring(error.message.indexOf('{'));
                const errorJson = JSON.parse(errorJsonString);
                
                errorMessage = Object.entries(errorJson)
                    .map(([key, value]) => {
                        const messages = Array.isArray(value) ? value.join(', ') : String(value);
                        return `${key}: ${messages}`;
                    })
                    .join('; ');
            } catch (e) {
                errorMessage = "O backend retornou um erro 400 (Bad Request) que não pôde ser lido.";
            }
        }

        handleError(`Erro ao criar reserva: ${errorMessage}`);
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
      <BackButton />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-[rgb(var(--color-primary))]">
          Solicitar Reserva
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[rgb(var(--color-bg))] p-2 rounded-xl shadow-lg border border-[rgb(var(--border-default))]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <ResourceSelector
                  formData={formData}
                  handleChange={handleChange}
                  resources={resources}
                  resourceTranslations={resourceTranslations}
                />

                {formData.resource_id && (
                  <TimeSelector
                    formData={formData}
                    handleChange={handleChange}
                    timeOptions={timeOptions}
                  />
                )}
                
                {formData.initial_time && formData.final_time && (
                  <DateSelector
                    selectedDates={selectedDates}
                    onDatesChange={handleDatesChange}
                    occupiedDates={occupiedDates}
                    timeOptions={timeOptions}
                    initialTime={formData.initial_time}
                    finalTime={formData.final_time}
                  />
                )}

                <ReservationDetails
                  formData={formData}
                  handleChange={handleChange}
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!formModified}
                    className={`font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md
                      bg-[rgb(var(--btn-primary-bg))] text-[rgb(var(--btn-primary-text))] border border-[rgb(var(--btn-primary-border))]
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Solicitar Reserva
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {selectedResource ? (
              <>
                <div className="bg-[rgb(var(--color-bg))] p-6 rounded-xl shadow-lg border border-[rgb(var(--border-default))]">
                  <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--color-text))]">
                    Detalhes do Recurso
                  </h3>
                  <div className="space-y-3">
                    {formData.resource_type === 'vehicle' ? (
                      <>
                        <div className="flex items-center p-3 rounded-lg">
                          <span className="font-medium w-24 text-[rgb(var(--color-text))]">Modelo:</span>
                          <span className="text-[rgb(var(--color-text-grays))]">{selectedResource.model}</span>
                        </div>
                        <div className="flex items-center p-3 rounded-lg">
                          <span className="font-medium w-24 text-[rgb(var(--color-text))]">Placa:</span>
                          <span className="text-[rgb(var(--color-text-grays))]">{selectedResource.plate_number}</span>
                        </div>
                        <div className="flex items-center p-3 rounded-lg">
                          <span className="font-medium w-24 text-[rgb(var(--color-text))]">Capacidade:</span>
                          <span className="text-[rgb(var(--color-text-grays))]">{selectedResource.capacity} pessoas</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center p-3 rounded-lg">
                          <span className="font-medium w-24 text-[rgb(var(--color-text))]">Nome:</span>
                          <span className="text-[rgb(var(--color-text-grays))]">{selectedResource.name}</span>
                        </div>
                        <div className="flex items-center p-3 rounded-lg">
                          <span className="font-medium w-24 text-[rgb(var(--color-text))]">Local:</span>
                          <span className="text-[rgb(var(--color-text-grays))]">{selectedResource.location}</span>
                        </div>
                        <div className="flex items-center p-3 rounded-lg">
                          <span className="font-medium w-24 text-[rgb(var(--color-text))]">Capacidade:</span>
                          <span className="text-[rgb(var(--color-text-grays))]">{selectedResource.capacity} pessoas</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-[rgb(var(--color-bg))] p-6 rounded-xl shadow-lg border border-[rgb(var(--border-default))]">
                  <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--color-text))]">
                    Horários Ocupados
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {occupiedDates.length > 0 ? (
                      occupiedDates.map((date, index) => (
                        <div key={index} className="p-3 bg-[rgba(var(--color-text),0.05)] rounded-lg">
                          <p className="font-medium text-[rgb(var(--color-text))]">
                            {new Date(date.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-[rgb(var(--color-text-grays))] mt-1">
                            {date.initial_time} - {date.final_time}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[rgb(var(--color-text-grays))] text-center py-4">
                        Nenhum horário ocupado
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-[rgb(var(--color-bg))] p-6 rounded-xl shadow-lg border border-[rgb(var(--border-default))]">
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-[rgb(var(--color-text-grays))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-[rgb(var(--color-text))]">
                    Selecione um recurso
                  </h3>
                  <p className="mt-2 text-sm text-[rgb(var(--color-text-grays))]">
                    As informações de disponibilidade aparecerão aqui
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReservation;