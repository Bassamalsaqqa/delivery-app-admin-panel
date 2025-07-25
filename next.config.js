/**
 * @type {import('next').NextConfig}
 */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // ✅ Add Webpack alias support for `@/` resolving to `src/`
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
};

module.exports = nextConfig;
