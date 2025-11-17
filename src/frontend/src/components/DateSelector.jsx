import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import { isSlotOccupied } from "../utils/timeUtils";

const DateSelector = ({ 
  selectedDates, 
  onDatesChange, 
  occupiedDates, 
  timeOptions, 
  initialTime, 
  finalTime 
}) => {
  const [mode, setMode] = useState("multiple");

  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  
  const disabledDays = [
    { before: today }, 
    (day) => isSlotOccupied(day, initialTime, finalTime, occupiedDates, timeOptions)
  ];
  
  const occupiedStyle = { 
    color: "red", 
    textDecoration: "line-through",
    opacity: 0.6
  };

  let footer = "Selecione um ou mais dias.";
  if (mode === 'range' && selectedDates?.from) {
    footer = `Intervalo selecionado: ${selectedDates.from.toLocaleDateString('pt-BR')}`;
    if (selectedDates.to) {
      footer += ` até ${selectedDates.to.toLocaleDateString('pt-BR')}`;
    }
  } else if (mode === 'multiple' && Array.isArray(selectedDates) && selectedDates.length > 0) {
    footer = `${selectedDates.length} dia(s) selecionado(s).`;
  }

  return (
    <>
      {/* CSS Overrides para react-day-picker usando suas variáveis */}
      <style>{`
        .rdp {
          --rdp-cell-size: 40px;
          --rdp-accent-color: rgb(var(--color-primary));
          --rdp-background-color: transparent;
          --rdp-accent-color-dark: rgb(var(--color-primary));
          --rdp-background-color-dark: transparent;
          --rdp-outline: 2px solid var(--rdp-accent-color);
          --rdp-outline-selected: 3px solid var(--rdp-accent-color);
          
          color: rgb(var(--color-text));
          border: 1px solid rgb(var(--border-default));
          border-radius: 0.5rem;
          padding: 0.5rem;
        }
        .rdp-nav_button {
          color: rgb(var(--color-text));
        }
        .rdp-head_cell {
          color: rgb(var(--color-text-grays));
        }
        .rdp-day {
          color: rgb(var(--color-text));
        }
        .rdp-day_today {
          font-weight: bold;
          color: rgb(var(--color-primary));
        }
        .rdp-day_disabled {
          color: rgb(var(--color-text-grays));
          opacity: 0.5;
        }
        .rdp-day_selected, .rdp-day_range_start, .rdp-day_range_end {
          background-color: rgb(var(--color-primary)) !important;
          color: white !important;
        }
        :root[data-theme="dark"] .rdp-day_selected,
        :root[data-theme="hc"] .rdp-day_selected {
           color: rgb(var(--color-bg)) !important;
        }
        .rdp-day_range_middle {
            background-color: rgba(var(--color-primary), 0.1) !important;
        }
      `}</style>

      <div className="bg-[rgb(var(--color-bg))] border border-[rgb(var(--border-default))] p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-4">
          Selecione os Dias
        </h2>

        <div className="flex justify-center mb-4 gap-2">
          <button
            type="button"
            onClick={() => { setMode('multiple'); onDatesChange(undefined); }}
            className={`px-4 py-2 rounded-lg border ${mode === 'multiple' 
              ? 'bg-[rgb(var(--btn-primary-bg))] text-[rgb(var(--btn-primary-text))] border-[rgb(var(--btn-primary-border))]' 
              : 'bg-transparent border-[rgb(var(--border-default))] text-[rgb(var(--color-text))]'
            }`}
          >
            Dias Avulsos
          </button>
          <button
            type="button"
            onClick={() => { setMode('range'); onDatesChange(undefined); }}
            className={`px-4 py-2 rounded-lg border ${mode === 'range' 
              ? 'bg-[rgb(var(--btn-primary-bg))] text-[rgb(var(--btn-primary-text))] border-[rgb(var(--btn-primary-border))]' 
              : 'bg-transparent border-[rgb(var(--border-default))] text-[rgb(var(--color-text))]'
            }`}
          >
            Intervalo de Dias
          </button>
        </div>

        <div className="flex justify-center">
          <DayPicker
            mode={mode}
            selected={selectedDates}
            onSelect={onDatesChange}
            locale={ptBR}
            disabled={disabledDays}
            modifiers={{ occupied: disabledDays[1] }}
            modifiersStyles={{ occupied: occupiedStyle }}
            footer={<p className="text-center mt-2 text-sm text-[rgb(var(--color-text-grays))]">{footer}</p>}
          />
        </div>
      </div>
    </>
  );
};

export default DateSelector;