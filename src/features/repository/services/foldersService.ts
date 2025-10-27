import api from '../../../utils/api';

const http = api;

export const listFolders = async (repositoryId: string, parent: string | null = null) => {
  const params = new URLSearchParams();
  params.append('repositoryId', repositoryId);
  if (parent !== undefined) params.append('parent', parent === null ? 'null' : parent);

  const res = await http.get(`/api/folders?${params.toString()}`);
  return res.data;
};

export const createFolder = async (name: string, repositoryId: string, parent: string | null = null) => {
  const body = { name, repositoryId, parent };
  const res = await http.post('/api/folders', body);
  return res.data;
};

export const getFolderAncestors = async (folderId: string) => {
  const res = await http.get(`/api/folders/${folderId}`);
  return res.data;
};
