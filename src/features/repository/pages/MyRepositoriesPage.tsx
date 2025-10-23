import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import RepositoryCard from "../components/RepositoryCard";

interface Repository {
  _id: string;
  name: string;
  description?: string;
  type: string;
  privacy?: string;
  owner: string;
  members: string[];
  createdAt: string;
}

const MyRepositoriesPage: React.FC = () => {
  const [repositorios, setRepositorios] = useState<Repository[]>([]);

  const fetchRepositorios = async () => {
    try {
      const res = await api.get("/api/repositorios/mis-repositorios");
      setRepositorios(res.data);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Error al cargar los repositorios.");
    }
  };

  useEffect(() => {
    fetchRepositorios();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-6xl mx-auto">
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

      {/* Lista de repositorios */}
      <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Repositorios existentes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositorios.map((repo) => (
            <RepositoryCard
              key={repo._id}
              id={repo._id}
              name={repo.name}
              description={repo.description}
              membersCount={repo.members.length}
              filesCount={8} // placeholder until files endpoint used
              privacy={repo.privacy || repo.type}
              recentActivity={`Juan Carlos actualizó la documentación ayer`}
            />
          ))}

          {repositorios.length === 0 && (
            <p className="text-gray-500">No estás en ningún repositorio aún.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRepositoriesPage;
