'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FlagSubmissionModal from '@/components/FlagSubmissionModal';
import YnovHeader from '@/components/YnovHeader';

const categories = ['Tous', 'Web', 'Crypto', 'Reverse', 'Forensics', 'Pwn', 'Misc', 'Osint', 'Stegano', 'Lockpicking', 'Other'];
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
    <div className="min-h-screen ynov-bg-primary">
      <YnovHeader 
        isAdmin={user?.isAdmin || false}
        user={user}
        onLogout={() => {
          localStorage.removeItem('user');
          setUser(null);
        }}
      />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 ynov-gradient-cyber rounded-lg flex items-center justify-center">
              <span className="text-ynov-primary font-bold text-xl">Y</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold ynov-text-primary">Challenges</h1>
              <p className="ynov-text-secondary">Relevez des défis de cybersécurité et gagnez des points</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="ynov-card p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium ynov-text-secondary mb-2">
                Rechercher
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ynov-input w-full"
                placeholder="Titre ou description..."
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium ynov-text-secondary mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="ynov-input w-full"
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
              <label className="block text-sm font-medium ynov-text-secondary mb-2">
                Difficulté
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="ynov-input w-full"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ynov-cyber mx-auto mb-4"></div>
            <p className="ynov-text-secondary">Chargement des challenges...</p>
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
              {categoriesWithChallenges.map((category, index) => (
                <div key={category}>
                  {/* Ligne de séparation discrète entre les catégories */}
                  {index > 0 && (
                    <div className="mb-8">
                      <div className="h-px bg-white/10"></div>
                    </div>
                  )} 
                  
                  <div className="space-y-4">
                    {/* Category Header */}
                    <div className="flex items-center space-x-4">
                      <h2 className="text-2xl font-bold ynov-text-primary">{category}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
                        {challengesByCategory[category].length} challenge{challengesByCategory[category].length > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Challenges Grid for this category */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {challengesByCategory[category].map((challenge) => (
                        <div
                          key={challenge.id}
                          className="ynov-card p-6 cursor-pointer group"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-bold ynov-text-primary group-hover:ynov-text-cyber transition-colors">
                              {challenge.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                                {challenge.difficulty}
                              </span>
                            </div>
                          </div>

                          <p className="ynov-text-secondary mb-4 text-sm">
                            {challenge.description}
                          </p>

                          <div className="flex items-center justify-between mb-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(challenge.category)}`}>
                              {challenge.category}
                            </span>
                            <span className="ynov-text-cyber font-bold">
                              {challenge.points} pts
                            </span>
                          </div>

                          {challenge.fileUrl && (
                            <div className="mb-4">
                              <a
                                href={challenge.fileUrl}
                                className="ynov-text-cyber hover:ynov-text-accent text-sm flex items-center"
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
                              className="flex-1 ynov-btn-primary text-sm py-2 px-4"
                            >
                              Voir le détail
                            </button>
                            <button 
                              onClick={() => setSelectedChallenge(challenge)}
                              className="ynov-btn-secondary text-sm py-2 px-4"
                            >
                              Soumettre
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
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
