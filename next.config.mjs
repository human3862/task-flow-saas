import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    // В некоторых версиях помогает пропустить затык на рендеринге
    missingSuspenseWithCSRBailout: false,
  },
  staticPageGenerationTimeout: 1,

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

// devBundleServerPackages: false помогает ускорить запуск
export default withPayload(nextConfig, { devBundleServerPackages: false })
