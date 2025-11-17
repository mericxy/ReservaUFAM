import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import ConfirmationModal from "./ConfirmationModal";
import ThemeModal from "./ThemeModal";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/");
    setIsModalOpen(false);
  };

  const navItemBase =
    "p-4 transition-colors duration-300 border-b-2 text-[rgb(var(--color-text))] hover:text-[rgb(var(--color-primary))] hover:border-[rgb(var(--color-primary))]";

  const isActive = (path) =>
    location.pathname === path
      ? "text-green-600 border-green-600"
      : "border-transparent";

  return (
    <>
      <header className="flex items-center justify-between bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))] w-full h-16 shadow-md mb-4 px-4 border-theme">
        <Link to="/home" className="ml-4">
          <img src={logo} alt="logo" className="w-26 h-8" />
        </Link>

        <nav>
          <ul className="flex items-center flex-row">
            <li>
              <Link to="/home" className={`${navItemBase} ${isActive("/home")}`}>
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/reservations/create"
                className={`${navItemBase} ${isActive("/reservations/create")}`}
              >
                Solicitar Reserva
              </Link>
            </li>
            <li>
              <Link
                to="/reservations"
                className={`${navItemBase} ${isActive("/reservations")}`}
              >
                Minhas Reservas
              </Link>
            </li>

            <li>
              <Link
                to="/user/profile"
                className={`${navItemBase} ${isActive("/user/profile")}`}
              >
                Perfil
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4 pr-4">
          <ThemeModal />
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleLogoutClick}
          >
            Sair
          </button>
        </div>
      </header>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmLogout}
        title="Confirmar Saída"
        message="Tem certeza que deseja sair do sistema?"
      />
    </>
  );
};

export default Header;