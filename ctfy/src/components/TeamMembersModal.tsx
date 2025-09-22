'use client';

import { useState, useEffect } from 'react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  totalPoints: number;
  solvedChallenges: number;
}

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

interface TeamMembersModalProps {
  team: Team;
  onClose: () => void;
  onRemoveMember: (userId: string) => void;
}

export default function TeamMembersModal({ team, onClose, onRemoveMember }: TeamMembersModalProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeamMembers();
  }, [team.id]);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/teams/members?teamId=${team.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string, memberName: string) => {
    if (confirm(`Êtes-vous sûr de vouloir retirer ${memberName} de l'équipe ?`)) {
      try {
        await onRemoveMember(userId);
        // Refresh members list
        fetchTeamMembers();
      } catch (error) {
        console.error('Error removing member:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 rounded-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Chargement des membres...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 rounded-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">{team.name}</h3>
            <div className="flex items-center space-x-4">
              <span className="text-cyan-400 font-bold text-lg">
                {team.points} points
              </span>
              <span className="text-gray-300">
                {members.length} membre{members.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {team.description && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-2">Description</h4>
            <p className="text-gray-300">{team.description}</p>
          </div>
        )}

        <div>
          <h4 className="text-xl font-semibold text-white mb-4">
            Membres de l'équipe ({members.length})
          </h4>
          
          {members.length === 0 ? (
            <div className="bg-white/5 rounded-lg p-6 text-center">
              <p className="text-gray-400">Aucun membre dans cette équipe</p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Nom</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Points</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Challenges</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Admin</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Membre depuis</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white font-semibold">{member.name}</td>
                        <td className="px-6 py-4 text-gray-300">{member.email}</td>
                        <td className="px-6 py-4 text-cyan-400 font-bold">{member.totalPoints}</td>
                        <td className="px-6 py-4 text-gray-300">{member.solvedChallenges}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            member.isAdmin 
                              ? 'text-red-400 bg-red-400/20' 
                              : 'text-gray-400 bg-gray-400/20'
                          }`}>
                            {member.isAdmin ? 'Oui' : 'Non'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {new Date(member.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleRemoveMember(member.id, member.name)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Retirer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
