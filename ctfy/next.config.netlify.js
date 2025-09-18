/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Désactiver les API routes pour l'export statique
  experimental: {
    outputFileTracingRoot: undefined,
  },
  // Rediriger les API vers un backend externe
  async redirects() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://your-backend.vercel.app/api/:path*',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
