'use client';

import { useState } from 'react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  fileUrl?: string;
}

interface FlagSubmissionModalProps {
  challenge: Challenge;
  onClose: () => void;
  onSubmit: (challengeId: string, flag: string) => Promise<void>;
}

export default function FlagSubmissionModal({ challenge, onClose, onSubmit }: FlagSubmissionModalProps) {
  const [flag, setFlag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;

    setIsLoading(true);
    setMessage('');

    try {
      await onSubmit(challenge.id, flag.trim());
      setMessage('Flag soumis avec succès !');
      setIsSuccess(true);
      setFlag('');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      setMessage(error.message || 'Erreur lors de la soumission');
      setIsSuccess(false);
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
      'Misc': 'text-gray-400 bg-gray-400/20'
    };
    return colors[category as keyof typeof colors] || 'text-gray-400 bg-gray-400/20';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{challenge.title}</h3>
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(challenge.category)}`}>
                {challenge.category}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty}
              </span>
              <span className="text-cyan-400 font-bold">
                {challenge.points} pts
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

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
          <p className="text-gray-300 leading-relaxed">{challenge.description}</p>
        </div>

        {challenge.fileUrl && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">Fichier à télécharger</h4>
            <a
              href={challenge.fileUrl}
              className="text-cyan-400 hover:text-cyan-300 flex items-center"
              download
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Télécharger le fichier
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Votre flag
            </label>
            <input
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="CTF{...}"
              disabled={isLoading}
              required
            />
            <p className="text-gray-400 text-sm mt-2">
              "Format attendu : CTF flag ou le flag exact"
            </p>
          </div>

          {message && (
            <div className={`px-4 py-3 rounded-lg ${
              isSuccess 
                ? 'bg-green-500/20 border border-green-500 text-green-200'
                : 'bg-red-500/20 border border-red-500 text-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-500/20 transition-all"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || !flag.trim()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Soumission...' : 'Soumettre le Flag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
