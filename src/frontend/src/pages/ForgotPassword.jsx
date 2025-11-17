import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { apiFetch } from '../../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    setError(null);

    try {
      await apiFetch('/api/auth/password/forgot/', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setFeedback('Se o e-mail estiver cadastrado, enviaremos instruções de redefinição em instantes.');
      setEmail('');
    } catch (err) {
      setError('Não foi possível processar sua solicitação agora. Tente novamente em alguns minutos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex items-center justify-center flex-col gap-6 py-8 min-h-screen">
      <img src={logo} alt="logo" className="w-60" />

      <div className="border border-gray-300 rounded-xl p-8 w-full max-w-2xl shadow-lg bg-white px-12">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text mb-4">
          Esqueci minha senha
        </h2>

        <p className="text-gray-600 mb-6">
          Informe o e-mail utilizado no cadastro. Enviaremos um link temporário para redefinir sua senha.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block font-medium">
            E-mail cadastrado
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            style={{ border: '1px solid #ccc' }}
            placeholder="exemplo@ufam.edu.br"
            required
          />

          {feedback && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
              {feedback}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <Link to="/" className="text-gray-500 hover:text-gray-700 underline text-sm">
              Voltar para o login
            </Link>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar link'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;