'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FlagSubmissionModal from '@/components/FlagSubmissionModal';

const categories = ['Tous', 'Web', 'Crypto', 'Reverse', 'Forensics', 'Pwn', 'Misc', 'Osint', 'Stegano', 'Other'];
const difficulties = ['Toutes', 'Facile', 'Moyen', 'Difficile'];

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  fileUrl?: string;
  isActive: boolean;
}

export default function ChallengesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Toutes');
  const [searchTerm, setSearchTerm] = useState('');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchChallenges();
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [selectedCategory, selectedDifficulty, searchTerm]);

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'Tous') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'Toutes') params.append('difficulty', selectedDifficulty);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/challenges?${params}`);
      if (response.ok) {
        const data = await response.json();
        setChallenges(data);
      } else {
        setError('Erreur lors du chargement des challenges');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlagSubmission = async (challengeId: string, flag: string) => {
    if (!user) {
      throw new Error('Vous devez être connecté pour soumettre un flag');
    }

    if (!user.team) {
      throw new Error('Vous devez être dans une équipe pour soumettre un flag');
    }

    const response = await fetch('/api/submissions/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        teamId: user.team.id,
        challengeId,
        flag,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la soumission');
    }

    if (data.isCorrect) {
      // Refresh challenges to update any UI changes
      fetchChallenges();
    }

    return data;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <Link href="/" className="text-2xl font-bold text-white">
          <span className="text-cyan-400">CTF</span>Y
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/leaderboard" className="text-white hover:text-cyan-400 transition-colors">
            Classement
          </Link>
          {user ? (
            <Link href="/profile" className="px-4 py-2 text-white hover:text-cyan-400 transition-colors">
              Mon Profil
            </Link>
          ) : (
            <Link href="/login" className="px-4 py-2 text-white hover:text-cyan-400 transition-colors">
              Connexion
            </Link>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Challenges</h1>
          <p className="text-gray-300">Relevez des défis de cybersécurité et gagnez des points</p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Titre ou description..."
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-slate-800">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulté
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty} className="bg-slate-800">
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Chargement des challenges...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Challenges by Category */}
        {!isLoading && !error && (() => {
          // Group challenges by category
          const challengesByCategory = challenges.reduce((acc, challenge) => {
            const category = challenge.category;
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(challenge);
            return acc;
          }, {} as Record<string, Challenge[]>);

          // Sort challenges within each category by difficulty (Facile -> Moyen -> Difficile)
          const difficultyOrder = { 'Facile': 1, 'Moyen': 2, 'Difficile': 3 };
          Object.keys(challengesByCategory).forEach(category => {
            challengesByCategory[category].sort((a, b) => {
              const difficultyA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 999;
              const difficultyB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 999;
              return difficultyA - difficultyB;
            });
          });

          // Get categories that have challenges, sorted alphabetically
          const categoriesWithChallenges = Object.keys(challengesByCategory).sort();

          return (
            <div className="space-y-8">
              {categoriesWithChallenges.map((category) => (
                <div key={category} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold text-white">{category}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
                      {challengesByCategory[category].length} challenge{challengesByCategory[category].length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Challenges Grid for this category */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challengesByCategory[category].map((challenge) => (
                      <div
                        key={challenge.id}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {challenge.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-300 mb-4 text-sm">
                          {challenge.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(challenge.category)}`}>
                            {challenge.category}
                          </span>
                          <span className="text-cyan-400 font-bold">
                            {challenge.points} pts
                          </span>
                        </div>

                        {challenge.fileUrl && (
                          <div className="mb-4">
                            <a
                              href={challenge.fileUrl}
                              className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center"
                              download
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Télécharger le fichier
                            </a>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setSelectedChallenge(challenge)}
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-cyan-600 hover:to-purple-600 transition-all"
                          >
                            Voir le détail
                          </button>
                          <button 
                            onClick={() => setSelectedChallenge(challenge)}
                            className="px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-400 hover:text-white transition-all"
                          >
                            Soumettre
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {!isLoading && !error && challenges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Aucun challenge trouvé</p>
            <p className="text-gray-500 text-sm mt-2">Essayez de modifier vos filtres</p>
          </div>
        )}

        {/* Flag Submission Modal */}
        {selectedChallenge && (
          <FlagSubmissionModal
            challenge={selectedChallenge}
            onClose={() => setSelectedChallenge(null)}
            onSubmit={handleFlagSubmission}
          />
        )}
      </main>
    </div>
  );
}
