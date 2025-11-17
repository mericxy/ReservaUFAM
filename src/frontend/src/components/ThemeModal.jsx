import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import ConfirmationModal from "./ConfirmationModal";

export default function ModalButton() {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    const { theme, toggleDarkMode, toggleHighContrast, THEMES } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        setIsModalOpen(true);
    };

    const confirmLogout = () => {
        logout();
        navigate("/"); 
        setIsModalOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                aria-expanded={isOpen}
                className="btn btn-secondary text-sm"
            >
                <FiSettings className="text-lg" aria-hidden="true" />
                Configurações
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 bg-[rgb(var(--color-bg))] rounded-lg shadow-lg p-4 w-80 border-theme z-50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">
                            Configurações
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-[rgb(var(--color-text-grays))] hover:text-[rgb(var(--color-text))] text-xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-[rgb(var(--color-bg))] rounded-lg">
                            <span className="text-[rgb(var(--color-text))]">
                                Ativar tema escuro
                            </span>
                            <ThemeToggle
                                isActive={theme === "dark"}
                                onToggle={toggleDarkMode}
                                label="Alternar tema"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-[rgb(var(--color-bg))] rounded-lg">
                            <span className="text-[rgb(var(--color-text))]">
                                Ativar alto contraste
                            </span>
                            <ThemeToggle
                                label="Ativar alto contraste"
                                isActive={theme === THEMES.HC}
                                onToggle={toggleHighContrast}
                                activeColor="bg-yellow-500"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
