/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/auctions',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
