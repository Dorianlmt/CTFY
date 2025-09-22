import Link from 'next/link';
import YnovHeader from '@/components/YnovHeader';

export default function Home() {
  return (
    <div className="min-h-screen ynov-bg-primary">
      <YnovHeader />

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="ynov-badge-cyber text-lg px-4 py-2">Rennes Ynov Campus</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold ynov-text-primary mb-6">
            Capture The {" "}
            <span className="ynov-gradient-cyber bg-clip-text text-gray-900">
              Flag
            </span>
          </h1>
          <p className="text-xl ynov-text-secondary mb-8 max-w-2xl mx-auto">
            Relevez des défis de cybersécurité, formez des équipes et montez au classement. 
            Votre aventure en Cyber Security commence ici.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/challenges" className="ynov-btn-primary text-lg px-8 py-4 transform hover:scale-105">
              Commencer l'aventure
            </Link>
            <Link href="/leaderboard" className="ynov-btn-secondary text-lg px-8 py-4">
              Voir le classement
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="ynov-card p-8 text-center">
            <div className="w-16 h-16 ynov-gradient-cyber rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-ynov-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold ynov-text-primary mb-4">Équipes</h3>
            <p className="ynov-text-secondary">
              Créez votre équipe ou rejoignez-en une avec un code. Collaborez et résolvez les défis ensemble.
            </p>
          </div>

          <div className="ynov-card p-8 text-center">
            <div className="w-16 h-16 ynov-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold ynov-text-primary mb-4">Défis</h3>
            <p className="ynov-text-secondary">
              Des challenges variés par catégorie et difficulté. Web, crypto, reverse, forensics et plus encore.
            </p>
          </div>

          <div className="ynov-card p-8 text-center">
            <div className="w-16 h-16 ynov-gradient-cyber rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-ynov-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold ynov-text-primary mb-4">Classement</h3>
            <p className="ynov-text-secondary">
              Suivez votre progression et celle de votre équipe. Gagnez des points et montez au classement.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl font-bold ynov-text-primary mb-12">Rejoignez la communauté Ynov</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold ynov-text-cyber mb-2">500+</div>
              <div className="ynov-text-secondary">Participants</div>
            </div>
            <div>
              <div className="text-4xl font-bold ynov-text-accent mb-2">50+</div>
              <div className="ynov-text-secondary">Défis</div>
            </div>
            <div>
              <div className="text-4xl font-bold ynov-text-cyber mb-2">25+</div>
              <div className="ynov-text-secondary">Équipes</div>
            </div>
            <div>
              <div className="text-4xl font-bold ynov-text-accent mb-2">24/7</div>
              <div className="ynov-text-secondary">Disponible</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 ynov-gradient-cyber rounded-lg flex items-center justify-center">
              <span className="text-ynov-primary font-bold text-lg">Y</span>
            </div>
            <div className="text-2xl font-bold ynov-text-primary">
              CTFY
            </div>
          </div>
          <p className="ynov-text-secondary mb-6">
            Plateforme de Capture The Flag pour les étudiants Cyber Security d'Ynov Campus Rennes
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="ynov-text-secondary hover:ynov-text-cyber transition-colors">À propos</a>
            <a href="#" className="ynov-text-secondary hover:ynov-text-cyber transition-colors">Contact</a>
            <a href="#" className="ynov-text-secondary hover:ynov-text-cyber transition-colors">Règles</a>
          </div>
          <div className="mt-6 text-sm ynov-text-muted">
            © 2024 Ynov Campus Rennes - Filière Cyber Security
          </div>
        </div>
      </footer>
    </div>
  );
}
