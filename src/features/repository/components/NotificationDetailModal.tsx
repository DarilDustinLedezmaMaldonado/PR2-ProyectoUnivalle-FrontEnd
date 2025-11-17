import React from 'react';

interface NotificationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: any;
  onAccept?: () => void;
  onReject?: () => void;
  onMarkRead?: () => void;
}

const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  isOpen,
  onClose,
  notification,
  onAccept,
  onReject,
  onMarkRead,
}) => {
  if (!isOpen || !notification) return null;

  const isInvitation = notification.type === 'invitation';
  const meta = notification.meta || {};

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <i className="fas fa-bell text-yellow-600"></i>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Detalles de notificación</h2>
              <p className="text-sm text-gray-600">
                {isInvitation ? 'Acción requerida en un repositorio' : 'Información del sistema'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Tags */}
        <div className="px-6 py-3 bg-gray-50 flex gap-2">
          <span className={`px-3 py-1 text-xs rounded-full ${
            notification.read 
              ? 'bg-gray-100 text-gray-600' 
              : 'bg-pink-100 text-pink-600'
          }`}>
            {notification.read ? 'Leído' : 'Sin leer'}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
            {notification.type === 'invitation' ? 'Invitación' : 'Notificación'}
          </span>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="flex gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">{notification.title}</h3>
              <p className="text-gray-600">{notification.message}</p>
            </div>
          </div>

          {/* Repository details for invitations */}
          {isInvitation && meta.repositoryName && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex gap-2 mb-3 text-sm">
                <span className="text-blue-600">{meta.repositoryName}</span>
              </div>
              
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded p-3">
                  <p className="text-xs text-gray-500 mb-1">Rol solicitado</p>
                  <p className="text-sm font-medium text-gray-800">
                    {meta.role || 'Miembro'} (lectura/escritura)
                  </p>
                </div>
                <div className="bg-white rounded p-3">
                  <p className="text-xs text-gray-500 mb-1">Fecha</p>
                  <p className="text-sm font-medium text-gray-800">
                    {notification.createdAt ? getTimeAgo(notification.createdAt) : 'Reciente'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500">
            Notificación {notification._id} - Tipo: {notification.type} - Estado: {notification.read ? 'Leído' : 'Sin leer'}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          {isInvitation && onAccept && onReject ? (
            <>
              <div className="flex gap-2">
                <button
                  onClick={onAccept}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  Aceptar
                </button>
                <button
                  onClick={onReject}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Rechazar
                </button>
                {!notification.read && onMarkRead && (
                  <button
                    onClick={onMarkRead}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                  >
                    Marcar leído
                  </button>
                )}
              </div>
              {meta.repository && (
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                  Ver repositorio
                </button>
              )}
            </>
          ) : (
            <div className="flex gap-2 ml-auto">
              {!notification.read && onMarkRead && (
                <button
                  onClick={onMarkRead}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Marcar leído
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;
