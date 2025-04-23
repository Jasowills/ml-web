import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const parseServerUrl = () => {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080'
    const url = new URL(serverUrl)
    return {
      hostname: url.hostname,
      protocol: url.protocol.replace(':', ''),
      port: '8080',
      fullUrl: serverUrl,
    }
  } catch (error) {
    console.error('Error parsing NEXT_PUBLIC_SERVER_URL:', error)
    return {
      hostname: 'localhost',
      protocol: 'http',
      port: '8080',
      fullUrl: 'http://localhost:8080',
    }
  }
}

const serverConfig = parseServerUrl()
/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Allow-Origin', value: 'https://ml-marklite-website.azurewebsites.net' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
      ]
    }
  ],
  images: {
    remotePatterns: [
      {
        hostname: serverConfig.hostname,
        protocol: serverConfig.protocol,
        port: serverConfig.port !== '8080' && serverConfig.port !== '443' ? serverConfig.port : '',
      },
      {
        protocol: 'https',
        hostname: 'ml-marklite-website.azurewebsites.net',
        // pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: '.blob.core.windows.net',
        // pathname: '/api/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/api/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/api/media/**',
      },
    ],
  },
  reactStrictMode: true,
  output: 'standalone',
  redirects,
  // experimental: {
  //   // Add next to the list of packages to include
  //   outputFileTracingIncludes: {
  //     "**/*": ["next"]
  //   }
  // }
}

export default withPayload(nextConfig)
