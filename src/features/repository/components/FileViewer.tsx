import React from 'react';
import { FiX, FiDownload, FiExternalLink } from 'react-icons/fi';
import { File } from '../types/file';

interface FileViewerProps {
  file: File;
  onClose: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({ file, onClose }) => {
  // Buscar URL en diferentes ubicaciones posibles
  const fileAny = file as any;
  const fileUrl = file.url || file.metadata?.url || fileAny.cloudinaryUrl || fileAny.location || '';
  const fileExtension = file.filename.split('.').pop()?.toLowerCase() || '';

  // Determinar el tipo de archivo
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(fileExtension);
  const isPDF = fileExtension === 'pdf';
  const isVideo = ['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(fileExtension);
  const isAudio = ['mp3', 'wav', 'ogg'].includes(fileExtension);
  const isOffice = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileExtension);
  const isText = ['txt', 'md', 'csv', 'json', 'xml', 'html', 'css', 'js', 'ts'].includes(fileExtension);

  // URL de Google Docs Viewer para archivos de Office
  const getGoogleDocsViewerUrl = () => {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
  };

  const renderContent = () => {
    if (isImage) {
      return (
        <img 
          src={fileUrl} 
          alt={file.filename}
          className="max-w-full max-h-[70vh] mx-auto object-contain"
        />
      );
    }

    if (isPDF) {
      return (
        <iframe
          src={`${fileUrl}#toolbar=0`}
          className="w-full h-[70vh] border-0"
          title={file.filename}
        />
      );
    }

    if (isVideo) {
      return (
        <video 
          controls 
          className="max-w-full max-h-[70vh] mx-auto"
          src={fileUrl}
        >
          Tu navegador no soporta la reproducción de video.
        </video>
      );
    }

    if (isAudio) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <audio controls className="w-full max-w-md">
            <source src={fileUrl} />
            Tu navegador no soporta la reproducción de audio.
          </audio>
          <p className="mt-4 text-gray-600">{file.filename}</p>
        </div>
      );
    }

    if (isOffice) {
      return (
        <iframe
          src={getGoogleDocsViewerUrl()}
          className="w-full h-[70vh] border-0"
          title={file.filename}
        />
      );
    }

    if (isText) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg h-[70vh] overflow-auto">
          <iframe
            src={fileUrl}
            className="w-full h-full border-0 bg-white"
            title={file.filename}
          />
        </div>
      );
    }

    // Fallback para archivos no soportados
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-xl font-semibold text-gray-800 mb-2">{file.filename}</p>
        <p className="text-gray-600 mb-6">
          Vista previa no disponible para este tipo de archivo
        </p>
        <a
          href={fileUrl}
          download={file.filename}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition"
        >
          <FiDownload />
          Descargar archivo
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-[95vw] max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primarytwo)] text-white">
          <div className="flex-1">
            <h2 className="text-xl font-semibold truncate">{file.filename}</h2>
            <p className="text-sm opacity-90">{file.metadata.description || 'Sin descripción'}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/20 rounded-lg transition"
              title="Abrir en nueva pestaña"
            >
              <FiExternalLink className="w-5 h-5" />
            </a>
            <a
              href={fileUrl}
              download={file.filename}
              className="p-2 hover:bg-white/20 rounded-lg transition"
              title="Descargar"
            >
              <FiDownload className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
              title="Cerrar"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {renderContent()}
        </div>

        {/* Footer con metadata */}
        <div className="p-4 border-t bg-white">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span>Autor: {file.metadata.author || 'Desconocido'}</span>
            <span>•</span>
            <span>Subido: {new Date(file.uploadDate).toLocaleDateString()}</span>
            <span>•</span>
            <span className={`px-2 py-1 rounded-full ${file.metadata.privacy === 'publico' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {file.metadata.privacy}
            </span>
            {file.metadata.tags && file.metadata.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex gap-2">
                  {file.metadata.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
