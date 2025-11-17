import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import api from "../../../utils/api";
import { FiLock, FiArrowLeft, FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(false);

  // Validaciones de contraseña
  const passwordValidations = {
    length: newPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasLowerCase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordValidations).every(v => v);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";

  // Verificar token al cargar
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Token no proporcionado');
        setVerifying(false);
        setTokenValid(false);
        return;
      }

      try {
        await api.get(`/api/password-reset/verify/${token}`);
        setTokenValid(true);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Token inválido o expirado');
        setTokenValid(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      setError('La contraseña no cumple con todos los requisitos');
      return;
    }

    if (!passwordsMatch) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post('/api/password-reset/reset', {
        token,
        newPassword
      });
      
      setMessage(response.data.message);
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/account/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
          <p className="mt-4 text-gray-600">Verificando token...</p>
        </div>
      </AuthLayout>
    );
  }

  if (!tokenValid) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <div className="w-14 h-14 bg-red-500 rounded-full mb-4 flex items-center justify-center">
            <FiLock className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Token inválido
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            El enlace ha expirado o es inválido
          </p>
          <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
          <Link 
            to="/account/forgot-password" 
            className="w-full py-2 rounded bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition text-center block"
          >
            Solicitar nuevo enlace
          </Link>
          <Link 
            to="/account/login" 
            className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 mt-4 justify-center"
          >
            <FiArrowLeft /> Volver al inicio de sesión
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center w-full max-w-md mx-auto">
        {/* Icono circular */}
        <div className="w-14 h-14 bg-[var(--color-primary)] rounded-full mb-4 flex items-center justify-center">
          <FiLock className="text-white text-2xl" />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Restablecer contraseña
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Define una nueva contraseña segura
        </p>

        {/* Mensajes */}
        {message && (
          <div className="w-full mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm flex items-center gap-2">
            <FiCheckCircle className="flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full">
          {/* Nueva contraseña */}
          <div className="mb-3">
            <label htmlFor="newPassword" className="sr-only">Nueva contraseña</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm transition-colors"
                placeholder="Nueva contraseña"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="sr-only">Repetir contraseña</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm focus:ring-2 sm:text-sm transition-colors ${
                  confirmPassword && !passwordsMatch 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]'
                }`}
                placeholder="Repite la contraseña"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
            )}
          </div>

          {/* Requisitos de contraseña */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-xs font-semibold text-gray-700 mb-2">Requisitos de contraseña:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className={`flex items-center gap-2 ${passwordValidations.length ? 'text-green-600' : ''}`}>
                <span>{passwordValidations.length ? '✓' : '○'}</span>
                Al menos 8 caracteres
              </li>
              <li className={`flex items-center gap-2 ${passwordValidations.hasUpperCase ? 'text-green-600' : ''}`}>
                <span>{passwordValidations.hasUpperCase ? '✓' : '○'}</span>
                Una letra mayúscula
              </li>
              <li className={`flex items-center gap-2 ${passwordValidations.hasLowerCase ? 'text-green-600' : ''}`}>
                <span>{passwordValidations.hasLowerCase ? '✓' : '○'}</span>
                Una letra minúscula
              </li>
              <li className={`flex items-center gap-2 ${passwordValidations.hasNumber ? 'text-green-600' : ''}`}>
                <span>{passwordValidations.hasNumber ? '✓' : '○'}</span>
                Un número
              </li>
              <li className={`flex items-center gap-2 ${passwordValidations.hasSymbol ? 'text-green-600' : ''}`}>
                <span>{passwordValidations.hasSymbol ? '✓' : '○'}</span>
                Un símbolo (!@#$%^&*...)
              </li>
            </ul>
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
            disabled={loading || !isPasswordValid || !passwordsMatch}
            className="w-full py-2 rounded bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
