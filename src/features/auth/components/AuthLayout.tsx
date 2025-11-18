import React, { useState, useEffect } from "react";
import api from "../../../utils/api";


interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await api.get('/api/config/logo-univalle');
        setLogoUrl(response.data.value);
      } catch (error) {
        console.error('Error al cargar logo:', error);
        // Usar logo local como fallback
        setLogoUrl('/src/assets/logoUnivalleBlanco.png');
      }
    };

    loadLogo();
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen px-4 overflow-hidden bg-gradient-to-br from-white   to-[var(--color-primarytwo)]">
      <div className="flex flex-col md:flex-row h-full w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primarytwo)]">
          <div className="w-full h-full flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-500 ease-in-out">
            <img 
              src={logoUrl || '/src/assets/logoUnivalleBlanco.png'} 
              alt="Logo Univalle" 
              className="w-64 h-64"
            />
            <p className="px-14 text-white text-sm md:text-lg mt-6">
              Tu plataforma académica para organizar, compartir y colaborar en tus archivos de estudio.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 bg-gray-50">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;