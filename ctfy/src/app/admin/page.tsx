'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CreateChallengeForm from '@/components/CreateChallengeForm';
import TeamForm from '@/components/TeamForm';
import TeamDetailsModal from '@/components/TeamDetailsModal';
import TeamMembersModal from '@/components/TeamMembersModal';
import UserForm from '@/components/UserForm';
import UserDetailsModal from '@/components/UserDetailsModal';
import YnovHeader from '@/components/YnovHeader';

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
  createdAt: string;
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
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showTeamMembers, setShowTeamMembers] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [challengeSortBy, setChallengeSortBy] = useState<'title' | 'category' | 'points' | 'difficulty' | 'createdAt'>('title');
  const [challengeSortOrder, setChallengeSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [challengesResponse, teamsResponse, usersResponse, statsResponse] = await Promise.all([
        fetch('/api/challenges'),
        fetch('/api/teams'),
        fetch('/api/users'),
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

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
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

  const handleViewTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    setShowTeamDetails(true);
  };

  const handleManageTeamMembers = (team: Team) => {
    setSelectedTeam(team);
    setShowTeamMembers(true);
  };

  const handleRemoveMemberFromTeam = async (userId: string) => {
    try {
      const response = await fetch('/api/users/remove-from-team', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert('Membre retiré de l\'équipe avec succès !');
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors du retrait du membre');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  const handleEditUser = async (user: User) => {
    setEditingUser(user);
    setShowEditUserForm(true);
  };

  const handleUpdateUser = async (userData: any) => {
    if (!editingUser) return;

    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingUser.id,
          ...userData,
        }),
      });

      if (response.ok) {
        alert('Utilisateur mis à jour avec succès !');
        setShowEditUserForm(false);
        setEditingUser(null);
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Utilisateur supprimé avec succès !');
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleRemoveUserFromTeam = async (userId: string) => {
    try {
      const response = await fetch('/api/users/remove-from-team', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert('Utilisateur retiré de l\'équipe avec succès !');
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors du retrait de l\'équipe');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/submissions/delete?submissionId=${submissionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Soumission supprimée avec succès !');
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la suppression de la soumission');
      }
    } catch (err) {
      alert('Erreur de connexion au serveur');
    }
  };

  const sortChallenges = (challenges: Challenge[]) => {
    return [...challenges].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (challengeSortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'points':
          aValue = a.points;
          bValue = b.points;
          break;
        case 'difficulty':
          const difficultyOrder = { 'Facile': 1, 'Moyen': 2, 'Difficile': 3 };
          aValue = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 999;
          bValue = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 999;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return challengeSortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return challengeSortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSortBy = (sortBy: 'title' | 'category' | 'points' | 'difficulty' | 'createdAt') => {
    if (challengeSortBy === sortBy) {
      // Si c'est la même colonne, inverser l'ordre
      setChallengeSortOrder(challengeSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Sinon, définir la nouvelle colonne et l'ordre par défaut
      setChallengeSortBy(sortBy);
      setChallengeSortOrder('asc');
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
    <div className="min-h-screen ynov-bg-primary">
      <YnovHeader 
        isAdmin={true}
        user={undefined}
        onLogout={() => setIsAuthenticated(false)}
      />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 ynov-gradient-cyber rounded-lg flex items-center justify-center">
              <span className="text-ynov-primary font-bold text-2xl">Y</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold ynov-text-primary">Panel d'Administration</h1>
              <p className="ynov-text-secondary">Gérez les challenges, équipes et utilisateurs - Ynov Campus Rennes</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="ynov-card p-6 text-center">
              <div className="text-3xl font-bold ynov-text-cyber mb-2">{stats.challenges}</div>
              <div className="ynov-text-secondary">Challenges</div>
            </div>
            <div className="ynov-card p-6 text-center">
              <div className="text-3xl font-bold ynov-text-accent mb-2">{stats.teams}</div>
              <div className="ynov-text-secondary">Équipes</div>
            </div>
            <div className="ynov-card p-6 text-center">
              <div className="text-3xl font-bold ynov-text-cyber mb-2">{stats.users}</div>
              <div className="ynov-text-secondary">Utilisateurs</div>
            </div>
            <div className="ynov-card p-6 text-center">
              <div className="text-3xl font-bold ynov-text-accent mb-2">{stats.submissions}</div>
              <div className="ynov-text-secondary">Soumissions</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="ynov-card p-6 mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'challenges'
                  ? 'ynov-gradient-cyber text-ynov-primary'
                  : 'ynov-text-secondary hover:ynov-text-cyber hover:bg-white/10'
              }`}
            >
              Challenges
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'teams'
                  ? 'ynov-gradient-cyber text-ynov-primary'
                  : 'ynov-text-secondary hover:ynov-text-cyber hover:bg-white/10'
              }`}
            >
              Équipes
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'users'
                  ? 'ynov-gradient-cyber text-ynov-primary'
                  : 'ynov-text-secondary hover:ynov-text-cyber hover:bg-white/10'
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

            {/* Sort Controls */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-300">Trier par:</label>
                  <select
                    value={challengeSortBy}
                    onChange={(e) => setChallengeSortBy(e.target.value as any)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="title" className="bg-slate-800">Titre</option>
                    <option value="category" className="bg-slate-800">Catégorie</option>
                    <option value="points" className="bg-slate-800">Points</option>
                    <option value="difficulty" className="bg-slate-800">Difficulté</option>
                    <option value="createdAt" className="bg-slate-800">Date de création</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-300">Ordre:</label>
                  <select
                    value={challengeSortOrder}
                    onChange={(e) => setChallengeSortOrder(e.target.value as 'asc' | 'desc')}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="asc" className="bg-slate-800">Croissant</option>
                    <option value="desc" className="bg-slate-800">Décroissant</option>
                  </select>
                </div>

                <div className="text-sm text-gray-400">
                  {challenges.length} challenge{challenges.length > 1 ? 's' : ''}
                </div>
              </div>
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
                      <th 
                        className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSortBy('title')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Titre</span>
                          {challengeSortBy === 'title' && (
                            <span className="text-cyan-400">
                              {challengeSortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSortBy('category')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Catégorie</span>
                          {challengeSortBy === 'category' && (
                            <span className="text-cyan-400">
                              {challengeSortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSortBy('difficulty')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Difficulté</span>
                          {challengeSortBy === 'difficulty' && (
                            <span className="text-cyan-400">
                              {challengeSortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSortBy('points')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Points</span>
                          {challengeSortBy === 'points' && (
                            <span className="text-cyan-400">
                              {challengeSortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
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
                      sortChallenges(challenges).map((challenge) => (
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
                              onClick={() => handleViewTeam(team.id)}
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              Voir
                            </button>
                            <button 
                              onClick={() => handleManageTeamMembers(team)}
                              className="text-green-400 hover:text-green-300 text-sm"
                            >
                              Membres
                            </button>
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
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Gestion des Utilisateurs</h2>
            </div>

            {/* Edit User Form */}
            {showEditUserForm && editingUser && (
              <UserForm 
                onClose={() => {
                  setShowEditUserForm(false);
                  setEditingUser(null);
                }}
                onSubmit={handleUpdateUser}
                initialData={editingUser}
              />
            )}

            <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Nom</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Équipe</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Points</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Challenges</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Admin</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Inscrit le</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {isLoading ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-gray-300">
                          Chargement...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-gray-300">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white font-semibold">{user.name}</td>
                        <td className="px-6 py-4 text-gray-300">{user.email}</td>
                        <td className="px-6 py-4 text-gray-300">
                          {user.team ? (
                            <span className="text-cyan-400">{user.team.name}</span>
                          ) : (
                            <span className="text-gray-500">Aucune équipe</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-cyan-400 font-bold">{user.totalPoints}</td>
                        <td className="px-6 py-4 text-gray-300">{user.solvedChallenges}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isAdmin 
                              ? 'text-red-400 bg-red-400/20' 
                              : 'text-gray-400 bg-gray-400/20'
                          }`}>
                            {user.isAdmin ? 'Oui' : 'Non'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewUser(user)}
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              Voir
                            </button>
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="text-cyan-400 hover:text-cyan-300 text-sm"
                            >
                              Modifier
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
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

        {/* Team Details Modal */}
        {showTeamDetails && selectedTeamId && (
          <TeamDetailsModal
            teamId={selectedTeamId}
            onClose={() => {
              setShowTeamDetails(false);
              setSelectedTeamId(null);
            }}
          />
        )}

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => {
              setShowUserDetails(false);
              setSelectedUser(null);
            }}
            onRemoveFromTeam={handleRemoveUserFromTeam}
            onDeleteSubmission={handleDeleteSubmission}
          />
        )}

        {/* Team Members Modal */}
        {showTeamMembers && selectedTeam && (
          <TeamMembersModal
            team={selectedTeam}
            onClose={() => {
              setShowTeamMembers(false);
              setSelectedTeam(null);
            }}
            onRemoveMember={handleRemoveMemberFromTeam}
          />
        )}
      </main>
    </div>
  );
}
