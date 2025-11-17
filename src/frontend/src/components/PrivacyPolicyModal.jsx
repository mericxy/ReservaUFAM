import React from "react";
import { privacyPolicyContent } from "../data/privacyPolicy";

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[rgb(var(--color-bg))] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header fixo */}
        <div className="flex items-center justify-between p-6 border-b border-theme">
          <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
            {privacyPolicyContent.title}
          </h2>
          <button
            onClick={onClose}
            className="text-[rgb(var(--color-text-grays))] hover:text-[rgb(var(--color-text))] text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-[rgb(var(--color-text-grays))] mb-6">
            Última atualização: {privacyPolicyContent.lastUpdated}
          </p>

          <div className="space-y-6">
            {privacyPolicyContent.sections.map((section, index) => (
              <section key={index} className="border-b border-theme pb-4">
                <h3 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-3 border-l-4 border-green-500 pl-4">
                  {section.title}
                </h3>
                <div className="text-[rgb(var(--color-text))] leading-relaxed whitespace-pre-line text-sm">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-theme">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-green-800 mb-2">
                Precisa de Ajuda?
              </h4>
              <p className="text-green-700 mb-3">
                Para dúvidas sobre esta política ou seus direitos de privacidade:
              </p>
              <div className="text-green-800 text-sm">
                <p><strong>Email:</strong> dpo@ufam.edu.br</p>
                <p><strong>Telefone:</strong> (92) 3305-1181</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer fixo */}
        <div className="border-t border-theme p-4">
          <button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;