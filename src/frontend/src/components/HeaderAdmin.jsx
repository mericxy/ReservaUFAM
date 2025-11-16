import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import ThemeModal from "./ThemeModal";


const HeaderAdmin = () => {
    const location = useLocation();


    const isActive = (path) => {
        return location.pathname === path ? "border-b-2 border-green-600 text-green-600" : "";
    };

    return (
        <>
            <header className="flex items-center justify-between bg-[rgb(var(--color-bg))] w-full h-14 shadow-md mb-4 p-3 border-theme">
                <a href="/admin/page" className="ml-4">
                    <img src={logo} alt="logo" className="w-26 h-9" />
                </a>
                <nav>
                    <ul className="flex items-center flex-row">
                        <Link to="/admin/page" className={`p-4 text-[rgb(var(--color-text))] hover:text-green-600 hover:border-b-2 border-green-600 transition-colors duration-300 ${isActive('/admin/page')}`}>
                            <li>
                                Painel
                            </li>
                        </Link>
                        <Link to="/admin/reservations" className={`p-4 text-[rgb(var(--color-text))] hover:text-green-600 hover:border-b-2 border-green-600 transition-colors duration-300 ${isActive('/admin/reservations')}`}>
                            <li>
                                Reservas
                            </li>
                        </Link>
                        <Link to="/admin/users" className={`p-4 text-[rgb(var(--color-text))] hover:text-green-600 hover:border-b-2 border-green-600 transition-colors duration-300 ${isActive('/admin/users')}`}>
                            <li>
                                Usuários
                            </li>
                        </Link>
                        <Link to="/admin/resources" className={`p-4 text-[rgb(var(--color-text))] hover:text-green-600 hover:border-b-2 border-green-600 transition-colors duration-300 ${isActive('/admin/resources')}`}>
                            <li>
                                Recursos
                            </li>
                        </Link>
                        <Link to="/admin/profile" className={`p-4 text-[rgb(var(--color-text))] hover:text-green-600 hover:border-b-2 border-green-600 transition-colors duration-300 ${isActive('/admin/profile')}`}>
                            <li>
                                Perfil
                            </li>
                        </Link>

                        <ThemeModal/>
                    </ul>
                </nav>
            </header>

        </>
    );
};

export default HeaderAdmin;
