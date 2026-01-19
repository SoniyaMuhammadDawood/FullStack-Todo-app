/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://soniya234-todo.hf.space',
  },
 experimental: {
    turbo: false, // Disable Turbopack to use traditional webpack-based build
  },
};

module.exports = nextConfig;