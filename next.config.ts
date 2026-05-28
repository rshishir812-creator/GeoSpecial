import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  // disable SW in dev to avoid Turbopack conflict
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Force Webpack for builds (required by @serwist/next)
  turbopack: {},
};

export default withSerwist(nextConfig);
