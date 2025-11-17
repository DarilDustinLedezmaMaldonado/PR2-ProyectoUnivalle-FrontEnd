import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import api from "../../../utils/api";
import { FiMail, FiArrowLeft } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post('/api/password-reset/request', { email });
      setMessage(response.data.message);
      setEmail(""); // Limpiar el campo
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center w-full max-w-md mx-auto">
        {/* Icono circular */}
        <div className="w-14 h-14 bg-[var(--color-primary)] rounded-full mb-4 flex items-center justify-center">
          <FiMail className="text-white text-2xl" />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Recuperar contraseña
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Te enviaremos un enlace para restablecerla
        </p>

        {/* Mensajes */}
        {message && (
          <div className="w-full mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-5">
            <label htmlFor="email" className="sr-only">Correo electrónico</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm transition-colors"
                placeholder="tu@correo.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Volver al login */}
          <Link 
            to="/account/login" 
            className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 mb-4 justify-center"
          >
            <FiArrowLeft /> Volver al inicio de sesión
          </Link>

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </form>

        {/* Información adicional */}
        <p className="text-xs text-gray-500 mt-6 text-center">
          Recibirás un correo con un enlace para restablecer tu contraseña. 
          El enlace expira en 1 hora.
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
