import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ВАЖНО: без этого Dockerfile не сработает
  output: 'standalone',

  // Пропускаем ошибки типизации и линтинга при билде
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

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
