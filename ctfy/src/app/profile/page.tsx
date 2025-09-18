'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
        body: JSON.stringify(teamFormData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Équipe créée ! Code d'invitation : ${data.team.joinCode}`);
        setShowTeamForm(false);
        setTeamFormData({ name: '', description: '' });
        // Refresh user data
        window.location.reload();
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
        alert('Rejoint l\'équipe avec succès !');
        setShowJoinForm(false);
        setJoinCode('');
        // Refresh user data
        window.location.reload();
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <Link href="/" className="text-2xl font-bold text-white">
          <span className="text-cyan-400">CTF</span>Y
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/challenges" className="text-white hover:text-cyan-400 transition-colors">
            Challenges
          </Link>
          <Link href="/leaderboard" className="text-white hover:text-cyan-400 transition-colors">
            Classement
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Mon Profil</h1>
          <p className="text-gray-300">Gérez votre compte et vos soumissions</p>
        </div>

        {/* User Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Informations personnelles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-300">Nom : <span className="text-white font-semibold">{user.name}</span></p>
              <p className="text-gray-300">Email : <span className="text-white font-semibold">{user.email}</span></p>
            </div>
            <div>
              <p className="text-gray-300">Statut : <span className="text-cyan-400 font-semibold">Connecté</span></p>
              {user.isAdmin && (
                <p className="text-yellow-400 font-semibold">Administrateur</p>
              )}
            </div>
          </div>
        </div>

        {/* Team Management */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Gestion d'équipe</h2>
          
          {team ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-lg">{team.name}</p>
                  <p className="text-gray-300">Code d'invitation : <code className="bg-white/10 px-2 py-1 rounded text-cyan-400 font-mono">{team.joinCode}</code></p>
                  <p className="text-gray-300">Points : <span className="text-cyan-400 font-bold">{team.points}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-gray-300">{team.membersCount} membre(s)</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-300">Vous n'êtes dans aucune équipe</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowTeamForm(true)}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all"
                >
                  Créer une équipe
                </button>
                <button
                  onClick={() => setShowJoinForm(true)}
                  className="px-6 py-3 border border-cyan-400 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-400 hover:text-white transition-all"
                >
                  Rejoindre une équipe
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submissions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Mes soumissions</h2>
          
          {submissions.length === 0 ? (
            <p className="text-gray-300">Aucune soumission pour le moment</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Challenge</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Flag</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Points</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-semibold">{submission.challenge.title}</div>
                          <div className="text-gray-400 text-sm">{submission.challenge.category} - {submission.challenge.difficulty}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="bg-white/10 px-2 py-1 rounded text-cyan-400 font-mono text-sm">
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
                        <span className="text-cyan-400 font-bold">
                          {submission.isCorrect ? submission.challenge.points : 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
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
            <div className="bg-slate-800 rounded-xl p-8 w-full max-w-md">
              <h3 className="text-2xl font-bold text-white mb-6">Créer une équipe</h3>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nom de l'équipe</label>
                  <input
                    type="text"
                    value={teamFormData.name}
                    onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description (optionnel)</label>
                  <textarea
                    value={teamFormData.description}
                    onChange={(e) => setTeamFormData({ ...teamFormData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowTeamForm(false)}
                    className="px-6 py-3 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-500/20 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all"
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
            <div className="bg-slate-800 rounded-xl p-8 w-full max-w-md">
              <h3 className="text-2xl font-bold text-white mb-6">Rejoindre une équipe</h3>
              <form onSubmit={handleJoinTeam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Code d'invitation</label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="ABC123"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowJoinForm(false)}
                    className="px-6 py-3 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-500/20 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all"
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
