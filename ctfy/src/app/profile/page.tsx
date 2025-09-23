'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import YnovHeader from '@/components/YnovHeader';

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
  };
}

interface Team {
  id: string;
  name: string;
  joinCode: string;
  points: number;
  membersCount: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    description: ''
  });
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.team) {
        setTeam(parsedUser.team);
      }
      fetchSubmissions(parsedUser.id);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchSubmissions = async (userId: string) => {
    try {
      const response = await fetch(`/api/submissions/user?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/teams/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...teamFormData,
          userId: user.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Équipe créée ! Code d'invitation : ${data.team.joinCode}`);
        setShowTeamForm(false);
        setTeamFormData({ name: '', description: '' });
        // Update user data locally
        setUser(data.user);
        setTeam(data.user.team);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la création');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch('/api/teams/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          joinCode,
          userId: user.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Rejoint l\'équipe avec succès !');
        setShowJoinForm(false);
        setJoinCode('');
        // Update user data locally
        setUser(data.user);
        setTeam(data.user.team);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la jonction');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen ynov-bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ynov-cyber"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen ynov-bg-primary">
      <YnovHeader
        isAdmin={user?.isAdmin || false}
        user={user}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 ynov-gradient-cyber rounded-lg flex items-center justify-center">
              <span className="text-ynov-primary font-bold text-xl">Y</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold ynov-text-primary">Mon Profil</h1>
              <p className="ynov-text-secondary">Gérez votre compte et vos soumissions</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="ynov-card p-6 mb-8">
          <h2 className="text-2xl font-bold ynov-text-primary mb-4">Informations personnelles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="ynov-text-secondary">Nom : <span className="ynov-text-primary font-semibold">{user.name}</span></p>
              <p className="ynov-text-secondary">Email : <span className="ynov-text-primary font-semibold">{user.email}</span></p>
            </div>
            <div>
              <p className="ynov-text-secondary">Statut : <span className="ynov-text-cyber font-semibold">Connecté</span></p>
              {user.isAdmin && (
                <p className="text-yellow-400 font-semibold">Administrateur</p>
              )}
            </div>
          </div>
        </div>

        {/* Team Management */}
        <div className="ynov-card p-6 mb-8">
          <h2 className="text-2xl font-bold ynov-text-primary mb-4">Gestion d'équipe</h2>
          
          {team ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="ynov-text-primary font-semibold text-lg">{team.name}</p>
                  <p className="ynov-text-secondary">Code d'invitation : <code className="bg-white/10 px-2 py-1 rounded ynov-text-cyber font-mono">{team.joinCode}</code></p>
                  <p className="ynov-text-secondary">Points : <span className="ynov-text-cyber font-bold">{team.points}</span></p>
                </div>
                <div className="text-right">
                  <p className="ynov-text-secondary">{team.membersCount} membre(s)</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="ynov-text-secondary">Vous n'êtes dans aucune équipe</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowTeamForm(true)}
                  className="ynov-btn-primary px-6 py-3"
                >
                  Créer une équipe
                </button>
                <button
                  onClick={() => setShowJoinForm(true)}
                  className="ynov-btn-secondary px-6 py-3"
                >
                  Rejoindre une équipe
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submissions */}
        <div className="ynov-card p-6">
          <h2 className="text-2xl font-bold ynov-text-primary mb-4">Mes soumissions</h2>
          
          {submissions.length === 0 ? (
            <p className="ynov-text-secondary">Aucune soumission pour le moment</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium ynov-text-secondary">Challenge</th>
                    <th className="px-6 py-4 text-left text-sm font-medium ynov-text-secondary">Flag</th>
                    <th className="px-6 py-4 text-left text-sm font-medium ynov-text-secondary">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-medium ynov-text-secondary">Points</th>
                    <th className="px-6 py-4 text-left text-sm font-medium ynov-text-secondary">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="ynov-text-primary font-semibold">{submission.challenge.title}</div>
                          <div className="ynov-text-muted text-sm">{submission.challenge.category} - {submission.challenge.difficulty}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="bg-white/10 px-2 py-1 rounded ynov-text-cyber font-mono text-sm">
                          {submission.flag}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          submission.isCorrect 
                            ? 'text-green-400 bg-green-400/20' 
                            : 'text-red-400 bg-red-400/20'
                        }`}>
                          {submission.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="ynov-text-cyber font-bold">
                          {submission.isCorrect ? submission.challenge.points : 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 ynov-text-secondary text-sm">
                        {new Date(submission.submittedAt).toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Team Modal */}
        {showTeamForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="ynov-card p-8 w-full max-w-md">
              <h3 className="text-2xl font-bold ynov-text-primary mb-6">Créer une équipe</h3>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium ynov-text-secondary mb-2">Nom de l'équipe</label>
                  <input
                    type="text"
                    value={teamFormData.name}
                    onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                    className="ynov-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium ynov-text-secondary mb-2">Description (optionnel)</label>
                  <textarea
                    value={teamFormData.description}
                    onChange={(e) => setTeamFormData({ ...teamFormData, description: e.target.value })}
                    className="ynov-input w-full"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowTeamForm(false)}
                    className="px-6 py-3 border border-gray-500 ynov-text-secondary rounded-lg hover:bg-gray-500/20 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="ynov-btn-primary px-6 py-3"
                  >
                    Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Join Team Modal */}
        {showJoinForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="ynov-card p-8 w-full max-w-md">
              <h3 className="text-2xl font-bold ynov-text-primary mb-6">Rejoindre une équipe</h3>
              <form onSubmit={handleJoinTeam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium ynov-text-secondary mb-2">Code d'invitation</label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="ynov-input w-full"
                    placeholder="ABC123"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowJoinForm(false)}
                    className="px-6 py-3 border border-gray-500 ynov-text-secondary rounded-lg hover:bg-gray-500/20 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="ynov-btn-primary px-6 py-3"
                  >
                    Rejoindre
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
