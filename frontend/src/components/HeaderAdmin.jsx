import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const HeaderAdmin = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout(); // Remove o token e desloga o usuário
        navigate("/"); // Redireciona para login
    };

    const isActive = (path) => {
        return location.pathname === path ? "border-b-2 border-green-600 text-green-600" : "";
    };

    return (
        <header className="flex items-center justify-between bg-primary w-full h-14 shadow-md mb-4 p-3">
            <a href="/admin/page" className="ml-4">
                <img src={logo} alt="logo" className="w-26 h-9" />
            </a>
            <nav>
                <ul className="flex items-center flex-row">
                    <a href="/admin/page" className={`p-4 hover:text-green-600 hover:border-b-2 border-green-600 transition-colors duration-300 ${isActive('/admin/page')}`}>
                        <li>
                            Painel
                        </li>
                    </a>
                    <a href="/admin/reservations" className={`p-4 hover:text-green-600 hover:border-b-2 border-green-600 transition-colors duration-300 ${isActive('/admin/reservations')}`}>
                        <li>
                            Reservas
                        </li>
                    </a>
                    <a href="/admin/users" className={`p-4 hover:text-green-600 hover:border-b-2 border-green-600 transition-colors duration-300 ${isActive('/admin/users')}`}>
                        <li>
                            Usuários
                        </li>
                    </a>
                    <a href="/admin/resources" className={`p-4 hover:text-green-600 hover:border-b-2 border-green-600 transition-colors duration-300 ${isActive('/admin/resources')}`}>
                        <li>
                            Recursos
                        </li>
                    </a>
                    <a href="/admin/profile" className={`p-4 hover:text-green-600 hover:border-b-2 border-green-600 transition-colors duration-300 ${isActive('/admin/profile')}`}>
                        <li>
                            Perfil
                        </li>
                    </a>
                    <li className="p-4">
                        <button 
                            type="button" 
                            className="bg-red-500 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-300 shadow-md"
                            onClick={handleLogout}
                        >
                            Sair
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default HeaderAdmin;
