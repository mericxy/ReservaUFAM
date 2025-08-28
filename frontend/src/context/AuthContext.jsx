import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../api"; // Sua configuração do Axios

const AuthContext = createContext();
const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutos em milissegundos

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sessionTimer, setSessionTimer] = useState(null);

    const resetSessionTimer = () => {
        if (sessionTimer) clearTimeout(sessionTimer);
        
        const newTimer = setTimeout(() => {
            logout();
        }, SESSION_TIMEOUT);
        
        setSessionTimer(newTimer);
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("accessToken");
            const userData = JSON.parse(localStorage.getItem("userData"));
            const loginTime = localStorage.getItem("loginTime");
            
            if (token && userData) {
                // Verifica se o tempo da sessão expirou
                const currentTime = new Date().getTime();
                const sessionAge = currentTime - parseInt(loginTime || 0);
                
                if (sessionAge > SESSION_TIMEOUT) {
                    logout();
                    setLoading(false);
                    return;
                }

                try {
                    // Verifica se o token ainda é válido fazendo uma requisição
                    const response = await fetch("http://127.0.0.1:8000/api/user/", {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        setIsAuthenticated(true);
                        setIsAdmin(userData.is_staff === true);
                        resetSessionTimer();
                    } else {
                        // Se o token não for válido, faz logout
                        logout();
                    }
                } catch (error) {
                    console.error("Erro ao verificar autenticação:", error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();

        // Limpa o timer quando o componente é desmontado
        return () => {
            if (sessionTimer) clearTimeout(sessionTimer);
        };
    }, []);

    // Adiciona listener para eventos do usuário para resetar o timer
    useEffect(() => {
        if (isAuthenticated) {
            const resetTimerOnActivity = () => {
                resetSessionTimer();
            };

            // Lista de eventos para monitorar
            const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
            
            events.forEach(event => {
                document.addEventListener(event, resetTimerOnActivity);
            });

            return () => {
                events.forEach(event => {
                    document.removeEventListener(event, resetTimerOnActivity);
                });
            };
        }
    }, [isAuthenticated]);

    const login = async (token, userData) => {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("loginTime", new Date().getTime().toString());
        setIsAuthenticated(true);
        setIsAdmin(userData.is_staff === true);
        resetSessionTimer();
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("loginTime");
        if (sessionTimer) clearTimeout(sessionTimer);
        setSessionTimer(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};
