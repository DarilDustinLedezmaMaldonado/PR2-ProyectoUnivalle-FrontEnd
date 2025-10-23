import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pr2-proyectounivalle-backend.onrender.com';

console.log('🚀 API_BASE_URL:', API_BASE_URL); // Debug log
console.log('🚀 Configuración de API cargada');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Aumentado a 30 segundos para Render
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log minimal request info to help debug network issues in production
    try {
      const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
      // don't log sensitive tokens fully
      const authHeader = config.headers?.Authorization as string | undefined;
      const authSnippet = authHeader ? `${authHeader.slice(0, 15)}...` : 'no-token';
      console.log('📤 API Request:', { method: config.method, url: fullUrl, authSnippet });
    } catch (e) {
      /* ignore logging errors */
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
    (response) => {
      console.log('Respuesta de API:', response);
      return response;
    },
    (error) => {
      // Diferenciar Network Error de respuestas HTTP
      if (error.request && !error.response) {
        // Fallo de red (CORS, DNS, servidor caído, bloqueo del navegador)
        console.error('Network or CORS error when calling API:', {
          message: error.message,
          request: {
            method: error.config?.method,
            url: `${error.config?.baseURL || ''}${error.config?.url || ''}`,
            headers: error.config?.headers,
          },
        });
      } else {
        console.error('Error de API:', error);
      }

      if (error.response?.status === 401) {
        console.error("No autorizado. Redirigiendo al login...");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
);

export default api;