/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.cache = false;
    }

    // Résoudre les problèmes avec les modules WebSocket de Supabase
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "utf-8-validate": false,
      "bufferutil": false,
    };

    // Ignorer les warnings critiques de RealtimeClient
    config.ignoreWarnings = [
      { module: /node_modules\/@supabase\/realtime-js/ },
      { message: /Critical dependency: the request of a dependency is an expression/ }
    ];

    return config;
  },
  // Désactiver le realtime de Supabase pour éviter les problèmes WebSocket
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;