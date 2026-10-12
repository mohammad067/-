import type { NextConfig } from "next";
import path from "node:path";

const laravelUrl = new URL(
  process.env.LARAVEL_API_URL?.trim() || "http://127.0.0.1:8000/api/v1",
);
const assetUrl = new URL(
  process.env.STOREFRONT_ASSET_URL?.trim() || laravelUrl.origin,
);
const laravelRunsLocally = ["127.0.0.1", "localhost", "::1"].includes(
  laravelUrl.hostname,
);

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  images: {
    dangerouslyAllowLocalIP: laravelRunsLocally,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: laravelUrl.protocol.replace(":", "") as "http" | "https",
        hostname: laravelUrl.hostname,
        port: laravelUrl.port,
        pathname: "/storage/**",
      },
      {
        protocol: assetUrl.protocol.replace(":", "") as "http" | "https",
        hostname: assetUrl.hostname,
        port: assetUrl.port,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
