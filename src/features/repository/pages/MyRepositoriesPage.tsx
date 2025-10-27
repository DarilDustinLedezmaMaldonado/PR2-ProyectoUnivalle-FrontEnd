import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [files, setFiles] = useState<any[]>([]);

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

  useEffect(() => {
    fetchRepositorios();
    // también cargamos archivos personales
    fetchPersonalFiles();
  }, []);

  const fetchPersonalFiles = async () => {
    try {
      const res = await api.get('/api/files/personal');
      setFiles(res.data || []);
    } catch (error) {
      console.error('Error al obtener archivos personales:', error);
    }
  };

  // Datos de ejemplo (tu diseño) — se muestran si no hay repositorios reales
  const repositoryData = [
    {
      id: 1,
      title: "🔬 Laboratorio de Química",
      description:
        "Documentos y resultados de experimentos del laboratorio de\nquímica orgánica. Proyecto colaborativo del semestre 2025-1.",
      lastUpdate: "📊 Juan Carlos actualizó la documentación ayer",
      files: "8 archivos",
      members: "3 miembros",
      privacy: "🔒 Privado",
      gradientColor: "from-blue-500 to-purple-600",
      collaboratorBadge: "👤 Colaborador",
    },
    {
      id: 2,
      title: "🔬 RX.UNO",
      description:
        "Documentos y resultados de experimentos del laboratorio de\nquímica orgánica. Proyecto colaborativo del semestre 2025-1.",
      lastUpdate: "📊 Juan Carlos actualizó la documentación ayer",
      files: "8 archivos",
      members: "3 miembros",
      privacy: "🔒 Privado",
      gradientColor: "from-blue-600 to-pink-500",
      collaboratorBadge: "👤 Colaborador",
    },
    {
      id: 3,
      title: "🔬 Laboratorio de Química",
      description:
        "Documentos y resultados de experimentos del laboratorio de\nquímica orgánica. Proyecto colaborativo del semestre 2025-1.",
      lastUpdate: "📊 Juan Carlos actualizó la documentación ayer",
      files: "8 archivos",
      members: "3 miembros",
      privacy: "🔒 Privado",
      gradientColor: "from-pink-500 to-pink-400",
      collaboratorBadge: "👤 Colaborador",
    },
  ];

  const fileData = [
    {
      id: 1,
      name: "cartones-bingo-90-bolas.pdf",
      category: "Test",
      privacy: "private",
      date: "13/5/2025",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      name: "Formulario unidad 2.pdf",
      category: "Test",
      tag: "estadística",
      privacy: "private",
      date: "14/5/2025",
      bgColor: "bg-green-50",
    },
    {
      id: 3,
      name: "practica celulas.docx",
      category: "Test",
      tag: "prueba",
      privacy: "public",
      date: "14/5/2025",
      bgColor: "bg-orange-50",
    },
    {
      id: 4,
      name: "Ayuda Memorias (2).docx",
      category: "Pequeña ayuda",
      tags: ["Salud", "Prueba"],
      privacy: "private",
      date: "17/5/2025",
      bgColor: "bg-orange-50",
    },
    {
      id: 5,
      name: "CASO PRACTICO 3.pdf",
      category: "Prueba",
      tags: ["Salud", "Tecnología"],
      privacy: "private",
      date: "17/5/2025",
      bgColor: "bg-green-50",
    },
    {
      id: 6,
      name: "DATAMART VENTAS.pdf",
      category: "Datamart Hansa",
      tags: ["Salud", "Bienestar"],
      privacy: "public",
      date: "17/5/2025",
      bgColor: "bg-blue-50",
    },
    {
      id: 7,
      name: "Labeling_PabloG.docx",
      category: "Practica de PDI",
      tag: "pdi",
      privacy: "private",
      date: "20/5/2025",
      bgColor: "bg-green-50",
    },
  ];

  const renderRepository = (repo: any) => (
    <div key={repo.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Gradient Header */}
      <div className={`h-1 bg-gradient-to-r ${repo.gradientColor}`}></div>

      <div className="p-6">
        {/* Header with title and actions */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800 leading-6">{repo.title}</h3>
          <div className="flex items-center gap-2">
            <button className="p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
              <img src="/images/img_button.png" alt="Action" className="w-9 h-9" />
            </button>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 px-2 py-1 rounded-lg">
                {repo.collaboratorBadge}
              </span>
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors mt-1">
                <img src="/images/img_button_36x36.png" alt="More" className="w-9 h-9" />
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-5 mb-6 whitespace-pre-line">
          {repo.description}
        </p>

        {/* Last Update */}
        <div className="bg-pink-50 rounded-lg p-3 mb-5">
          <span className="text-xs text-gray-600">{repo.lastUpdate}</span>
        </div>

        {/* Footer Stats */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img src="/images/img_.png" alt="Files" className="w-1.5 h-2.5" />
              <span className="text-sm text-gray-600">{repo.files}</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/images/img_10x6.png" alt="Members" className="w-1.5 h-2.5" />
              <span className="text-xs text-gray-600">{repo.members}</span>
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
          <button
            className="text-xs font-medium text-pink-600 bg-pink-50 px-2.5 py-1 rounded-lg"
            onClick={() => {}}
          >
            {repo.privacy}
          </button>
        </div>
      </div>
    </div>
  );

  const renderFile = (file: any) => (
    <div key={file.id} className={`${file.bgColor} rounded-xl p-5 shadow-sm`}>
      {/* File Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <img src="/images/img_14x10.png" alt="File" className="w-2.5 h-3.5" />
          <h4 className="text-base font-bold text-gray-800 leading-5">{file.name}</h4>
        </div>
        {file.id === 2 && (
          <img src="/images/img_1.png" alt="Action" className="w-2.5 h-3.5" />
        )}
        {(file.id === 3 || file.id === 5 || file.id === 6) && (
          <img src="/images/img_12x36.png" alt="Action" className="w-9 h-3" />
        )}
        {file.id === 4 && (
          <img src="/images/img_12x28.png" alt="Action" className="w-7 h-3" />
        )}
      </div>

      {/* Category */}
      <p className="text-sm text-gray-600 leading-4 mb-2">{file.category}</p>

      {/* Tags */}
      {file.tag && (
        <button className="text-xs text-gray-600 bg-gray-100 px-1.5 py-1 rounded-lg mb-3">{file.tag}</button>
      )}
      {file.tags && (
        <div className="flex gap-2 mb-3">
          {file.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="text-xs text-gray-600 bg-gray-100 px-1 py-0.5 rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center">
        <span className={`text-xs leading-3.5 ${
          file.privacy === 'private' ? 'text-pink-600' : 'text-green-600'
        }`}>
          {file.privacy}
        </span>
        <span className="text-xs text-gray-500 leading-3">{file.date}</span>
      </div>
    </div>
  );

  const hasRemote = repositorios && repositorios.length > 0;
  const hasFilesRemote = files && files.length > 0;

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Repositorios</h1>
        <div className="ml-auto">
          <Link
            to="/crear-repositorio"
            className="bg-[var(--color-primary)] text-white px-6 py-2 rounded hover:bg-opacity-30 transition"
          >
            Crear Repositorio
          </Link>
        </div>
      </div>

      {/* Repositories Section */}
      <section className="w-full mb-8">
        <div className="flex flex-col gap-1.5 justify-start items-start w-full">
          <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#e91e63] leading-tight sm:leading-8">
            Repositorios
          </h2>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {hasRemote
              ? repositorios.map((r) => (
                  <div key={r._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r from-blue-500 to-purple-600`}></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800 leading-6">{r.name}</h3>
                        <div className="flex items-center gap-2">
                          <button className="p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                            <img src="/images/img_button.png" alt="Action" className="w-9 h-9" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-5 mb-6">{r.description}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <img src="/images/img_.png" alt="Files" className="w-1.5 h-2.5" />
                            <span className="text-sm text-gray-600">{r.filesCount ?? 0} archivos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <img src="/images/img_10x6.png" alt="Members" className="w-1.5 h-2.5" />
                            <span className="text-xs text-gray-600">{r.members.length} miembros</span>
                          </div>
                        </div>
                        <button className="text-xs font-medium text-pink-600 bg-pink-50 px-2.5 py-1 rounded-lg">{r.privacy || r.type}</button>
                      </div>
                    </div>
                  </div>
                ))
                : repositoryData.map(renderRepository)}
          </div>
        </div>
      </section>

      {/* Files Section */}
      <section className="w-full">
        <div className="flex flex-col gap-5 justify-start items-start w-full">
          <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#e91e63] leading-tight sm:leading-8">
            Mis Archivos
          </h2>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4">
              {hasFilesRemote
                ? files.slice(0, 5).map((f) => {
                    // Adaptar estructura del archivo desde GridFS
                    const file = {
                      id: f._id || f.filename,
                      name: f.filename || f.originalname,
                      category: f.metadata?.title || 'Documento',
                      tag: f.metadata?.tags?.[0] || f.metadata?.tag,
                      tags: f.metadata?.tags,
                      privacy: f.metadata?.privacy || 'private',
                      date: f.uploadDate ? new Date(f.uploadDate).toLocaleDateString() : '',
                      bgColor: 'bg-white',
                    };
                    return renderFile(file);
                  })
                : fileData.slice(0, 5).map(renderFile)}
              <div className="sm:col-span-2 lg:col-span-3 xl:col-span-2">
                {hasFilesRemote
                  ? files.slice(5).map((f) => {
                      const file = {
                        id: f._id || f.filename,
                        name: f.filename || f.originalname,
                        category: f.metadata?.title || 'Documento',
                        tag: f.metadata?.tags?.[0] || f.metadata?.tag,
                        tags: f.metadata?.tags,
                        privacy: f.metadata?.privacy || 'private',
                        date: f.uploadDate ? new Date(f.uploadDate).toLocaleDateString() : '',
                        bgColor: 'bg-white',
                      };
                      return renderFile(file);
                    })
                  : fileData.slice(5).map(renderFile)}
              </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default MyRepositoriesPage;
