import React, { useState } from "react";
import { uploadFile } from "../services/filesService";

interface ArchivoModalProps {
  onClose: () => void;
  repositoryId: string;
  onUploaded: () => void;
  initialFolderId?: string | null;
  currentFolderName?: string | null;
}

const ArchivoModal: React.FC<ArchivoModalProps> = ({ 
  onClose, 
  repositoryId, 
  onUploaded, 
  initialFolderId, 
  currentFolderName 
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImportance, setSelectedImportance] = useState<string>("none");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [isSensitive, setIsSensitive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Obtener usuario desde localStorage
  const getUserFromStorage = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      if (!title) setTitle(selectedFile.name);
    }
  };

  const importanceColors = [
    { color: 'bg-red-500', label: 'Alta', value: 'high', ring: 'ring-red-300' },
    { color: 'bg-yellow-400', label: 'Media', value: 'medium', ring: 'ring-yellow-300' },
    { color: 'bg-green-400', label: 'Baja', value: 'low', ring: 'ring-green-300' },
    { color: 'bg-gray-400', label: 'Ninguna', value: 'none', ring: 'ring-gray-300' }
  ];

  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!file) return alert("Selecciona un archivo.");
    if (!title.trim()) return alert("El título es obligatorio.");
    
    setIsUploading(true);
    const user = getUserFromStorage();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", user?.username || "");
    formData.append("description", description);
    formData.append("importance", selectedImportance);
    formData.append("tags", tags.join(","));
    formData.append("privacy", isSensitive ? "private" : "public");
    formData.append("file", file);
    formData.append("repositoryId", repositoryId);
    if (initialFolderId) {
      formData.append('folderId', initialFolderId);
    }

    try {
      await uploadFile(formData);
      alert("Archivo subido exitosamente.");
      onUploaded();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al subir el archivo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="max-w-xl w-full rounded-2xl shadow-lg bg-gray-200 p-8 relative animate-slideUp">
        {/* Botón de cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>

        {/* Título */}
        <h2 className="text-2xl font-semibold text-center mb-2 text-gray-900">
          Subir Nuevo Archivo
        </h2>

        {/* Mostrar carpeta destino si existe */}
        {initialFolderId && currentFolderName && (
          <p className="text-center text-sm text-gray-600 mb-6">
            Carpeta destino: <span className="font-semibold text-[var(--color-primary)]">{currentFolderName}</span>
          </p>
        )}

        {!initialFolderId && (
          <p className="text-center text-sm text-gray-600 mb-6">
            Se subirá a la raíz del repositorio
          </p>
        )}

        {/* Campo Título */}
        <label className="block text-sm font-medium text-gray-800 mb-2" htmlFor="titulo">
          Título
        </label>
        <input 
          id="titulo" 
          type="text" 
          placeholder="Ej. Proyecto Ecofriendly" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
        />

        {/* Campo Descripción */}
        <label className="block text-sm font-medium text-gray-800 mb-2" htmlFor="descripcion">
          Descripción
        </label>
        <textarea 
          id="descripcion" 
          rows={2} 
          placeholder="Este proyecto ayuda en los bosques de Bolivia"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none"
        />

        {/* Importancia */}
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Importancia
        </label>
        <div className="flex items-center gap-4 mb-4">
          {importanceColors.map((imp) => (
            <button
              key={imp.value}
              type="button"
              onClick={() => setSelectedImportance(imp.value)}
              className={`w-6 h-6 rounded-full ${imp.color} hover:ring-2 ${imp.ring} transition-all ${
                selectedImportance === imp.value ? `ring-2 ${imp.ring}` : ''
              }`}
              title={imp.label}
            />
          ))}
        </div>

        {/* Tags */}
        <label className="block text-sm font-medium text-gray-800 mb-2" htmlFor="tags">
          Tags
        </label>
        <input 
          id="tags" 
          type="text" 
          placeholder="Ej. Ciencias, Biología"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag();
            }
          }}
          className="w-full mb-3 px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
        />
        <div className="flex gap-2 mb-4 flex-wrap">
          {tags.map((tag) => (
            <span 
              key={tag}
              className="bg-gray-100 px-3 py-1 rounded-full text-gray-800 text-sm flex items-center"
            >
              {tag}
              <button 
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-gray-400 hover:text-pink-500"
              >
                &times;
              </button>
            </span>
          ))}
        </div>

        {/* Selector de archivo */}
        <label className="block text-sm font-medium text-gray-800 mb-2" htmlFor="archivo">
          Seleccionar Archivo
        </label>
        <div className="relative mb-4">
          <input 
            id="archivo" 
            type="text" 
            placeholder={fileName || "Haz clic para seleccionar un archivo"}
            value={fileName}
            readOnly
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer bg-white"
          />
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Es Sensible */}
        <div className="mb-8">
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={isSensitive}
              onChange={(e) => setIsSensitive(e.target.checked)}
              className="form-checkbox h-4 w-4 rounded text-pink-600" 
            />
            <span className="ml-2 text-sm text-gray-800 font-medium">Es Sensible</span>
          </label>
          <p className="text-xs text-gray-600 ml-6">
            Activa esta función si quieres que tu archivo no se vea públicamente
          </p>
        </div>
        
        {/* Botones */}
        <div className="flex justify-end gap-4 mt-2">
          <button 
            onClick={onClose}
            disabled={isUploading}
            className="px-8 py-2 rounded-md bg-pink-500 text-white font-semibold hover:bg-pink-600 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isUploading}
            className="px-8 py-2 rounded-md bg-pink-700 text-white font-semibold hover:bg-pink-800 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Subiendo...
              </>
            ) : (
              'Aceptar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchivoModal;
