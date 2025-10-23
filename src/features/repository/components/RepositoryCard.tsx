import React from 'react';
import { FiUsers, FiFolder } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface Props {
  id: string;
  name: string;
  description?: string;
  membersCount: number;
  filesCount?: number;
  privacy?: 'public' | 'private' | string;
  recentActivity?: string;
}

const RepositoryCard: React.FC<Props> = ({ id, name, description, membersCount, filesCount = 0, privacy = 'private', recentActivity }) => {
  const privacyLabel = privacy === 'public' ? 'Público' : 'Privado';

  return (
    <Link to={`/repositorio/${id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md p-5 transition-shadow duration-200 border border-transparent hover:border-gray-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-r from-[#fff0f6] via-[#f3e8ff] to-[#eef2ff] flex items-center justify-center text-pink-600">
            <FiFolder className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{name}</h3>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${privacy === 'public' ? 'bg-green-50 text-green-700' : 'bg-pink-50 text-pink-700'}`}>
                {privacyLabel}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description || 'Proyecto colaborativo'}</p>

            {recentActivity && (
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 bg-[rgba(249,250,251,0.6)] dark:bg-[rgba(31,41,55,0.12)] p-2 rounded">
                <strong className="text-pink-600">Juan Carlos</strong> actualizó la <span className="text-pink-600">documentación</span> ayer
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <FiUsers className="w-4 h-4" />
                  <span className="text-xs">{membersCount} miembros</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 7v10a2 2 0 0 0 2 2h14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 3h8v4H8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-xs">{filesCount} archivos</span>
                </div>
              </div>

              <div className="flex items-center -space-x-2">
                <img src={`https://i.pravatar.cc/40?u=${id}-1`} alt="a" className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-gray-800" />
                <img src={`https://i.pravatar.cc/40?u=${id}-2`} alt="b" className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-gray-800" />
                <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-200 ring-2 ring-white dark:ring-gray-800">+2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RepositoryCard;
