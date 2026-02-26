/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next.js usa Sharp para otimizar thumbnails ao usar next/image
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/**" },
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
    ],
  },
};

export default nextConfig;
