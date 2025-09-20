'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CreateChallengeForm from '@/components/CreateChallengeForm';
import TeamForm from '@/components/TeamForm';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  flag: string;
  fileUrl?: string;
  isActive: boolean;
  _count: {
    submissions: number;
  };
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

interface Stats {
  challenges: number;
  teams: number;
  users: number;
  submissions: number;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'challenges' | 'teams' | 'users'>('challenges');
  const [adminToken, setAdminToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showTokenForm, setShowTokenForm] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showEditTeamForm, setShowEditTeamForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [challengesResponse, teamsResponse, statsResponse] = await Promise.all([
        fetch('/api/challenges'),
        fetch('/api/teams'),
        fetch('/api/stats')
      ]);

      if (challengesResponse.ok) {
        const challengesData = await challengesResponse.json();
        setChallenges(challengesData);
      }

      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        setTeams(teamsData);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminToken === 'admin-secret-token-2024') {
      setIsAuthenticated(true);
      setShowTokenForm(false);
    } else {
      alert('Token admin incorrect');
    }
  };

  const handleCreateChallenge = async (challengeData: any) => {
    try {
      const response = await fetch('/api/challenges/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(challengeData),
      });

      if (response.ok) {
        alert('Challenge créé avec succès !');
        setShowCreateForm(false);
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la création');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  const handleEditChallenge = async (challenge: Challenge) => {
    try {
      // Fetch full challenge details
      const response = await fetch(`/api/challenges/${challenge.id}`);
      if (response.ok) {
        const fullChallenge = await response.json();
        setEditingChallenge(fullChallenge);
        setShowEditForm(true);
      } else {
        alert('Erreur lors de la récupération des détails du challenge');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  const handleUpdateChallenge = async (challengeData: any) => {
    if (!editingChallenge) return;

    try {
      const response = await fetch('/api/challenges/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingChallenge.id,
          ...challengeData,
        }),
      });

      if (response.ok) {
        alert('Challenge mis à jour avec succès !');
        setShowEditForm(false);
        setEditingChallenge(null);
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce challenge ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/challenges/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Challenge supprimé avec succès !');
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  const handleCreateTeam = async (teamData: any) => {
    try {
      const response = await fetch('/api/teams/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
      });

      if (response.ok) {
        alert('Équipe créée avec succès !');
        setShowTeamForm(false);
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la création');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  const handleEditTeam = async (team: Team) => {
    setEditingTeam(team);
    setShowEditTeamForm(true);
  };

  const handleUpdateTeam = async (teamData: any) => {
    if (!editingTeam) return;

    try {
      const response = await fetch('/api/teams/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingTeam.id,
          ...teamData,
        }),
      });

      if (response.ok) {
        alert('Équipe mise à jour avec succès !');
        setShowEditTeamForm(false);
        setEditingTeam(null);
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/teams/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Équipe supprimée avec succès !');
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-white">
              <span className="text-cyan-400">CTF</span>Y
            </Link>
            <h1 className="text-2xl font-bold text-white mt-4">Accès Admin</h1>
            <p className="text-gray-300 mt-2">Entrez votre token d'administration</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <form onSubmit={handleTokenSubmit} className="space-y-6">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-300 mb-2">
                  Token Admin
                </label>
                <input
                  type="password"
                  id="token"
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Entrez votre token admin"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all transform hover:scale-105"
              >
                Accéder au panel admin
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <Link href="/" className="text-2xl font-bold text-white">
          <span className="text-cyan-400">CTF</span>Y Admin
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white hover:text-cyan-400 transition-colors">
            Retour au site
          </Link>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Panel d'Administration</h1>
          <p className="text-gray-300">Gérez les challenges, équipes et utilisateurs</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{stats.challenges}</div>
              <div className="text-gray-300">Challenges</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{stats.teams}</div>
              <div className="text-gray-300">Équipes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{stats.users}</div>
              <div className="text-gray-300">Utilisateurs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.submissions}</div>
              <div className="text-gray-300">Soumissions</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'challenges'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Challenges
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'teams'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Équipes
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'users'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Utilisateurs
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Gestion des Challenges</h2>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all"
              >
                + Nouveau Challenge
              </button>
            </div>

            {/* Create Challenge Form */}
            {showCreateForm && (
              <CreateChallengeForm 
                onClose={() => setShowCreateForm(false)}
                onSubmit={handleCreateChallenge}
              />
            )}

            {/* Edit Challenge Form */}
            {showEditForm && editingChallenge && (
              <CreateChallengeForm 
                onClose={() => {
                  setShowEditForm(false);
                  setEditingChallenge(null);
                }}
                onSubmit={handleUpdateChallenge}
                initialData={{
                  title: editingChallenge.title,
                  description: editingChallenge.description,
                  category: editingChallenge.category,
                  difficulty: editingChallenge.difficulty,
                  points: editingChallenge.points,
                  flag: editingChallenge.flag,
                  fileUrl: editingChallenge.fileUrl || '',
                  isActive: editingChallenge.isActive,
                }}
              />
            )}

            <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Titre</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Catégorie</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Difficulté</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Points</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Résolu</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-300">
                          Chargement...
                        </td>
                      </tr>
                    ) : challenges.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-300">
                          Aucun challenge trouvé
                        </td>
                      </tr>
                    ) : (
                      challenges.map((challenge) => (
                      <tr key={challenge.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white font-semibold">{challenge.title}</td>
                        <td className="px-6 py-4 text-gray-300">{challenge.category}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            challenge.difficulty === 'Facile' ? 'text-green-400 bg-green-400/20' :
                            challenge.difficulty === 'Moyen' ? 'text-yellow-400 bg-yellow-400/20' :
                            'text-red-400 bg-red-400/20'
                          }`}>
                            {challenge.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-cyan-400 font-bold">{challenge.points}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            challenge.isActive ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20'
                          }`}>
                            {challenge.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                            {challenge._count?.submissions ?? 0}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditChallenge(challenge)}
                              className="text-cyan-400 hover:text-cyan-300 text-sm"
                            >
                              Modifier
                            </button>
                            <button 
                              onClick={() => handleDeleteChallenge(challenge.id)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Gestion des Équipes</h2>
              <button 
                onClick={() => setShowTeamForm(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all"
              >
                + Nouvelle Équipe
              </button>
            </div>

            {/* Create Team Form */}
            {showTeamForm && (
              <TeamForm 
                onClose={() => setShowTeamForm(false)}
                onSubmit={handleCreateTeam}
              />
            )}

            {/* Edit Team Form */}
            {showEditTeamForm && editingTeam && (
              <TeamForm 
                onClose={() => {
                  setShowEditTeamForm(false);
                  setEditingTeam(null);
                }}
                onSubmit={handleUpdateTeam}
                initialData={editingTeam}
              />
            )}

            <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Nom</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Code d'invitation</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Membres</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Points</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Créée le</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-300">
                          Chargement...
                        </td>
                      </tr>
                    ) : teams.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-300">
                          Aucune équipe trouvée
                        </td>
                      </tr>
                    ) : (
                      teams.map((team) => (
                      <tr key={team.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white font-semibold">{team.name}</td>
                        <td className="px-6 py-4 text-gray-300 max-w-xs truncate">
                          {team.description || 'Aucune description'}
                        </td>
                        <td className="px-6 py-4">
                          <code className="bg-white/10 px-2 py-1 rounded text-cyan-400 font-mono">
                            {team.joinCode}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{team._count.members}</td>
                        <td className="px-6 py-4 text-cyan-400 font-bold">{team.points}</td>
                        <td className="px-6 py-4 text-gray-300">{new Date(team.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditTeam(team)}
                              className="text-cyan-400 hover:text-cyan-300 text-sm"
                            >
                              Modifier
                            </button>
                            <button 
                              onClick={() => handleDeleteTeam(team.id)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Gestion des Utilisateurs</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <p className="text-gray-300">Fonctionnalité de gestion des utilisateurs en cours de développement</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
