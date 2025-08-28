import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import MessagePopup from "../components/MessagePopup";

const resourceTranslations = {
    "auditorium": "Auditório",
    "meeting_room": "Sala de Reunião",
    "vehicle": "Veículo"
};

const generateTimeOptions = () => {
    const options = [];
    for (let hour = 7; hour < 23; hour++) {
        const formattedHour = hour.toString().padStart(2, '0');
        options.push(`${formattedHour}:00`);
        options.push(`${formattedHour}:30`);
    }
    return options;
};

const getFinalTimeOptions = (initialTime, initialDate, finalDate) => {
    // Se não tiver horário inicial, retorna lista vazia
    if (!initialTime) {
        return [];
    }

    // Se não tiver as datas, retorna lista vazia
    if (!initialDate || !finalDate) {
        return [];
    }

    // Converte as datas para comparação
    const initialDateObj = new Date(initialDate);
    const finalDateObj = new Date(finalDate);

    // Se as datas forem diferentes, retorna todos os horários
    if (initialDateObj.getTime() !== finalDateObj.getTime()) {
        return generateTimeOptions();
    }

    // Se as datas são iguais, filtra os horários após o horário inicial
    const allOptions = generateTimeOptions();
    const initialTimeIndex = allOptions.findIndex(time => time === initialTime);

    if (initialTimeIndex === -1) {
        return [];
    }

    return allOptions.slice(initialTimeIndex + 1);
};

const CreateReservation = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [resources, setResources] = useState({
        auditorium: [],
        meeting_room: [],
        vehicle: []
    });
    const [occupiedDates, setOccupiedDates] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);

    const [formModified, setFormModified] = useState(false);
    const [initialFormData] = useState({
        resource_type: "",
        resource_id: "",
        initial_date: "",
        final_date: "",
        initial_time: "",
        final_time: "",
        description: ""
    });

    const [formData, setFormData] = useState({
        resource_type: "",
        resource_id: "",
        initial_date: "",
        final_date: "",
        initial_time: "",
        final_time: "",
        description: ""
    });

    const timeOptions = generateTimeOptions();

    const getMinDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 2);
        return today.toISOString().split("T")[0];
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }

        // Carregar recursos quando o componente montar
        fetchResources();
    }, [isAuthenticated, navigate]);

    // Carregar datas ocupadas quando um recurso for selecionado
    useEffect(() => {
        if (formData.resource_type && formData.resource_id) {
            fetchOccupiedDates();
        }
    }, [formData.resource_type, formData.resource_id]);

    const handleError = (errorMessage) => {
        setMessage({ text: errorMessage, type: 'error' });
    };

    const handleSuccess = (successMessage) => {
        setMessage({ text: successMessage, type: 'success' });
    };

    const clearMessage = () => {
        setMessage({ text: "", type: "" });
    };

    const fetchResources = async () => {
        const token = localStorage.getItem("accessToken");
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        try {
            const [auditoriumResponse, meetingRoomResponse, vehicleResponse] = await Promise.all([
                fetch('http://127.0.0.1:8000/api/resources/auditoriums/', { headers }),
                fetch('http://127.0.0.1:8000/api/resources/meeting-rooms/', { headers }),
                fetch('http://127.0.0.1:8000/api/resources/vehicles/', { headers })
            ]);

            if (!auditoriumResponse.ok || !meetingRoomResponse.ok || !vehicleResponse.ok) {
                throw new Error('Erro ao carregar recursos');
            }

            const [auditoriums, meetingRooms, vehicles] = await Promise.all([
                auditoriumResponse.json(),
                meetingRoomResponse.json(),
                vehicleResponse.json()
            ]);

            setResources({
                auditorium: auditoriums,
                meeting_room: meetingRooms,
                vehicle: vehicles
            });
        } catch (error) {
            console.error('Erro ao carregar recursos:', error);
            handleError("Erro ao carregar recursos disponíveis. Por favor, tente novamente mais tarde.");
        }
    };

    const fetchOccupiedDates = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`http://127.0.0.1:8000/api/resources/occupied-dates/${formData.resource_type}/${formData.resource_id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Erro ao carregar datas ocupadas');
            
            const data = await response.json();
            setOccupiedDates(data);
        } catch (error) {
            console.error('Erro ao carregar datas ocupadas:', error);
            handleError("Erro ao carregar disponibilidade do recurso");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };

        // Limpa o horário final apenas se a data inicial ou final for alterada
        if (name === 'initial_date' || name === 'final_date') {
            console.log(`${name} alterado para ${value}, limpando horário final`);
            newFormData.final_time = '';
            newFormData.initial_time = '';
        }

        // Se mudar o horário inicial, apenas limpa o horário final
        if (name === 'initial_time') {
            console.log(`${name} alterado para ${value}`);
            newFormData.final_time = '';
        }

        // Se mudar a data inicial, ajusta a data final se necessário
        if (name === 'initial_date' && newFormData.final_date < value) {
            console.log('Ajustando data final para coincidir com data inicial');
            newFormData.final_date = value;
            newFormData.final_time = '';
        }

        setFormData(newFormData);

        // Verifica se algum campo foi modificado em relação ao estado inicial
        const hasChanges = Object.keys(newFormData).some(
            key => newFormData[key] !== initialFormData[key]
        );
        setFormModified(hasChanges);

        if (name === 'resource_type') {
            setFormData(prev => ({ ...prev, resource_id: '' }));
            setSelectedResource(null);
        }

        if (name === 'resource_id') {
            const resource = resources[formData.resource_type]?.find(r => r.id === parseInt(value));
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
                navigate('/');
                return;
            }

            // Validações adicionais
            if (!formData.resource_type || !formData.resource_id) {
                handleError("Por favor, selecione um recurso.");
                return;
            }

            if (!formData.initial_date || !formData.final_date) {
                handleError("Por favor, selecione as datas inicial e final.");
                return;
            }

            if (!formData.initial_time || !formData.final_time) {
                handleError("Por favor, selecione os horários inicial e final.");
                return;
            }

            if (!formData.description.trim()) {
                handleError("Por favor, forneça uma descrição para a reserva.");
                return;
            }

            // Prepara os dados da reserva
            const reservationData = {
                initial_date: formData.initial_date,
                final_date: formData.final_date,
                initial_time: formData.initial_time,
                final_time: formData.final_time,
                description: formData.description,
                resource_type: formData.resource_type,
                resource_id: parseInt(formData.resource_id)
            };

            console.log("Dados que serão enviados:", reservationData);

            // Adiciona o campo correto do recurso
            switch (formData.resource_type) {
                case 'auditorium':
                    reservationData.auditorium = parseInt(formData.resource_id);
                    break;
                case 'meeting_room':
                    reservationData.meeting_room = parseInt(formData.resource_id);
                    break;
                case 'vehicle':
                    reservationData.vehicle = parseInt(formData.resource_id);
                    break;
                default:
                    throw new Error('Tipo de recurso inválido');
            }

            console.log('Dados que serão enviados:', JSON.stringify(reservationData, null, 2));

            const response = await fetch("http://127.0.0.1:8000/api/user/reservations/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(reservationData)
            });

            const responseText = await response.text();
            console.log('Resposta bruta do servidor:', responseText);

            let responseData;
            try {
                responseData = JSON.parse(responseText);
                console.log('Resposta do servidor (parsed):', responseData);
            } catch (e) {
                console.log('Erro ao fazer parse da resposta');
                throw new Error('Erro ao processar resposta do servidor');
            }

            if (!response.ok) {
                let errorMessage = 'Erro na resposta do servidor';
                
                if (responseData.detail) {
                    errorMessage = responseData.detail;
                } else if (typeof responseData === 'object') {
                    const errors = [];
                    Object.entries(responseData).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            errors.push(`${key}: ${value.join(', ')}`);
                        } else if (typeof value === 'string') {
                            errors.push(`${key}: ${value}`);
                        }
                    });
                    if (errors.length > 0) {
                        errorMessage = errors.join('. ');
                    }
                }
                
                throw new Error(errorMessage);
            }

            handleSuccess("Reserva criada com sucesso!");
            
            // Limpa o formulário
            setFormData({
                resource_type: "",
                resource_id: "",
                initial_date: "",
                final_date: "",
                initial_time: "",
                final_time: "",
                description: ""
            });
            setFormModified(false);
            setSelectedResource(null);
            
        } catch (error) {
            console.error('Erro completo:', error);
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
                                {/* Seção de Seleção de Recurso */}
                                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                        Selecione o Recurso
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                Tipo de Recurso
                                            </label>
                                            <select
                                                name="resource_type"
                                                value={formData.resource_type}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
                                                required
                                            >
                                                <option value="">Selecione um tipo</option>
                                                {Object.entries(resourceTranslations).map(([key, value]) => (
                                                    <option key={key} value={key}>{value}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {formData.resource_type && (
                                            <div>
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Recurso Específico
                                                </label>
                                                <select
                                                    name="resource_id"
                                                    value={formData.resource_id}
                                                    onChange={handleChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
                                                    required
                                                >
                                                    <option value="">Selecione um recurso</option>
                                                    {resources[formData.resource_type]?.map(resource => (
                                                        <option key={resource.id} value={resource.id}>
                                                            {resource.name || resource.model || resource.plate_number}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Seção de Data e Hora */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                        Período da Reserva
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Data Inicial
                                                </label>
                                                <input 
                                                    type="date" 
                                                    name="initial_date" 
                                                    value={formData.initial_date} 
                                                    onChange={handleChange} 
                                                    min={getMinDate()} 
                                                    required 
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Horário Inicial
                                                </label>
                                                <select 
                                                    name="initial_time" 
                                                    value={formData.initial_time} 
                                                    onChange={handleChange} 
                                                    required 
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
                                                >
                                                    <option value="">Selecione um horário</option>
                                                    {timeOptions.map((time) => (
                                                        <option key={time} value={time}>
                                                            {time}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Data Final
                                                </label>
                                                <input 
                                                    type="date" 
                                                    name="final_date" 
                                                    value={formData.final_date} 
                                                    onChange={handleChange} 
                                                    min={formData.initial_date || getMinDate()} 
                                                    required 
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Horário Final
                                                </label>
                                                <select 
                                                    name="final_time" 
                                                    value={formData.final_time} 
                                                    onChange={handleChange} 
                                                    required 
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
                                                >
                                                    <option value="">Selecione um horário</option>
                                                    <option value="07:00">07:00</option>
                                                    <option value="07:30">07:30</option>
                                                    <option value="08:00">08:00</option>
                                                    <option value="08:30">08:30</option>
                                                    <option value="09:00">09:00</option>
                                                    <option value="09:30">09:30</option>
                                                    <option value="10:00">10:00</option>
                                                    <option value="10:30">10:30</option>
                                                    <option value="11:00">11:00</option>
                                                    <option value="11:30">11:30</option>
                                                    <option value="12:00">12:00</option>
                                                    <option value="12:30">12:30</option>
                                                    <option value="13:00">13:00</option>
                                                    <option value="13:30">13:30</option>
                                                    <option value="14:00">14:00</option>
                                                    <option value="14:30">14:30</option>
                                                    <option value="15:00">15:00</option>
                                                    <option value="15:30">15:30</option>
                                                    <option value="16:00">16:00</option>
                                                    <option value="16:30">16:30</option>
                                                    <option value="17:00">17:00</option>
                                                    <option value="17:30">17:30</option>
                                                    <option value="18:00">18:00</option>
                                                    <option value="18:30">18:30</option>
                                                    <option value="19:00">19:00</option>
                                                    <option value="19:30">19:30</option>
                                                    <option value="20:00">20:00</option>
                                                    <option value="20:30">20:30</option>
                                                    <option value="21:00">21:00</option>
                                                    <option value="21:30">21:30</option>
                                                    <option value="22:00">22:00</option>
                                                    <option value="22:30">22:30</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Seção de Descrição */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                        Detalhes da Reserva
                                    </h2>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Descrição
                                        </label>
                                        <textarea 
                                            name="description" 
                                            value={formData.description} 
                                            onChange={handleChange} 
                                            required 
                                            rows="4"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
                                            placeholder="Descreva o propósito da reserva..."
                                        />
                                    </div>
                                </div>

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
                                    </h3>
                                    <div className="space-y-3">
                                        {formData.resource_type === 'vehicle' ? (
                                            <>
                                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <span className="font-medium w-24">Modelo:</span>
                                                    <span>{selectedResource.model}</span>
                                                </div>
                                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <span className="font-medium w-24">Placa:</span>
                                                    <span>{selectedResource.plate_number}</span>
                                                </div>
                                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <span className="font-medium w-24">Capacidade:</span>
                                                    <span>{selectedResource.capacity} pessoas</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <span className="font-medium w-24">Nome:</span>
                                                    <span>{selectedResource.name}</span>
                                                </div>
                                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <span className="font-medium w-24">Local:</span>
                                                    <span>{selectedResource.location}</span>
                                                </div>
                                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <span className="font-medium w-24">Capacidade:</span>
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
