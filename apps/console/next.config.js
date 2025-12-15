/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@settler/protocol', '@settler/shared', '@settler/enterprise'],
};

module.exports = nextConfig;
