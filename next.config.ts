import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // This configures Next.js to generate a static site during build
  // It exports all pages as static HTML/CSS/JS files that can be deployed anywhere
  // without requiring a Node.js server
  output: "export",
};

export default nextConfig;
