import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import MessagePopup from "../components/MessagePopup";
import { generateTimeOptions, getMinDate } from "../utils/dateUtils";
import { resourceTranslations, initialFormData } from "../constants/reservation";
import { useMessages } from "../hooks/useMessages";
import { useResources } from "../hooks/useResources";
import ResourceSelector from "../components/ResourceSelector";
import DateTimeSelector from "../components/DateTimeSelector";
import ReservationDetails from "../components/ReservationDetails";
import { apiFetch } from "../../api";


const CreateReservation = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { message, handleError, handleSuccess, clearMessage } = useMessages();

    const [formData, setFormData] = useState(initialFormData);
    const [formModified, setFormModified] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);

    const { resources, occupiedDates } = useResources(formData, handleError);

    const timeOptions = generateTimeOptions();

    useEffect(() => {
        if (!isAuthenticated) {
        navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };

        if (name === "initial_date" || name === "final_date") {
        newFormData.final_time = "";
        newFormData.initial_time = "";
        }

        if (name === "initial_time") {
        newFormData.final_time = "";
        }

        if (name === "initial_date" && newFormData.final_date < value) {
        newFormData.final_date = value;
        newFormData.final_time = "";
        }

        setFormData(newFormData);

        const hasChanges = Object.keys(newFormData).some(
        (key) => newFormData[key] !== initialFormData[key]
        );
        setFormModified(hasChanges);

        if (name === "resource_type") {
        setFormData((prev) => ({ ...prev, resource_id: "" }));
        setSelectedResource(null);
        }

        if (name === "resource_id") {
        const resource = resources[formData.resource_type]?.find(
            (r) => r.id === parseInt(value)
        );
        setSelectedResource(resource);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formModified) return;

        try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            handleError("Sessão expirada. Por favor, faça login novamente.");
            navigate("/");
            return;
        }

        const requiredFields = [
            "resource_type",
            "resource_id",
            "initial_date",
            "final_date",
            "initial_time",
            "final_time",
            "description",
        ];

        for (const field of requiredFields) {
            if (!formData[field] || (typeof formData[field] === "string" && !formData[field].trim())) {
            handleError("Por favor, preencha todos os campos obrigatórios.");
            return;
            }
        }

        const reservationData = {
            ...formData,
            resource_id: parseInt(formData.resource_id),
        };

        reservationData[formData.resource_type] = parseInt(formData.resource_id);

        const response = await fetch(
            "http://127.0.0.1:8000/api/user/reservations/create/",
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(reservationData),
            }
        );

        const text = await response.text();
        let data;

        try {
            data = JSON.parse(text);
        } catch {
            throw new Error("Erro ao processar resposta do servidor");
        }

        if (!response.ok) {
            let errorMessage = "Erro na resposta do servidor";
            if (data.detail) {
            errorMessage = data.detail;
            } else if (typeof data === "object") {
            const errors = Object.entries(data).map(([key, value]) =>
                Array.isArray(value) ? `${key}: ${value.join(", ")}` : `${key}: ${value}`
            );
            errorMessage = errors.join(". ");
            }
            throw new Error(errorMessage);
        }

        handleSuccess("Reserva criada com sucesso!");
        setFormData(initialFormData);
        setFormModified(false);
        setSelectedResource(null);
        } catch (error) {
        console.error("Erro completo:", error);
        handleError(`Erro ao criar reserva: ${error.message}`);
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
                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
                    Solicitar Reserva
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulário de Reserva */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-2 rounded-xl shadow-lg">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <ResourceSelector
                                    formData={formData}
                                    handleChange={handleChange}
                                    resources={resources}
                                    resourceTranslations={resourceTranslations}
                                />

                                <DateTimeSelector
                                    formData={formData}
                                    handleChange={handleChange}
                                    timeOptions={timeOptions}
                                    getMinDate={getMinDate}
                                />

                                <ReservationDetails
                                    formData={formData}
                                    handleChange={handleChange}
                                />

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={!formModified}
                                        className={`font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md
                                            ${formModified 
                                                ? 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg cursor-pointer' 
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        Solicitar Reserva
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Painel Lateral */}
                    <div className="lg:col-span-1 space-y-6">
                        {selectedResource ? (
                            <>
                                <div className="bg-white p-6 rounded-xl shadow-lg">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                        Detalhes do Recurso  
                                        <span className="text-red-500">*</span>
                                    </h3>
                                    <div className="space-y-3">
                                        {formData.resource_type === 'vehicle' ? (
                                            <>
                                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <span className="font-medium w-24">Modelo:<span className="text-red-500">*</span></span>
                                                    <span>{selectedResource.model}</span>
                                                </div>
                                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <span className="font-medium w-24">Placa:<span className="text-red-500">*</span></span>
                                                    <span>{selectedResource.plate_number}</span>
                                                </div>
                                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <span className="font-medium w-24">Capacidade:<span className="text-red-500">*</span></span>
                                                    <span>{selectedResource.capacity} pessoas</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <span className="font-medium w-24">Nome:<span className="text-red-500">*</span></span>
                                                    <span>{selectedResource.name}</span>
                                                </div>
                                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <span className="font-medium w-24">Local:<span className="text-red-500">*</span></span>
                                                    <span>{selectedResource.location}</span>
                                                </div>
                                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <span className="font-medium w-24">Capacidade:<span className="text-red-500">*</span></span>
                                                    <span>{selectedResource.capacity} pessoas</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-lg">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                        Horários Ocupados
                                    </h3>
                                    <div className="space-y-3">
                                        {occupiedDates.length > 0 ? (
                                            occupiedDates.map((date, index) => (
                                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                                    <p className="font-medium text-gray-800">
                                                        {new Date(date.date).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {date.initial_time} - {date.final_time}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-600 text-center py-4">
                                                Nenhum horário ocupado
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <div className="text-center py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                                        Selecione um recurso
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
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
