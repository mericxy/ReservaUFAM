import React from 'react';

const SucessPopup = ({ mensagem, onClose }) => {
  return (
    <div className="bg-white rounded-md p-4 shadow-md">
      <h2 className="text-lg font-bold mb-2">Confirmação</h2>
      <p className="text-md">{mensagem}</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onClose}>
        Fechar
      </button>
    </div>
  );
};

export default SucessPopup;