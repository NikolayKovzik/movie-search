/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/poster/:path',
        destination: 'https://image.tmdb.org/t/p/w500/:path',
      },
    ]
  },

};

export default nextConfig;
