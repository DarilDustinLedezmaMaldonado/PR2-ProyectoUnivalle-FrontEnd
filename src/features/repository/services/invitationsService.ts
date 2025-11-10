import api from '../../../utils/api';

const base = '/api/invitations';

export const invitationsService = {
  // Send invitations to repository
  sendInvites: (repoId: string, emails: string[], role?: string, message?: string) =>
    api.post(`${base}/repos/${repoId}/invite`, { emails, role, message }),

  // Get repository invitations (for owner)
  getRepositoryInvitations: (repoId: string) =>
    api.get(`${base}/repos/${repoId}/invitations`),

  // Get my invitations (for current user)
  getMyInvitations: () => api.get(`${base}/invitations`),

  // Accept/Reject/Cancel invitations
  acceptInvitation: (invId: string) => api.post(`${base}/invitations/${invId}/accept`),
  rejectInvitation: (invId: string) => api.post(`${base}/invitations/${invId}/reject`),
  cancelInvitation: (invId: string) => api.post(`${base}/invitations/${invId}/cancel`),

  // Notifications
  getNotifications: () => api.get(`${base}/notifications`),
  markNotificationRead: (id: string) => api.post(`${base}/notifications/${id}/read`),
  markAllNotificationsRead: () => api.post(`${base}/notifications/read-all`),

  // Repository members
  getRepositoryMembers: (repoId: string) => api.get(`${base}/repos/${repoId}/members`),
  removeMember: (repoId: string, memberId: string) =>
    api.post(`${base}/repos/${repoId}/remove-member`, { memberId }),
};

export default invitationsService;
