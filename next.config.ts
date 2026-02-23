import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // GitHub Pages serves project sites at https://<user>.github.io/<repo>/
  ...(process.env.NODE_ENV === "production" && {
    basePath: "/rigidbodydynamicsai",
    assetPrefix: "/rigidbodydynamicsai/",
  }),
};

export default nextConfig;
