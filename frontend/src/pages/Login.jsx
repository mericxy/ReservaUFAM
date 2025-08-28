import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        identifier: "", // Pode ser email, username ou siape
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
        
        setError(""); // Limpa erros anteriores
        setIsPending(true);
        console.log("Iniciando login...");

        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.identifier,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            console.log("Resposta do servidor:", data);
            
            if (response.ok) {
                // Armazena os tokens e atualiza o contexto
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);
                console.log('Tokens armazenados com sucesso');
                
                // Busca informações do usuário
                try {
                    const userResponse = await fetch('http://127.0.0.1:8000/api/user/', {
                        headers: {
                            'Authorization': `Bearer ${data.access}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const userData = await userResponse.json();
                    
                    if (!userResponse.ok) {
                        throw new Error(userData.detail || 'Erro ao buscar dados do usuário');
                    }
                    
                    // Armazena os dados do usuário e atualiza o contexto
                    localStorage.setItem('userData', JSON.stringify(userData));
                    console.log('Dados do usuário:', userData);
                    
                    // Atualiza o contexto com os dados do usuário
                    await login(data.access, userData);
                    
                    // Redireciona baseado no tipo de usuário
                    if (userData.is_staff === true) {
                        console.log('Usuário é admin, redirecionando para área administrativa...');
                        navigate('/admin/page');
                    } else {
                        console.log('Usuário comum, redirecionando para home...');
                        navigate('/home');
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário:', error);
                    setError("Erro ao carregar dados do usuário. Por favor, tente novamente.");
                    // Remove os tokens em caso de erro
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            } else {
                let mensagemErro = "Erro ao fazer login. Por favor, verifique suas credenciais.";
                
                if (data.detail) {
                    switch(data.detail) {
                        case "No active account found with the given credentials":
                            mensagemErro = "Usuário não cadastrado ou senha incorreta.";
                            break;
                        case "Given token not valid for any token type":
                            mensagemErro = "Sessão expirada. Por favor, faça login novamente.";
                            break;
                        case "Sua conta ainda não foi aprovada pelo administrador.":
                            mensagemErro = "Sua conta está pendente de aprovação pelo administrador.";
                            break;
                        default:
                            mensagemErro = "Erro ao fazer login. Por favor, tente novamente.";
                    }
                }
                
                setError(mensagemErro);
                console.error('Erro no login:', data);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            setError("Não foi possível conectar ao servidor. Por favor, verifique sua conexão e tente novamente.");
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
                    <label htmlFor="username" className='block font-medium'>Usuário: </label>
                    <input
                        type="text"
                        name="identifier"
                        value={formData.identifier}
                        className='w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        style={{ border: "1px solid #ccc" }}
                        onChange={handleChange}
                        placeholder="Usuário"
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

                    {/* Exibir mensagem de erro se houver */}
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

                    {/* Submit button */}
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