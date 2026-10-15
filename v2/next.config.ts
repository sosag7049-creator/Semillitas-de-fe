import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mientras el sitio vive también en GitHub Pages usamos imágenes sin
  // optimizar; al moverlo a Vercel se puede activar la optimización.
  images: { unoptimized: true },
};

export default nextConfig;
