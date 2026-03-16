/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'shotstack-api.s3.amazonaws.com'],
  },
}

module.exports = nextConfig
