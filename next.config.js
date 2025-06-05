const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.cache = false;
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      "utf-8-validate": false,
      "bufferutil": false,
    };

    config.ignoreWarnings = [
      { module: /node_modules\/@supabase\/realtime-js/ },
      { message: /Critical dependency: the request of a dependency is an expression/ }
    ];

    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;