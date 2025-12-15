/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@settler/protocol', '@settler/shared'],
  // Ensure we don't accidentally bundle enterprise code
  webpack: (config, { isServer }) => {
    // Prevent importing enterprise package in web app
    config.resolve.alias = {
      ...config.resolve.alias,
      '@settler/enterprise': false,
    };
    return config;
  },
};

module.exports = nextConfig;
