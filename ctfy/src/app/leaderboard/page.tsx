'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Team {
  id: string;
  name: string;
  points: number;
  lastSolveAt: string | null;
  membersCount: number;
  rank: number;
  members: Array<{
    id: string;
    name: string;
  }>;
}

interface Stats {
  challenges: number;
  teams: number;
  users: number;
  submissions: number;
  averagePoints: number;
}

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<'points' | 'lastSolve'>('points');
  const [teams, setTeams] = useState<Team[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [sortBy]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [teamsResponse, statsResponse] = await Promise.all([
        fetch(`/api/teams?sortBy=${sortBy}`),
        fetch('/api/stats')
      ]);

      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        setTeams(teamsData);
      } else {
        setError('Erreur lors du chargement des équipes');
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const formatLastSolve = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Il y a moins d\'une heure';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays}j`;
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    return 'text-gray-400';
  };

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
          <Link href="/login" className="px-4 py-2 text-white hover:text-cyan-400 transition-colors">
            Connexion
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Classement</h1>
          <p className="text-gray-300">Découvrez les meilleures équipes et leur progression</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Chargement du classement...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {!isLoading && !error && stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{stats.teams}</div>
              <div className="text-gray-300">Équipes actives</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{stats.users}</div>
              <div className="text-gray-300">Participants</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{stats.challenges}</div>
              <div className="text-gray-300">Challenges</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.averagePoints}</div>
              <div className="text-gray-300">Moyenne points</div>
            </div>
          </div>
        )}

        {/* Sort Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Classement des équipes</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setSortBy('points')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === 'points'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Par points
              </button>
              <button
                onClick={() => setSortBy('lastSolve')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === 'lastSolve'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Par dernière résolution
              </button>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Rang</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Équipe</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Points</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Membres</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Dernière résolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {!isLoading && !error && teams.map((team, index) => (
                  <tr key={team.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className={`text-2xl font-bold ${getRankColor(team.rank)}`}>
                        {getRankIcon(team.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                          {team.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{team.name}</div>
                          <div className="text-gray-400 text-sm">ID: {team.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-cyan-400 font-bold text-lg">{team.points.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-300">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {team.membersCount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300 text-sm">
                        {formatLastSolve(team.lastSolveAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 3 Podium */}
        {!isLoading && !error && teams.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Podium</h2>
            <div className="flex justify-center items-end space-x-8">
              {teams.slice(0, 3).map((team, index) => {
              const heights = ['h-32', 'h-24', 'h-20'];
              const colors = [
                'from-yellow-400 to-yellow-600',
                'from-gray-300 to-gray-500',
                'from-orange-400 to-orange-600'
              ];
              
              return (
                <div key={team.id} className="text-center">
                  <div className={`w-24 ${heights[index]} bg-gradient-to-t ${colors[index]} rounded-t-lg mb-4 flex items-end justify-center pb-4`}>
                    <div className="text-white font-bold text-2xl">
                      {getRankIcon(team.rank)}
                    </div>
                  </div>
                  <div className="text-white font-bold text-lg">{team.name}</div>
                  <div className="text-cyan-400 font-semibold">{team.points} pts</div>
                </div>
              );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
