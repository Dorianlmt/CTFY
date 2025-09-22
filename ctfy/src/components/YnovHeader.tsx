'use client';

import Link from 'next/link';
import { useState } from 'react';

interface YnovHeaderProps {
  isAdmin?: boolean;
  user?: {
    name: string;
    team?: {
      name: string;
    };
  };
  onLogout?: () => void;
}

export default function YnovHeader({ isAdmin = false, user, onLogout }: YnovHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="ynov-bg-primary border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 ynov-gradient-cyber rounded-lg flex items-center justify-center">
                <span className="text-ynov-primary font-bold text-xl">Y</span>
              </div>
              <div>
                <h1 className="text-xl font-bold ynov-text-primary">CTFY</h1>
                <p className="text-xs ynov-text-cyber">Rennes Ynov Campus</p>
              </div>
            </Link>
          </div>

          {/* Navigation principale */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/challenges" 
              className="ynov-text-secondary hover:ynov-text-cyber transition-colors font-medium"
            >
              Challenges
            </Link>
            <Link 
              href="/leaderboard" 
              className="ynov-text-secondary hover:ynov-text-cyber transition-colors font-medium"
            >
              Classement
            </Link>
            {isAdmin && (
              <Link 
                href="/admin" 
                className="ynov-text-secondary hover:ynov-text-cyber transition-colors font-medium"
              >
                Administration
              </Link>
            )}
          </nav>

          {/* Informations utilisateur et actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm ynov-text-primary font-medium">{user.name}</p>
                  {user.team && (
                    <p className="text-xs ynov-text-cyber">Équipe: {user.team.name}</p>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm ynov-text-secondary hover:ynov-text-cyber transition-colors border border-gray-700 hover:border-ynov-cyber rounded-lg"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm ynov-text-secondary hover:ynov-text-cyber transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="ynov-btn-primary text-sm"
                >
                  Inscription
                </Link>
              </div>
            )}

            {/* Menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 ynov-text-secondary hover:ynov-text-cyber transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/challenges" 
                className="ynov-text-secondary hover:ynov-text-cyber transition-colors font-medium px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Challenges
              </Link>
              <Link 
                href="/leaderboard" 
                className="ynov-text-secondary hover:ynov-text-cyber transition-colors font-medium px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Classement
              </Link>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="ynov-text-secondary hover:ynov-text-cyber transition-colors font-medium px-4 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Administration
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
