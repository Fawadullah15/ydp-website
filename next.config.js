/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'localhost' },
      { hostname: 'res.cloudinary.com' },
      { hostname: '*.public.blob.vercel-storage.com' }
    ],
    formats: ['image/avif', 'image/webp'],
  },
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  experimental: {},
}

module.exports = nextConfig
