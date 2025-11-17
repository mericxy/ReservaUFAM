import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../assets/logo.png';
import { apiFetch } from '../../api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [validating, setValidating] = useState(true);
  const [tokenError, setTokenError] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenError('Token ausente. Solicite um novo link de redefinição.');
        setValidating(false);
        return;
      }

      try {
        await apiFetch(`/api/auth/password/reset/validate/?token=${encodeURIComponent(token)}`);
      } catch (err) {
        setTokenError('Token inválido ou expirado. Solicite um novo link.');
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      await apiFetch('/api/auth/password/reset/', {
        method: 'POST',
        body: JSON.stringify({
          token,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });
      setSuccessMessage('Senha redefinida com sucesso! Você será redirecionado para o login.');
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setFormError(
        err?.message?.includes('senhas')
          ? 'As senhas não coincidem ou não atendem às regras de segurança.'
          : 'Não foi possível redefinir sua senha. Solicite um novo link.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (validating) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Validando token...</div>
      </section>
    );
  }

  if (tokenError) {
    return (
      <section className="flex items-center justify-center flex-col gap-6 py-8 min-h-screen">
        <img src={logo} alt="logo" className="w-60 h-20" />
        <div className="border border-gray-300 rounded-xl p-8 w-full max-w-2xl shadow-lg bg-white px-12 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Link indisponível</h2>
          <p className="text-gray-600 mb-6">{tokenError}</p>
          <Link to="/forgot-password" className="text-green-600 hover:text-green-500 underline">
            Solicitar novo link
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex items-center justify-center flex-col gap-6 py-8 min-h-screen">
      <img src={logo} alt="logo" className="w-60" />
      <div className="border border-gray-300 rounded-xl p-8 w-full max-w-2xl shadow-lg bg-white px-12">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text mb-4">
          Redefinir senha
        </h2>
        <p className="text-gray-600 mb-6">Crie uma nova senha forte para continuar acessando o sistema.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password" className="block font-medium">
            Nova senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ border: '1px solid #ccc' }}
              placeholder="Mínimo de 8 caracteres"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          <label htmlFor="passwordConfirmation" className="block font-medium mt-4">
            Confirmar nova senha
          </label>
          <div className="relative">
            <input
              type={showConfirmation ? 'text' : 'password'}
              id="passwordConfirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ border: '1px solid #ccc' }}
              placeholder="Repita a senha"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmation((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
            >
              {showConfirmation ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {formError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {formError}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
              {successMessage}
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
              {isSubmitting ? 'Salvando...' : 'Atualizar senha'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;