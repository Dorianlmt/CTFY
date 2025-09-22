'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  teamId?: string;
  team?: {
    id: string;
    name: string;
    points: number;
  };
  totalPoints: number;
  solvedChallenges: number;
  createdAt: string;
}

interface Team {
  id: string;
  name: string;
  points: number;
  _count: {
    members: number;
  };
}

interface UserFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: User | null;
}

export default function UserForm({ onClose, onSubmit, initialData }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    isAdmin: initialData?.isAdmin || false,
    teamId: initialData?.teamId || '',
  });
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setIsLoadingTeams(true);
      const response = await fetch('/api/teams/list');
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            Modifier l'Utilisateur
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Nom de l'utilisateur"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Email de l'utilisateur"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Équipe
            </label>
            {isLoadingTeams ? (
              <div className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-400">
                Chargement des équipes...
              </div>
            ) : (
              <select
                value={formData.teamId}
                onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="" className="bg-slate-800">Aucune équipe</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id} className="bg-slate-800">
                    {team.name} ({team._count.members} membres)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isAdmin"
              checked={formData.isAdmin}
              onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
              className="w-4 h-4 text-cyan-500 bg-white/10 border-white/20 rounded focus:ring-cyan-500 focus:ring-2"
            />
            <label htmlFor="isAdmin" className="text-sm font-medium text-gray-300">
              Administrateur
            </label>
          </div>

          {initialData && (
            <div className="bg-blue-500/20 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Points totaux :</strong> {initialData.totalPoints}</p>
                  <p><strong>Challenges résolus :</strong> {initialData.solvedChallenges}</p>
                </div>
                <div>
                  <p><strong>Membre depuis :</strong> {new Date(initialData.createdAt).toLocaleDateString('fr-FR')}</p>
                  <p><strong>Équipe actuelle :</strong> {initialData.team?.name || 'Aucune'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-500/20 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
