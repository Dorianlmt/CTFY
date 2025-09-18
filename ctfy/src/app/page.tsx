import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="text-2xl font-bold text-white">
          <span className="text-cyan-400">CTF</span>Y
        </div>
        <div className="space-x-4">
          <Link href="/challenges" className="px-4 py-2 text-white hover:text-cyan-400 transition-colors">
            Challenges
          </Link>
          <Link href="/leaderboard" className="px-4 py-2 text-white hover:text-cyan-400 transition-colors">
            Classement
          </Link>
          <Link href="/login" className="px-4 py-2 text-white hover:text-cyan-400 transition-colors">
            Connexion
          </Link>
          <Link href="/register" className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Capture The
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              {" "}Flag
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Relevez des défis de cybersécurité, formez des équipes et montez au classement. 
            Votre aventure commence ici.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/challenges" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg text-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all transform hover:scale-105">
              Commencer l'aventure
            </Link>
            <Link href="/leaderboard" className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 rounded-lg text-lg font-semibold hover:bg-cyan-400 hover:text-white transition-all">
              Voir le classement
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/20 transition-all">
            <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Équipes</h3>
            <p className="text-gray-300">
              Créez votre équipe ou rejoignez-en une avec un code. Collaborez et résolvez les défis ensemble.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/20 transition-all">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Défis</h3>
            <p className="text-gray-300">
              Des challenges variés par catégorie et difficulté. Web, crypto, reverse, forensics et plus encore.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/20 transition-all">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Classement</h3>
            <p className="text-gray-300">
              Suivez votre progression et celle de votre équipe. Gagnez des points et montez au classement.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl font-bold text-white mb-12">Rejoignez la communauté</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-cyan-400 mb-2">500+</div>
              <div className="text-gray-300">Participants</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">50+</div>
              <div className="text-gray-300">Défis</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">25+</div>
              <div className="text-gray-300">Équipes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-gray-300">Disponible</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 py-12 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-bold text-white mb-4">
            <span className="text-cyan-400">CTF</span>Y
          </div>
          <p className="text-gray-400 mb-6">
            Plateforme de Capture The Flag pour les passionnés de cybersécurité
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">À propos</a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact</a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Règles</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
