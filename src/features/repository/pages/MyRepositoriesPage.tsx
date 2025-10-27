import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../../utils/api";

interface Repository {
  _id: string;
  name: string;
  description?: string;
  type: string;
  privacy?: string;
  owner: string;
  members: string[];
  createdAt: string;
  filesCount?: number;
}

const MyRepositoriesPage: React.FC = () => {
  const [repositorios, setRepositorios] = useState<Repository[]>([]);

  const fetchRepositorios = async () => {
    try {
      const res = await api.get("/api/repositorios/mis-repositorios");
      const data = res.data as Repository[];
      setRepositorios(data);

      // Obtener contador de archivos por repositorio en paralelo
      try {
        const counts = await Promise.all(
          data.map(async (r) => {
            const resp = await api.get(`/api/repositorios/repositorio/${r._id}`);
            return Array.isArray(resp.data) ? resp.data.length : 0;
          })
        );
        // Adjuntamos filesCount a cada repositorio
        setRepositorios((prev) => prev.map((p, i) => ({ ...p, filesCount: counts[i] })) as any);
      } catch (err) {
        console.warn('No se pudieron cargar los contadores de archivos por repositorio', err);
      }
    } catch (err: any) {
      console.error(err);
      // No bloquear la UI: dejamos que se muestre contenido de ejemplo
    }
  };

  const location = useLocation();

  useEffect(() => {
    fetchRepositorios();
  }, [location.key]);

  

  const renderRepository = (repo: any, idx?: number) => {
    const repoId = repo._id ?? repo.id;
    const title = repo.title ?? repo.name ?? 'Repositorio';
    const description = repo.description ?? repo.description ?? '';
    const lastUpdate = repo.lastUpdate ?? `📊 ${repo.owner?.username ?? 'Usuario'} actualizó la documentación ayer`;
    const filesLabel = repo.files ?? (typeof repo.filesCount === 'number' ? `${repo.filesCount} archivos` : '0 archivos');
    const membersLabel = Array.isArray(repo.members) ? `${repo.members.length} miembros` : (repo.members ?? '0 miembros');
    const privacyLabel = repo.privacy ?? repo.type ?? 'Privado';
    const gradientList = [
      'from-blue-500 to-purple-600',
      'from-blue-600 to-pink-500',
      'from-pink-500 to-pink-400',
      'from-green-400 to-blue-500',
    ];
    const gradientColor = repo.gradientColor ?? gradientList[idx ?? 0 % gradientList.length];

    return (
      <Link key={repoId} to={`/file-repository?repoId=${repoId}`} className="block">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Gradient Header */}
      <div className={`h-1 bg-gradient-to-r ${gradientColor}`}></div>

      <div className="p-6">
        {/* Header with title and actions */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800 leading-6">{title}</h3>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 px-2 py-1 rounded-lg">
                {repo.collaboratorBadge}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-5 mb-6 whitespace-pre-line">
          {description}
        </p>

        {/* Last Update */}
        <div className="bg-pink-50 rounded-lg p-3 mb-5">
          <span className="text-xs text-gray-600">{lastUpdate}</span>
        </div>

        {/* Footer Stats */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img src="/images/img_.png" alt="Files" className="w-1.5 h-2.5" />
              <span className="text-sm text-gray-600">{filesLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/images/img_10x6.png" alt="Members" className="w-1.5 h-2.5" />
              <span className="text-xs text-gray-600">{membersLabel}</span>
            </div>
            <div className="flex items-center -space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs font-bold text-white">J</span>
              </div>
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs font-bold text-white">P</span>
              </div>
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs font-bold text-white">L</span>
              </div>
            </div>
          </div>
          <button className="text-xs font-medium text-pink-600 bg-pink-50 px-2.5 py-1 rounded-lg">
            {privacyLabel}
          </button>
        </div>
      </div>
      </div>
    </Link>
    );
  };

  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Repositories Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Mis Repositorios</h2>
          <Link
            to="/crear-repositorio"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuevo Repositorio
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(repositorios.length > 0 ? repositorios : []).map((repo, idx) =>
            renderRepository(repo, idx)
          )}
        </div>
      </section>
      
    </div>
  );

};

export default MyRepositoriesPage;
