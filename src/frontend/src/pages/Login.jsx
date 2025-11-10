import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        identifier: "",
        password: ""
    });
    
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        setError("");
        setIsPending(true);

        try {
            const data = await apiFetch('/api/login/', {
                method: 'POST',
                body: JSON.stringify({
                    identifier: formData.identifier,
                    password: formData.password,
                }),
            });

            const userData = data.user;

            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            await login(data.access, userData);
            
            if (userData.is_staff === true) {
                navigate('/admin/page');
            } else {
                navigate('/home');
            }

        } catch (error) {
            if (error.message.includes('401') || error.message.includes('400')) {
                setError("Credenciais inválidas ou usuário não encontrado.");
            } else {
                setError("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
            }
        } finally {
            setIsPending(false);
        }
    };

    return (
        <section className="flex items-center justify-center flex-col gap-6 py-8 min-h-screen">
            <img src={logo} alt="logo" className="h-12" />
            
            <div className="border border-gray-300 rounded-xl p-8 w-full max-w-2xl shadow-lg bg-white px-12">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text mb-4">
                    Login
                </h2>
                <form onSubmit={handleLogin}>
                    <label htmlFor="identifier" className='block font-medium'>Usuário, E-mail ou SIAPE: </label>
                    <input
                        type="text"
                        name="identifier"
                        value={formData.identifier}
                        className='w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        style={{ border: "1px solid #ccc" }}
                        onChange={handleChange}
                        placeholder="Digite seu identificador"
                        required
                    />
                    <label htmlFor="password" className='block font-medium mt-4'>Senha: </label>
                    
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            className='w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                            style={{ border: "1px solid #ccc" }}
                            onChange={handleChange}
                            placeholder="Senha"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="text-center p-4">
                        <Link
                            to="/register"
                            className="text-sm text-green-600 hover:text-green-500"
                        >
                            Não tem uma conta? Cadastre-se
                        </Link>
                    </div>
                    
                    <div className="text-center text-xs text-gray-500 border-t pt-3">
                        <Link
                            to="/privacy-policy"
                            className="hover:text-gray-700 underline"
                        >
                            Política de Privacidade
                        </Link>
                        {" | "}
                        <span>
                            Em conformidade com a LGPD
                        </span>
                    </div>

                    <div className="flex items-center justify-center mt-2">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
                            disabled={isPending}
                        >
                            {isPending ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Login;