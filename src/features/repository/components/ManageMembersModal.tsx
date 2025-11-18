import React, { useState, useEffect } from 'react';
import invitationsService from '../services/invitationsService';

interface ManageMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  repositoryId: string;
  repositoryName: string;
  isOwner: boolean;
}

interface Member {
  _id: string;
  username: string;
  email: string;
  nombre?: string;
  apellido?: string;
  profileImage?: string;
}

const ManageMembersModal: React.FC<ManageMembersModalProps> = ({
  isOpen,
  onClose,
  repositoryId,
  repositoryName,
  isOwner,
}) => {
  const [owner, setOwner] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMembers();
    }
  }, [isOpen, repositoryId]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await invitationsService.getRepositoryMembers(repositoryId);
      setOwner(res.data.owner);
      setMembers(res.data.members || []);
    } catch (err) {
      console.error('Error loading members', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      await invitationsService.removeMember(repositoryId, memberToRemove._id);
      alert('Miembro eliminado correctamente');
      setMemberToRemove(null);
      loadMembers();
    } catch (err: any) {
      console.error('Error removing member', err);
      alert(err?.response?.data?.message || 'Error al eliminar miembro');
    }
  };

  const getDisplayName = (member: Member) => {
    if (member.nombre && member.apellido) {
      return `${member.nombre} ${member.apellido}`;
    }
    return member.username;
  };

  if (!isOpen) return null;

  return (
    <>
          return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4 flex justify-between items-center">
            <div className="text-white">
              <h2 className="text-xl font-semibold">Miembros del repositorio</h2>
              <p className="text-pink-100 text-sm">{repositoryName}</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-pink-100">
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {loading ? (
              <p className="text-center py-8">Cargando...</p>
            ) : (
              <>
                {/* Owner */}
                {owner && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                          {owner.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{getDisplayName(owner)}</h3>
                          <p className="text-sm text-gray-600">{owner.email}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                        Propietario
                      </span>
                    </div>
                  </div>
                )}

                {/* Members */}
                <h3 className="text-sm font-semibold text-gray-700 pt-4">
                  Miembros ({members.length})
                </h3>
                
                {members.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No hay miembros en este repositorio
                  </p>
                ) : (
                  members.map((member) => (
                    <div key={member._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-semibold text-gray-600">
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{getDisplayName(member)}</h3>
                            <p className="text-sm text-gray-600">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                            Miembro
                          </span>
                          {isOwner && (
                            <button
                              onClick={() => setMemberToRemove(member)}
                              className="text-red-600 hover:text-red-800 px-2"
                              title="Eliminar miembro"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Role descriptions */}
                <div className="pt-4 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700">Roles disponibles</h3>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Miembro</h3>
                        <p className="text-sm text-gray-600">
                          Puede leer y subir archivos, comentar y colaborar.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 border-2 border-gray-300 rounded-full"></div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Administrador</h3>
                        <p className="text-sm text-gray-600">
                          Gestiona usuarios, roles y configuración del repositorio.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Remove Member Confirmation Modal */}
      {memberToRemove && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden animate-slideUp">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Advertencia</h2>
              <button
                onClick={() => setMemberToRemove(null)}
                className="text-white hover:text-pink-100"
              >
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>

            <div className="px-8 py-10 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">¿Estás seguro de</h3>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">eliminar este usuario?</h3>
              <p className="text-gray-600 mb-6">{getDisplayName(memberToRemove)}</p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleRemoveMember}
                  className="px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition font-medium"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => setMemberToRemove(null)}
                  className="px-8 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageMembersModal;
