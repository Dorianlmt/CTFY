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

interface Submission {
  id: string;
  flag: string;
  isCorrect: boolean;
  submittedAt: string;
  challenge: {
    id: string;
    title: string;
    category: string;
    difficulty: string;
    points: number;
    isActive: boolean;
  };
}

interface UserDetailsModalProps {
  user: User;
  onClose: () => void;
  onRemoveFromTeam: (userId: string) => void;
  onDeleteSubmission: (submissionId: string) => void;
}

export default function UserDetailsModal({ user, onClose, onRemoveFromTeam, onDeleteSubmission }: UserDetailsModalProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserSubmissions();
  }, [user.id]);

  const fetchUserSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/submissions?userId=${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
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

  const handleRemoveFromTeam = async () => {
    if (confirm('Êtes-vous sûr de vouloir retirer cet utilisateur de son équipe ?')) {
      try {
        await onRemoveFromTeam(user.id);
        onClose();
      } catch (error) {
        console.error('Error removing user from team:', error);
      }
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette soumission ?')) {
      try {
        await onDeleteSubmission(submissionId);
        // Refresh submissions
        fetchUserSubmissions();
      } catch (error) {
        console.error('Error deleting submission:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 rounded-xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Chargement des soumissions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 rounded-xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
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
            <h3 className="text-3xl font-bold text-white mb-2">{user.name}</h3>
            <div className="flex items-center space-x-4">
              <span className="text-cyan-400 font-bold text-lg">
                {user.totalPoints} points
              </span>
              <span className="text-gray-300">
                {user.solvedChallenges} challenge{user.solvedChallenges > 1 ? 's' : ''} résolu{user.solvedChallenges > 1 ? 's' : ''}
              </span>
              {user.team && (
                <span className="text-blue-400">
                  Équipe: {user.team.name}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-2"><strong>Email:</strong> {user.email}</p>
          <p className="text-gray-300 mb-2"><strong>Statut:</strong> {user.isAdmin ? 'Administrateur' : 'Utilisateur'}</p>
          <p className="text-gray-300 mb-4"><strong>Inscrit le:</strong> {new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
          
          {user.team && (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRemoveFromTeam}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Retirer de l'équipe
              </button>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-xl font-semibold text-white mb-4">
            Soumissions ({submissions.length})
          </h4>
          
          {submissions.length === 0 ? (
            <div className="bg-white/5 rounded-lg p-6 text-center">
              <p className="text-gray-400">Aucune soumission trouvée</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {submissions.map((submission) => (
                <div key={submission.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h5 className="text-white font-medium">{submission.challenge.title}</h5>
                      <p className="text-sm text-gray-400 mt-1">
                        <strong>Flag soumis:</strong> <code className="bg-black/20 px-2 py-1 rounded text-cyan-400">{submission.flag}</code>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        submission.isCorrect 
                          ? 'text-green-400 bg-green-400/20' 
                          : 'text-red-400 bg-red-400/20'
                      }`}>
                        {submission.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                      <button
                        onClick={() => handleDeleteSubmission(submission.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(submission.challenge.category)}`}>
                      {submission.challenge.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(submission.challenge.difficulty)}`}>
                      {submission.challenge.difficulty}
                    </span>
                    <span className="text-cyan-400 font-bold text-sm">
                      {submission.challenge.points} pts
                    </span>
                    {!submission.challenge.isActive && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium text-gray-400 bg-gray-400/20">
                        Inactif
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    Soumis le: {new Date(submission.submittedAt).toLocaleString('fr-FR')}
                  </div>
                </div>
              ))}
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
