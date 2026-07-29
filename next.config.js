/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: 'localhost' },
      { hostname: 'res.cloudinary.com' }
    ],
    formats: ['image/avif', 'image/webp'],
  },
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  experimental: {},
}

module.exports = nextConfig
