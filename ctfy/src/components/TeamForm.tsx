'use client';

import { useState } from 'react';

interface Team {
  id: string;
  name: string;
  joinCode: string;
  description?: string;
  points: number;
  createdAt: string;
  _count: {
    members: number;
  };
}

interface TeamFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Team | null;
}

export default function TeamForm({ onClose, onSubmit, initialData }: TeamFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    points: initialData?.points || 0,
    joinCode: initialData?.joinCode || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const generateJoinCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, joinCode: result });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            {initialData ? 'Modifier l\'Équipe' : 'Créer une Équipe'}
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
                Nom de l'équipe *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Nom de l'équipe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Code d'invitation *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.joinCode}
                  onChange={(e) => setFormData({ ...formData, joinCode: e.target.value })}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Code d'invitation"
                  required
                />
                <button
                  type="button"
                  onClick={generateJoinCode}
                  className="px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Générer
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Description de l'équipe (optionnel)"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Points
            </label>
            <input
              type="number"
              min="0"
              max="100000"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Points de l'équipe"
            />
          </div>

          {initialData && (
            <div className="bg-blue-500/20 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg">
              <p className="text-sm">
                <strong>Membres actuels :</strong> {initialData._count.members}
              </p>
              <p className="text-sm mt-1">
                <strong>Créée le :</strong> {new Date(initialData.createdAt).toLocaleDateString('fr-FR')}
              </p>
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
              {isLoading ? (initialData ? 'Mise à jour...' : 'Création...') : (initialData ? 'Mettre à jour' : 'Créer l\'Équipe')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
