import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mientras el sitio vive también en GitHub Pages usamos imágenes sin
  // optimizar; al moverlo a Vercel se puede activar la optimización.
  // Las portadas de lección son SVG dibujados a mano (con su animación dentro
  // del propio archivo), así que se sirven tal cual: nítidas y sin costo de
  // conversión. `dangerouslyAllowSVG` solo autoriza ese tipo de archivo.
  images: { unoptimized: true, dangerouslyAllowSVG: true },
};

export default nextConfig;
