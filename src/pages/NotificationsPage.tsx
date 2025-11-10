import React, { useEffect, useState } from 'react';
import invitationsService from '../features/repository/services/invitationsService';
import NotificationDetailModal from '../features/repository/components/NotificationDetailModal';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  meta?: any;
  createdAt: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | string>('all');
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await invitationsService.getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Error cargando notificaciones', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications =
    filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await invitationsService.acceptInvitation(invitationId);
      alert('Invitación aceptada correctamente');
      await loadNotifications();
      setShowDetailModal(false);
    } catch (err: any) {
      console.error('Error al aceptar invitación', err);
      alert(err?.response?.data?.message || 'Error al aceptar la invitación');
    }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    try {
      await invitationsService.rejectInvitation(invitationId);
      alert('Invitación rechazada');
      await loadNotifications();
      setShowDetailModal(false);
    } catch (err: any) {
      console.error('Error al rechazar invitación', err);
      alert(err?.response?.data?.message || 'Error al rechazar la invitación');
    }
  };

  const handleMarkAsRead = async (notifId: string) => {
    try {
      await invitationsService.markNotificationRead(notifId);
      await loadNotifications();
    } catch (err) {
      console.error('Error al marcar como leída', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await invitationsService.markAllNotificationsRead();
      await loadNotifications();
      alert('Todas las notificaciones marcadas como leídas');
    } catch (err) {
      console.error('Error al marcar todas como leídas', err);
    }
  };

  const openNotificationDetail = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
  };

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
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center mb-4">🔔 Notificaciones</h1>

      <div className="flex items-center justify-between mb-4">
        <div className="space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md border ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('invitation')}
            className={`px-3 py-1 rounded-md border ${
              filter === 'invitation' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            Invitaciones
          </button>
          <button
            onClick={() => setFilter('invitationAccepted')}
            className={`px-3 py-1 rounded-md border ${
              filter === 'invitationAccepted' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            Aceptadas
          </button>
          <button
            onClick={() => setFilter('invitationRejected')}
            className={`px-3 py-1 rounded-md border ${
              filter === 'invitationRejected' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            Rechazadas
          </button>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="text-sm text-pink-600 hover:underline"
        >
          Marcar todas como leídas
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <i className="fas fa-bell-slash text-4xl text-gray-300 mb-3"></i>
              <p className="text-xl text-gray-500">No tienes notificaciones</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n._id}
                className={`border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition cursor-pointer ${
                  !n.read ? 'border-l-4 border-l-pink-500' : ''
                }`}
                onClick={() => openNotificationDetail(n)}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{n.title}</h3>
                      {!n.read && (
                        <span className="px-2 py-0.5 bg-pink-100 text-pink-600 text-xs rounded-full">
                          Nuevo
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {getTimeAgo(n.createdAt)}
                    </p>
                  </div>
                  {n.type === 'invitation' && n.meta?.invitation && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptInvitation(n.meta.invitation);
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectInvitation(n.meta.invitation);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        notification={selectedNotification}
        onAccept={
          selectedNotification?.type === 'invitation' && selectedNotification?.meta?.invitation
            ? () => handleAcceptInvitation(selectedNotification.meta.invitation)
            : undefined
        }
        onReject={
          selectedNotification?.type === 'invitation' && selectedNotification?.meta?.invitation
            ? () => handleRejectInvitation(selectedNotification.meta.invitation)
            : undefined
        }
        onMarkRead={
          selectedNotification && !selectedNotification.read
            ? () => handleMarkAsRead(selectedNotification._id)
            : undefined
        }
      />
    </div>
  );
};

export default NotificationsPage;
