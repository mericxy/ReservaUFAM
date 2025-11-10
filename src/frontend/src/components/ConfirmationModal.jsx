// src/components/ConfirmationModal.jsx

import React from 'react';

/**
 * Um modal de confirmação genérico.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Se o modal está aberto ou não.
 * @param {function} props.onClose - Função para fechar o modal (chamada no "Cancelar").
 * @param {function} props.onConfirm - Função a ser executada ao confirmar (chamada no "Confirmar").
 * @param {string} props.title - O título do modal.
 * @param {string} props.message - A mensagem de confirmação.
 */
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    // MUDANÇA AQUI: Alterado de bg-opacity-50 para bg-opacity-5
    <div className="fixed inset-0 bg-opacity-5 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      {/* Conteúdo do Modal */}
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        
        {/* Botões de Ação */}
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