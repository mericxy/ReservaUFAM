import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import ConfirmationModal from "./ConfirmationModal";

export default function ModalButton() {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    const { theme, toggleDarkMode, toggleHighContrast, THEMES } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                className="bg-rgb(var(--color-bg)) text-[rgb(var(--color-text))] border-theme-strong px-4 py-2 rounded-lg hover:text-blue-500 transition-colors font-medium"
            >
                Configurações
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg p-4 w-80 border border-gray-200 z-50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Configurações
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">
                                Ativar tema escuro
                            </span>
                            <ThemeToggle
                                isActive={theme === "dark"}
                                onToggle={toggleDarkMode}
                                label="Alternar tema"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">
                                Ativar alto contraste
                            </span>
                            <ThemeToggle
                                label="Ativar alto contraste"
                                isActive={theme === THEMES.HC}
                                onToggle={toggleHighContrast}
                                activeColor="bg-yellow-500"
                            />
                        </div>
                        <div className="flex items-center justify-end mt-4">
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-300 shadow-md"
                                onClick={handleLogoutClick}
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmLogout}
                title="Confirmar Saída"
                message="Tem certeza que deseja sair do sistema?"
            />
        </div>
    );
}
