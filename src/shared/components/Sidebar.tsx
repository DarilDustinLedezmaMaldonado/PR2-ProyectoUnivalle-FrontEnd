import React from 'react';
import './Sidebar.css';
import { FiHome, FiFolder, FiLogOut, FiBell, FiUser, FiUsers } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarNavigation: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Elimina el usuario en localStorage
    localStorage.removeItem('user');

    // Si defines VITE_FRONTEND_URL en Vercel (por ejemplo https://tu-app.vercel.app),
    // usaremos esa URL para redirigir al cerrar sesión. Si no está definida,
    // redirigimos a la raíz relativa '/'.
    const env = import.meta.env as Record<string, string | undefined>;
    const frontendUrl = env.VITE_FRONTEND_URL;

    window.location.href = frontendUrl ?? '/';
  };

  const handleNavigateProfile = () => {
    navigate("/profile");
  };

  const menuItems = [
    { id: 1, icon: <FiHome className="w-5 h-5" />, label: "Inicio", onClick: () => navigate("/home") },
    { id: 2, icon: <FiFolder className="w-5 h-5" />, label: "Mis Repositorios", onClick: () => navigate("/mis-repositorios") },
    { id: 3, icon: <FiBell className="w-5 h-5" />, label: "Notificaciones", onClick: () => navigate("/notificaciones") },
    { id: 4, icon: <FiUsers className="w-5 h-5" />, label: "Usuarios", onClick: () => navigate("/usuarios") },
    { id: 5, icon: <FiUser className="w-5 h-5" />, label: "Mi Perfil", onClick: handleNavigateProfile },
    { id: 6, icon: <FiLogOut className="w-5 h-5" />, label: "Cerrar sesión", onClick: handleLogout },
    
  ];

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <>
      {/* Fondo oscuro solo en móvil cuando está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 custom-scrollbar`}
      >
        {/* Perfil */}
        <div
          className="flex flex-col items-center py-6 border-b border-gray-200 dark:border-gray-700 mt-16 cursor-pointer"
          onClick={handleNavigateProfile}
        >
          <div className="relative w-24 h-24 mb-3 overflow-hidden rounded-full ring-4 ring-gray-100 dark:ring-gray-700">
            <img
              src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
              }}
            />
          </div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">{user.username || "Usuario"}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email || "correo@ejemplo.com"}</p>
        </div>

        {/* Navegación con scroll y botón de logout fijo abajo */}
        <div className="flex flex-col h-[calc(100vh-180px)]">
          <nav className="flex-1 overflow-y-auto px-4 pt-6 pb-12 custom-scrollbar">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={item.onClick}
                    className="flex items-center w-full px-4 py-3 text-left text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                  >
                    <span className="group-hover:text-[var(--color-primary)] dark:group-hover:text-blue-400">
                      {item.icon}
                    </span>
                    <span className="ml-3 font-medium group-hover:text-[var(--color-primary)] dark:group-hover:text-blue-400">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          {/* (Se eliminó el botón fijo) */}
        </div>
      </aside>
    </>
  );
};

export default SidebarNavigation;
