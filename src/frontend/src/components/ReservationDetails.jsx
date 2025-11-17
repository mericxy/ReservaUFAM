import React from "react";

const ReservationDetails = ({ formData, handleChange }) => (
  <div className="bg-[rgb(var(--color-bg))] p-4 rounded-lg">
    <h2 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-2">Detalhes da Reserva</h2>
    <div>
      <label className="block text-[rgb(var(--color-text))] text-sm font-bold mb-2">
        Descrição
        <span className="text-red-500">*</span>
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        rows="4"
        className="w-full p-3 border-theme-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
        placeholder="Descreva o propósito da reserva..."
      />
    </div>
  </div>
);

export default ReservationDetails;
