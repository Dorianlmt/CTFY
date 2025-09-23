'use client';

import { useState } from 'react';
import Link from 'next/link';
import YnovHeader from '@/components/YnovHeader';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        window.location.href = '/login';
      } else {
        setError(data.error || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen ynov-bg-primary">
      <YnovHeader />
      
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 ynov-gradient-cyber rounded-lg flex items-center justify-center">
                <span className="text-ynov-primary font-bold text-2xl">Y</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold ynov-text-primary">Inscription</h1>
                <p className="ynov-text-secondary mt-2">Rejoignez la communauté</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="ynov-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium ynov-text-secondary mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="ynov-input w-full"
                  placeholder="Votre nom"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium ynov-text-secondary mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="ynov-input w-full"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium ynov-text-secondary mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="ynov-input w-full"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium ynov-text-secondary mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="ynov-input w-full"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full ynov-btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Inscription...' : 'S\'inscrire'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="ynov-text-secondary">
                Déjà un compte ?{' '}
                <Link href="/login" className="ynov-text-cyber hover:ynov-text-accent transition-colors">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
