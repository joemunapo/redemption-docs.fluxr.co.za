import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Fluxr Redemption API',
  description: 'Vendor integration docs for Fluxr voucher redemption and wallet operations.',
  appearance: 'dark',
  cleanUrls: true,
  lastUpdated: false,
  themeConfig: {
    logo: '/fluxr-logo.png',
    siteTitle: 'Fluxr API',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'API Overview', link: '/api/' },
      { text: 'Redemptions', link: '/api/redemptions' },
      { text: 'Wallet', link: '/api/wallet' },
      { text: 'Errors', link: '/api/errors' }
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [{ text: 'Overview', link: '/api/' }]
      },
      {
        text: 'Endpoints',
        items: [
          { text: 'Redemptions', link: '/api/redemptions' },
          { text: 'Wallet', link: '/api/wallet' }
        ]
      },
      {
        text: 'Reference',
        items: [{ text: 'Error Codes', link: '/api/errors' }]
      }
    ],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'Fluxr Redemption API Documentation',
      copyright: 'Copyright © Fluxr'
    }
  }
})
