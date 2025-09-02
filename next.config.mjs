// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // configure later if you use next/image with external domains
    // remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
  // output: 'standalone', // enable when preparing for Docker
}

export default nextConfig
