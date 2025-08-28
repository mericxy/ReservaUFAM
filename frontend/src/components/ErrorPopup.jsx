import React from 'react';

const ErrorPopup = ({ error, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-15 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-md p-4 w-1/2">
        <h2 className="text-lg font-bold mb-2">Erro</h2>
        <p className="text-sm text-gray-600 mb-4">Ocorreu um erro inesperado: {error.message}</p>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default ErrorPopup;