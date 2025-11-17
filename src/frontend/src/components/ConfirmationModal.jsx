import React from 'react';

/**
 * Um modal de confirmação genérico.
 *
 * @param {object} props
 * @param {boolean} props.isOpen 
 * @param {function} props.onClose
 * @param {function} props.onConfirm 
 * @param {string} props.title 
 * @param {string} props.message
 */
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-5 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      <div className="bg-[rgb(var(--color-bg))] p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-[rgb(var(--color-text))]">{title}</h2>
        <p className="text-[rgb(var(--color-text))] mb-6">{message}</p>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-md transition-colors duration-300"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-300"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;