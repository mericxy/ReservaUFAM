import React from "react";
import { privacyPolicyContent } from "../data/privacyPolicy";
import BackButton from "../components/BackButton";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <BackButton />
        
        <div className="bg-[rgb(var(--color-bg))] rounded-lg shadow-lg p-8 mt-8">
          <header className="mb-8 text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-[rgb(var(--color-text))] mb-2">
              {privacyPolicyContent.title}
            </h1>
            <p className="text-[rgb(var(--color-text-grays))]">
              Última atualização: {privacyPolicyContent.lastUpdated}
            </p>
          </header>

          <div className="prose prose-lg max-w-none">
            {privacyPolicyContent.sections.map((section, index) => (
              <section key={index} className="mb-8">
                <h2 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-4 border-l-4 border-blue-500 pl-4">
                  {section.title}
                </h2>
                <div className="text-[rgb(var(--color-text))] leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          <footer className="mt-12 pt-6 border-t text-center">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Precisa de Ajuda?
              </h3>
              <p className="text-blue-700 mb-3">
                Para dúvidas sobre esta política ou seus direitos de privacidade:
              </p>
              <div className="text-blue-800">
                <p><strong>Email:</strong> dpo@ufam.edu.br</p>
                <p><strong>Telefone:</strong> (92) 3305-1181</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;