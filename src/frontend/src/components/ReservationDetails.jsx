import React from "react";

const ReservationDetails = ({ formData, handleChange }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalhes da Reserva</h2>
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
);

export default ReservationDetails;
