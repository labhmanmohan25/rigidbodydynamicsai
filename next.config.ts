import type { NextConfig } from "next";

// Use "" for custom domain (e.g. rigidbodydynamics.com). Set NEXT_PUBLIC_BASE_PATH=/repo for GitHub project pages.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: basePath || undefined,
  ...(basePath && { assetPrefix: `${basePath}/` }),
};

export default nextConfig;
