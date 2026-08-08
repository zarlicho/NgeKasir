import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['2c57-103-28-116-164.ngrok-free.app'],
  serverExternalPackages: ['@prisma/client']
};

export default nextConfig;
