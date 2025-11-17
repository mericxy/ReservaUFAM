// src/components/DateTimeSelector.jsx
import React from "react";

const DateTimeSelector = ({ formData, handleChange, timeOptions, getMinDate }) => {
  return (
    <div className="bg-[rgb(var(--color-bg))] p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-2">Período da Reserva</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data e horário inicial */}
        <div className="space-y-4">
          <div>
            <label className="block text-[rgb(var(--color-text))] text-sm font-bold mb-2">
              Data Inicial
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="initial_date"
              value={formData.initial_date}
              onChange={handleChange}
              min={getMinDate()}
              required
              className="w-full p-3 border-theme-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
            />
          </div>
          <div>
            <label className="block text-[rgb(var(--color-text))] text-sm font-bold mb-2">
              Horário Inicial
              <span className="text-red-500">*</span>
            </label>
            <select
              name="initial_time"
              value={formData.initial_time}
              onChange={handleChange}
              required
              className="w-full p-3 border-theme-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
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

        {/* Data e horário final */}
        <div className="space-y-4">
          <div>
            <label className="block text-[rgb(var(--color-text))] text-sm font-bold mb-2">
              Data Final
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="final_date"
              value={formData.final_date}
              onChange={handleChange}
              min={formData.initial_date || getMinDate()}
              required
              className="w-full p-3 border-theme-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
            />
          </div>
          <div>
            <label className="block text-[rgb(var(--color-text))] text-sm font-bold mb-2">
              Horário Final
              <span className="text-red-500">*</span>
            </label>
            <select
              name="final_time"
              value={formData.final_time}
              onChange={handleChange}
              required
              className="w-full p-3 border-theme-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
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
      </div>
    </div>
  );
};

export default DateTimeSelector;
