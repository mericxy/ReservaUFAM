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
            console.error('Erro na requisição:', error);
            
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
            <img src={logo} alt="logo" className="w-17 h-12" />
            
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
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        className='w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        style={{ border: "1px solid #ccc" }}
                        onChange={handleChange}
                        placeholder="Senha"
                        required
                    />

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