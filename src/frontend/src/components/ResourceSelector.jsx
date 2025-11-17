// src/components/ResourceSelector.jsx
import React from "react";

const ResourceSelector = ({ formData, handleChange, resourceTranslations, resources }) => {
  return (
    <div className="bg-[rgb(var(--color-bg))] p-4 rounded-lg space-y-4">
      <h2 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-2">
        Selecione o Recurso
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[rgb(var(--color-text))] text-sm font-bold mb-2">
            Tipo de Recurso
            <span className="text-red-500">*</span>
          </label>
          <select
            name="resource_type"
            value={formData.resource_type}
            onChange={handleChange}
            className="w-full p-3 border-theme-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
            required
          >
            <option value="">Selecione um tipo</option>
            {Object.entries(resourceTranslations).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {formData.resource_type && (
          <div>
            <label className="block text-[rgb(var(--color-text))] text-sm font-bold mb-2">
              Recurso Específico
              <span className="text-red-500">*</span>
            </label>
            <select
              name="resource_id"
              value={formData.resource_id}
              onChange={handleChange}
              className="w-full p-3 border-theme-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
              required
            >
              <option value="">Selecione um recurso </option>
              {resources[formData.resource_type]?.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name || resource.model || resource.plate_number}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceSelector;
