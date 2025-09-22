'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import YnovHeader from '@/components/YnovHeader';


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
    if (rank === 2) return 'ynov-text-secondary';
    if (rank === 3) return 'text-orange-400';
    return 'ynov-text-muted';
  };

  return (
    <div className="min-h-screen ynov-bg-primary">
      <YnovHeader />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 ynov-gradient-cyber rounded-lg flex items-center justify-center">
              <span className="text-ynov-primary font-bold text-xl">Y</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold ynov-text-primary">Classement</h1>
              <p className="ynov-text-secondary">Découvrez les meilleures équipes et leur progression</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ynov-cyber mx-auto mb-4"></div>
            <p className="ynov-text-secondary">Chargement du classement...</p>
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
            <div className="ynov-card p-6 text-center">
              <div className="text-3xl font-bold ynov-text-cyber mb-2">{stats.teams}</div>
              <div className="ynov-text-secondary">Équipes actives</div>
            </div>
            <div className="ynov-card p-6 text-center">
              <div className="text-3xl font-bold ynov-text-accent mb-2">{stats.users}</div>
              <div className="ynov-text-secondary">Participants</div>
            </div>
            <div className="ynov-card p-6 text-center">
              <div className="text-3xl font-bold ynov-text-cyber mb-2">{stats.challenges}</div>
              <div className="ynov-text-secondary">Challenges</div>
            </div>
            <div className="ynov-card p-6 text-center">
              <div className="text-3xl font-bold ynov-text-accent mb-2">{stats.averagePoints}</div>
              <div className="ynov-text-secondary">Moyenne points</div>
            </div>
          </div>
        )}

        {/* Sort Controls */}
        <div className="ynov-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold ynov-text-primary">Classement des équipes</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setSortBy('points')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === 'points'
                    ? 'ynov-gradient-cyber text-ynov-primary'
                    : 'ynov-text-secondary hover:ynov-text-cyber hover:bg-white/10'
                }`}
              >
                Par points
              </button>
              <button
                onClick={() => setSortBy('lastSolve')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === 'lastSolve'
                    ? 'ynov-gradient-cyber text-ynov-primary'
                    : 'ynov-text-secondary hover:ynov-text-cyber hover:bg-white/10'
                }`}
              >
                Par dernière résolution
              </button>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="ynov-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium ynov-text-secondary">Rang</th>
                  <th className="px-6 py-4 text-left text-sm font-medium ynov-text-secondary">Équipe</th>
                  <th className="px-6 py-4 text-left text-sm font-medium ynov-text-secondary">Points</th>
                  <th className="px-6 py-4 text-left text-sm font-medium ynov-text-secondary">Membres</th>
                  <th className="px-6 py-4 text-left text-sm font-medium ynov-text-secondary">Dernière résolution</th>
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
                        <div className="w-10 h-10 ynov-gradient-cyber rounded-full flex items-center justify-center text-ynov-primary font-bold mr-4">
                          {team.name.charAt(0)}
                        </div>
                        <div>
                          <div className="ynov-text-primary font-semibold">{team.name}</div>
                          <div className="ynov-text-muted text-sm">ID: {team.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="ynov-text-cyber font-bold text-lg">{team.points.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center ynov-text-secondary">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {team.membersCount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="ynov-text-secondary text-sm">
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
            <h2 className="text-2xl font-bold ynov-text-primary mb-8 text-center">Podium</h2>
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
                  <div className="ynov-text-primary font-bold text-lg">{team.name}</div>
                  <div className="ynov-text-cyber font-semibold">{team.points} pts</div>
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
