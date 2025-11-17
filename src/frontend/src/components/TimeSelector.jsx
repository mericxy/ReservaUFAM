import React from "react";

const TimeSelector = ({ formData, handleChange, timeOptions }) => {
  
  let filteredFinalOptions = timeOptions;
  if (formData.initial_time) {
    const initialIndex = timeOptions.indexOf(formData.initial_time);
    filteredFinalOptions = timeOptions.filter((time, index) => index > initialIndex);
  }

  const selectStyles = "w-full p-3 border border-[rgb(var(--border-default))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))]";

  return (
    <div className="bg-[rgb(var(--color-bg))] border border-[rgb(var(--border-default))] p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-4">
        Selecione o Horário
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[rgb(var(--color-text))] text-sm font-bold mb-2">
            Horário Inicial
          </label>
          <select
            name="initial_time"
            value={formData.initial_time}
            onChange={handleChange}
            required
            className={selectStyles}
          >
            <option value="">Selecione um horário</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[rgb(var(--color-text))] text-sm font-bold mb-2">
            Horário Final
          </label>
          <select
            name="final_time"
            value={formData.final_time}
            onChange={handleChange}
            required
            className={selectStyles}
            disabled={!formData.initial_time}
          >
            <option value="">Selecione um horário</option>
            {filteredFinalOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;