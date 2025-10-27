import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { FiX, FiUpload, FiFolder, FiChevronLeft, FiPlus } from "react-icons/fi";
import { debounce } from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FileCard from "../components/FileCard";
import { File } from "../types/file"; 
import { fetchPersonalRepositoryId, fetchFilesByRepositoryId } from "../services/filesService";
import { listFolders, createFolder, getFolderAncestors } from "../services/foldersService";
import ArchivoModal from "../components/FileModal";
import api from '../../../utils/api';

  const FileVisualization = () => {
    const [showModal, setShowModal] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [allFiles, setAllFiles] = useState<File[]>([]);
    const [folders, setFolders] = useState<any[]>([]);
    const [folderId, setFolderId] = useState<string | null>(null);
    const [folderStack, setFolderStack] = useState<string[]>([]);
    const [creatingFolder, setCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [currentFolderName, setCurrentFolderName] = useState<string | null>(null);
    const [breadcrumbs, setBreadcrumbs] = useState<Array<{_id: string | null, name: string}>>([{_id: null, name: 'Raíz'}]);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [fileType, setFileType] = useState("todos");
    const [importanceLevel, setImportanceLevel] = useState(0);
    const [loading, setLoading] = useState(false);
    const [repositoryId, setRepositoryId] = useState<string | null>(null);
  const [repositoryName, setRepositoryName] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
  
    useEffect(() => {
    const handler = debounce((term: string) => {
        setLoading(true);
        const filtered = allFiles.filter(file =>
          file.filename.toLowerCase().includes(term.toLowerCase())
        );
        setFiles(filtered);
        setLoading(false);
      }, 300);

      handler(searchTerm);

      return () => {
        handler.cancel();
      };
    }, [searchTerm, allFiles]);

    const fetchAndSetFiles = async (repoId: string, parentFolderId: string | null = null) => {
  setLoading(true);
  const realFiles = await fetchFilesByRepositoryId(repoId, parentFolderId ?? undefined);
  setAllFiles(realFiles);
  setFiles(realFiles);
    // fetch repository name from user's repos
    try {
      const reposRes = await api.get('/api/repositorios/mis-repositorios');
      const repos = reposRes.data || [];
      const found = repos.find((r: any) => (r._id || r.id) === repoId);
      if (found) setRepositoryName(found.name || found.title || 'Repositorio');
    } catch (e) {
      // ignore name fetch errors
    }
  setLoading(false);
};

  const fetchAndSetFolders = async (repoId: string, parent: string | null = null) => {
    try {
      const res = await listFolders(repoId, parent);
      setFolders(res || []);
    } catch (err) {
      setFolders([]);
    }
  };

  const fetchAndSetBreadcrumbs = async (repoId: string, folderIdParam: string | null) => {
    try {
      if (!folderIdParam) {
        setBreadcrumbs([{ _id: null, name: 'Raíz' }]);
        return;
      }
      const res = await getFolderAncestors(folderIdParam);
      // res is array root->current
      const mapped = res.map((f: any) => ({ _id: f._id, name: f.name }));
      setBreadcrumbs([{ _id: null, name: 'Raíz' }, ...mapped]);
      // set current folder name
      const last = mapped[mapped.length - 1];
      setCurrentFolderName(last?.name ?? null);
    } catch (err) {
      setBreadcrumbs([{ _id: null, name: 'Raíz' }]);
    }
  };

    // Obtener el repositoryId
  useEffect(() => {
  const fetchRepoAndFiles = async () => {
    try {
      // Priorizar repoId pasado por query param: /file-repository?repoId=...
      const params = new URLSearchParams(location.search);
      const repoIdParam = params.get('repoId');
      const folderIdParam = params.get('folderId');

      if (repoIdParam) {
        setRepositoryId(repoIdParam);
        setFolderId(folderIdParam);
        setCurrentFolderName(null);
        await Promise.all([
          fetchAndSetFiles(repoIdParam, folderIdParam),
          fetchAndSetFolders(repoIdParam, folderIdParam),
          fetchAndSetBreadcrumbs(repoIdParam, folderIdParam),
        ]);
        return;
      }

      // Fallback: repository personal
      const id = await fetchPersonalRepositoryId();
      setRepositoryId(id);
      await Promise.all([fetchAndSetFiles(id, null), fetchAndSetFolders(id, null), fetchAndSetBreadcrumbs(id, null)]);
    } catch {
      setLoading(false);
    }
  };
  fetchRepoAndFiles();
}, []);
  
    const resetFilters = () => {
      setSearchTerm("");
      setDateRange([null, null]);
      setFileType("todos");
      setImportanceLevel(0);
      setFiles([]);
    };

    const enterFolder = async (folder: any) => {
      // push current folderId to stack
      setFolderStack(prev => [...prev, folderId || '']);
      const newFolderId = folder._id || folder.id;
      setFolderId(newFolderId);
      setCurrentFolderName(folder.name || 'Carpeta');
      // update url
      navigate(`${location.pathname}?repoId=${repositoryId}&folderId=${newFolderId}`);
      await Promise.all([fetchAndSetFiles(repositoryId!, newFolderId), fetchAndSetFolders(repositoryId!, newFolderId)]);
    };

    const goBack = async () => {
      setFolderStack(prev => {
        if (prev.length === 0) {
          // go to root
          setFolderId(null);
          navigate(`${location.pathname}?repoId=${repositoryId}`);
          fetchAndSetFiles(repositoryId!, null);
          fetchAndSetFolders(repositoryId!, null);
          setCurrentFolderName(null);
          return [];
        }

        const newStack = [...prev];
        const last = newStack.pop()!;
        const newFolderId = last || null;
        setFolderId(newFolderId);
        navigate(`${location.pathname}?repoId=${repositoryId}${newFolderId ? `&folderId=${newFolderId}` : ''}`);
        fetchAndSetFiles(repositoryId!, newFolderId);
        fetchAndSetFolders(repositoryId!, newFolderId);
        return newStack;
      });
    };

    const handleCreateFolder = async () => {
      if (!newFolderName.trim() || !repositoryId) return;
      try {
        await createFolder(newFolderName.trim(), repositoryId, folderId ?? null);
        setNewFolderName('');
        setCreatingFolder(false);
        await fetchAndSetFolders(repositoryId, folderId ?? null);
      } catch (err) {
        // ignore for now
      }
    };

    const handleUploaded = async () => {
      if (!repositoryId) return;
      setLoading(true);
      try {
        await Promise.all([
          fetchAndSetFiles(repositoryId, folderId ?? null),
          fetchAndSetFolders(repositoryId, folderId ?? null),
        ]);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-[var(--color-primary)] text-3xl font-bold text-center">
            {repositoryName ?? 'Mis Archivos'}
          </h1>
          {repositoryId && (
            <button
              onClick={() => {
                const email = prompt('Ingrese el email del participante a añadir:');
                if (email) {
                  // TODO: llamar al endpoint para añadir participante cuando exista
                  alert(`Solicitud para añadir participante: ${email}`);
                }
              }}
              className="ml-4 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Añadir participantes
            </button>
          )}
        </div>
  
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar archivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 rounded-lg border border-[var(--color-primarytwo)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none focus:border-transparent placeholder-[var(--color-primarytwo)]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
  
          <div className="mt-4 flex flex-wrap gap-4">
            <DatePicker
              selectsRange
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update: [Date | null, Date | null] | null) => setDateRange(update || [null, null])}
              className="p-2 border rounded-md placeholder-[var(--color-primarytwo)] border-[var(--color-primarytwo)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none focus:border-transparent"
              placeholderText="Seleccionar fechas"
            />
  
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="p-2 border rounded-md border-[var(--color-primarytwo)] text-[var(--color-primarytwo)]"
            >
              <option value="todos">Todos los tipos</option>
              <option value="documento">Documento</option>
              <option value="carpeta">Carpeta</option>
            </select>
  
            <select
              value={importanceLevel}
              onChange={(e) => setImportanceLevel(Number(e.target.value))}
              className="p-2 border rounded-md border-[var(--color-primarytwo)] text-[var(--color-primarytwo)]"
            >
              <option value={0}>Importancia</option>
              {[1, 2, 3, 4, 5].map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
  
            <button
              onClick={resetFilters}
              className="text-[var(--color-secondarytwo)] px-4 py-2 bg-white-200 border border-[var(--color-secondarytwo)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] rounded-md transition-colors"
            >
              Resetear filtros
            </button>
            <div className="ml-auto">
              <button
                onClick={() => setShowModal(true)}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FiUpload className="text-xl" />
                Subir Archivo
              </button>

            </div>

            

          </div>
        </div>

        {showModal && repositoryId && (
          <ArchivoModal
            onClose={() => setShowModal(false)}
            repositoryId={repositoryId}
            onUploaded={handleUploaded}
            initialFolderId={folderId ?? null}
          />
        )}

        {/* Folders toolbar and list */}
        <div className="mb-6">
          <div className="mb-3">
            <nav className="flex items-center gap-2 text-sm text-[var(--color-primarytwo)]">
              {breadcrumbs.map((b, idx) => (
                <span key={String(b._id) + idx} className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      // navigate to this breadcrumb
                      const targetId = b._id;
                      setFolderId(targetId ?? null);
                      await Promise.all([
                        fetchAndSetFiles(repositoryId!, targetId ?? null),
                        fetchAndSetFolders(repositoryId!, targetId ?? null),
                        fetchAndSetBreadcrumbs(repositoryId!, targetId ?? null),
                      ]);
                      navigate(`${location.pathname}?repoId=${repositoryId}${targetId ? `&folderId=${targetId}` : ''}`);
                    }}
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    {b.name}
                  </button>
                  {idx < breadcrumbs.length - 1 && <span className="text-gray-400">/</span>}
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="ml-auto flex items-center gap-2">
              {creatingFolder ? (
                <div className="flex items-center gap-2">
                  <input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Nombre carpeta"
                    className="p-2 border rounded-md border-[var(--color-primarytwo)]"
                  />
                  <button onClick={handleCreateFolder} className="px-3 py-2 bg-[var(--color-primary)] text-white rounded-md">Crear</button>
                  <button onClick={() => { setCreatingFolder(false); setNewFolderName(''); }} className="px-3 py-2 border rounded-md">Cancelar</button>
                </div>
              ) : (
                <button onClick={() => setCreatingFolder(true)} className="flex items-center gap-2 px-3 py-2 bg-white border border-[var(--color-primary)] text-[var(--color-primary)] rounded-md hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                  <FiPlus />
                  Nueva carpeta
                </button>
              )}
            </div>
          </div>

          {folders && folders.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
              {folders.map((f) => (
                <div key={f._id || f.id} onClick={() => enterFolder(f)} className="p-3 bg-white border rounded-md hover:shadow-md cursor-pointer flex flex-col items-start gap-2">
                  <div className="text-[var(--color-primary)] bg-[var(--color-primary-light)] p-2 rounded-md">
                    <FiFolder className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-medium text-[var(--color-primarytwo)] truncate">{f.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay carpetas en este nivel</p>
          )}
        </div>
  
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : files.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map(file => (
              <FileCard key={file._id} file={file} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No se encontraron archivos</p>
          </div>
        )}
      </div>
    );
  };
  
  export default FileVisualization;
  