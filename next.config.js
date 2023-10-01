/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    api: {
      customResolvers: {
        '/api/webhooks': {
          bodyParser: false,
        },
      }
    }
}


module.exports = nextConfig
