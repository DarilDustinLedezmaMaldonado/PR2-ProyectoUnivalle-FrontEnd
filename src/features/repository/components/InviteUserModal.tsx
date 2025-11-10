import React, { useState, useEffect } from 'react';
import invitationsService from '../services/invitationsService';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  repositoryId: string;
  repositoryName: string;
}

interface PendingInvitation {
  _id: string;
  recipientEmail: string;
  role: string;
  status: string;
  createdAt: string;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  repositoryId,
  repositoryName,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [role, setRole] = useState('Miembro');
  const [message, setMessage] = useState('');
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPendingInvitations();
    }
  }, [isOpen, repositoryId]);

  const loadPendingInvitations = async () => {
    try {
      const res = await invitationsService.getRepositoryInvitations(repositoryId);
      setPendingInvitations(res.data.filter((inv: any) => inv.status === 'pending'));
    } catch (err) {
      console.error('Error loading invitations', err);
    }
  };

  const handleSendInvitations = async () => {
    const emails = emailInput
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e);

    if (emails.length === 0) {
      alert('Por favor ingresa al menos un correo electrónico');
      return;
    }

    setLoading(true);
    try {
      await invitationsService.sendInvites(repositoryId, emails, role, message);
      alert('Invitaciones enviadas correctamente');
      setEmailInput('');
      setMessage('');
      loadPendingInvitations();
    } catch (err: any) {
      console.error('Error sending invitations', err);
      alert(err?.response?.data?.message || 'Error al enviar invitaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await invitationsService.cancelInvitation(invitationId);
      loadPendingInvitations();
      alert('Invitación cancelada');
    } catch (err) {
      console.error('Error cancelling invitation', err);
      alert('Error al cancelar invitación');
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 h';
    if (diffInHours < 24) return `Hace ${diffInHours} h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-semibold">Invitar usuario</h2>
            <p className="text-pink-100 text-sm">{repositoryName} - Gestionar miembros y permisos</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-pink-100">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Left column - Form */}
          <div className="col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correos a invitar
              </label>
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="correo@ejemplo.com"
              />
              <p className="text-xs text-gray-500 mt-1">Separa múltiples correos con coma</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol en el repositorio
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none"
                >
                  <option value="Miembro">Miembro</option>
                  <option value="Administrador">Administrador</option>
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-3 text-gray-400 pointer-events-none"></i>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje (Opcional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent h-32 resize-none"
                placeholder="Escribe un mensaje personalizado..."
              ></textarea>
            </div>
          </div>

          {/* Right column - Pending invitations */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Invitaciones pendientes ({pendingInvitations.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pendingInvitations.map((inv) => (
                <div key={inv._id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {inv.recipientEmail}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getTimeAgo(inv.createdAt)} • Enviada
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      Enviada
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                      Pendiente
                    </span>
                  </div>
                  <button
                    onClick={() => handleCancelInvitation(inv._id)}
                    className="w-full mt-2 px-3 py-1 bg-pink-500 text-white text-xs rounded-md hover:bg-pink-600"
                  >
                    Cancelar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSendInvitations}
            disabled={loading}
            className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar invitaciones'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteUserModal;
