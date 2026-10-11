import type { NextConfig } from "next";

const laravelUrl = new URL(
  process.env.LARAVEL_API_URL ?? "http://127.0.0.1:8000/api/v1",
);
const laravelRunsLocally = ["127.0.0.1", "localhost", "::1"].includes(
  laravelUrl.hostname,
);

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
