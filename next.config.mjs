/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias ??= {};
    for (const mod of [
      "tap",
      "tape",
      "why-is-node-running",
      "pino-pretty",
      "desm",
      "fastbench",
      "pino-elasticsearch",
    ]) {
      config.resolve.alias[mod] = false;
    }
    return config;
  },
};

export default nextConfig;
