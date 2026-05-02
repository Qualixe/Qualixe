import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '110mb',
    },
  },
  allowedDevOrigins: ['pair-tourist-burlington-ict.trycloudflare.com'],
  images: {
    // Serve WebP/AVIF automatically — massive size reduction
    formats: ['image/avif', 'image/webp'],
    // Aggressive quality — 75 is visually identical to 100 at half the size
    qualities: [75],
    // Cache optimized images for 30 days
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Responsive breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cqiahvvchlxvrzsfurra.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // Allow any https image (for blog featured images, product previews etc.)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
