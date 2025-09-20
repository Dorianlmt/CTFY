'use client';

import { useState, useEffect } from 'react';

interface Team {
  id: string;
  name: string;
  joinCode: string;
  description?: string;
  points: number;
  createdAt: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  solvedChallenges: Array<{
    challenge: {
      id: string;
      title: string;
      category: string;
      difficulty: string;
      points: number;
    };
    solvedBy: {
      id: string;
      name: string;
    };
    solvedAt: string;
  }>;
  totalPointsFromChallenges: number;
}

interface TeamDetailsModalProps {
  teamId: string;
  onClose: () => void;
}

export default function TeamDetailsModal({ teamId, onClose }: TeamDetailsModalProps) {
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/teams/details?teamId=${teamId}`);
      
      if (response.ok) {
        const data = await response.json();
        setTeam(data);
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'text-green-400 bg-green-400/20';
      case 'Moyen': return 'text-yellow-400 bg-yellow-400/20';
      case 'Difficile': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Web': 'text-blue-400 bg-blue-400/20',
      'Crypto': 'text-purple-400 bg-purple-400/20',
      'Reverse': 'text-orange-400 bg-orange-400/20',
      'Forensics': 'text-pink-400 bg-pink-400/20',
      'Pwn': 'text-red-400 bg-red-400/20',
      'Misc': 'text-gray-400 bg-gray-400/20',
      'Osint': 'text-green-400 bg-green-400/20',
      'Stegano': 'text-indigo-400 bg-indigo-400/20',
      'Other': 'text-yellow-400 bg-yellow-400/20'
    };
    return colors[category as keyof typeof colors] || 'text-gray-400 bg-gray-400/20';
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 rounded-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Chargement des détails de l'équipe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 rounded-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || 'Équipe non trouvée'}</p>
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
                {team.members.length} membre{team.members.length > 1 ? 's' : ''}
              </span>
              <span className="text-gray-300">
                {team.solvedChallenges.length} challenge{team.solvedChallenges.length > 1 ? 's' : ''} résolu{team.solvedChallenges.length > 1 ? 's' : ''}
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

        <div className="grid md:grid-cols-2 gap-8">
          {/* Membres de l'équipe */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Membres de l'équipe</h4>
            <div className="space-y-3">
              {team.members.map((member) => (
                <div key={member.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">{member.name}</p>
                      <p className="text-gray-400 text-sm">{member.email}</p>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {new Date(member.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Challenges résolus */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">
              Challenges résolus ({team.solvedChallenges.length})
            </h4>
            {team.solvedChallenges.length === 0 ? (
              <div className="bg-white/5 rounded-lg p-6 text-center">
                <p className="text-gray-400">Aucun challenge résolu pour le moment</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {team.solvedChallenges.map((solved, index) => (
                  <div key={solved.challenge.id} className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-white font-medium">{solved.challenge.title}</h5>
                      <span className="text-cyan-400 font-bold">
                        {solved.challenge.points} pts
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(solved.challenge.category)}`}>
                        {solved.challenge.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(solved.challenge.difficulty)}`}>
                        {solved.challenge.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>Résolu par: {solved.solvedBy.name}</span>
                      <span>{new Date(solved.solvedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="mt-8 bg-white/5 rounded-lg p-6">
          <h4 className="text-xl font-semibold text-white mb-4">Statistiques</h4>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{team.points}</div>
              <div className="text-gray-300">Points totaux</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{team.solvedChallenges.length}</div>
              <div className="text-gray-300">Challenges résolus</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{team.members.length}</div>
              <div className="text-gray-300">Membres</div>
            </div>
          </div>
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
