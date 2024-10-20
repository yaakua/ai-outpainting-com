/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  optimizeFonts: true,
  experimental: {
    swcPlugins: [
      [
        '@lingui/swc-plugin', {}
      ]
    ]
  },
  trailingSlash: true,
  webpack: (config, { webpack }) => {
    config.module.rules.push({
      test: /\/translations\/.*\/.*\.json$/,
      use: {
        loader: '@lingui/loader'
      }
    })

    // 添加新的插件配置
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /canvas|jsdom/,
        contextRegExp: /konva/
      })
    )
    return config
  },
  redirects() {
    return [
      {
        source: '/:lang/blog',
        destination: '/:lang/blogs',
        permanent: true,
      },
      {
        source: '/:lang/article',
        destination: '/:lang/',
        permanent: true,
      },
      {
        source: '/:path*',
        destination: '/',
        permanent: true,
        has: [
          {
            type: 'host',
            value: '(.*)undefined(.*)',
          },
        ],
      },
    ];
  },
  env: {
    UE_COS_SECRET_ID: process.env.UE_COS_SECRET_ID,
    UE_COS_SECRET_KEY: process.env.UE_COS_SECRET_KEY,
    UE_COS_REGION: process.env.UE_COS_REGION,
    UE_COS_BUCKET: process.env.UE_COS_BUCKET,
    UE_COS_PUBLIC_PATH: process.env.UE_COS_PUBLIC_PATH,
    UE_PAYPAL_CLIENT_ID: process.env.UE_PAYPAL_CLIENT_ID,
    UE_PAYPAL_CLIENT_SECRET: process.env.UE_PAYPAL_CLIENT_SECRET,
    UE_STRIPE_PK: process.env.UE_STRIPE_PK,
    UE_PROCESS_API_URL: process.env.UE_PROCESS_API_URL,
    UE_S3_ACCESS_KEY: process.env.UE_S3_ACCESS_KEY,
    UE_S3_SECRET_KEY: process.env.UE_S3_SECRET_KEY,
    UE_S3_SESSION_TOKEN: process.env.UE_S3_SESSION_TOKEN,
    UE_S3_ENDPOINT: process.env.UE_S3_ENDPOINT,
    UE_S3_ACCOUNT_ID: process.env.UE_S3_ACCOUNT_ID,
    UE_S3_REGION: process.env.UE_S3_REGION,
    UE_S3_BUCKET: process.env.UE_S3_BUCKET,
    UE_GOOGLE_CLIENT_ID:process.env.UE_GOOGLE_CLIENT_ID,
    UE_GOOGLE_CLIENT_SECRET:process.env.UE_GOOGLE_CLIENT_SECRET,
    UE_WEB_API_URL:process.env.UE_WEB_API_URL,
    UE_S3_PUBLIC_PATH:process.env.UE_S3_PUBLIC_PATH,
    UE_MQ_API_URL:process.env.UE_MQ_API_URL,
    AUTH_SECRET:process.env.AUTH_SECRET
  }
}

export default nextConfig
