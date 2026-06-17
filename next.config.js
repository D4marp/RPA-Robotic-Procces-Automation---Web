/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    return [{
      source: '/api/:path*',
      destination: `${apiUrl}/api/:path*`,
    }]
  },
}
