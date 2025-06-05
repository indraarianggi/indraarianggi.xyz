import type { NextConfig } from "next";
import nextMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // This configures Next.js to generate a static site during build
  // It exports all pages as static HTML/CSS/JS files that can be deployed anywhere
  // without requiring a Node.js server
  output: "export",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  pageExtensions: ["md", "mdx", "tsx", "ts", "jsx", "js"],
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
