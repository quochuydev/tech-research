import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import fs from 'fs'
import path from 'path'

// Auto-generate sidebar from researching folder
function getSidebarItems() {
  const researchingDir = path.resolve(__dirname, '../researching')
  const files = fs.readdirSync(researchingDir)
    .filter(f => f.endsWith('.md'))
    .sort()

  const categories = {
    'Overview': [],
    'Model Reports': [],
    'Earning Ideas': [],
    'Analysis': [],
    'Playbook': [],
    'Other': []
  }

  files.forEach(file => {
    const name = file.replace('.md', '')
    const title = name
      .replace(/-overview$/, '')
      .replace(/-earning-ideas$/, '')
      .replace(/-promotion-analysis$/, '')
      .replace(/-analysis$/, '')
      .replace(/-playbook$/, '')
      .replace(/-model-report$/, '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    const item = { text: title, link: `/researching/${name}` }

    if (file.includes('-earning-ideas')) {
      categories['Earning Ideas'].push(item)
    } else if (file.includes('-model-report')) {
      categories['Model Reports'].push(item)
    } else if (file.includes('-analysis')) {
      categories['Analysis'].push(item)
    } else if (file.includes('-playbook')) {
      categories['Playbook'].push(item)
    } else if (file.includes('-overview')) {
      categories['Overview'].push(item)
    } else {
      categories['Other'].push(item)
    }
  })

  const sidebar = []
  if (categories['Overview'].length) {
    sidebar.push({ text: 'Technical Overviews', collapsed: false, items: categories['Overview'] })
  }
  if (categories['Model Reports'].length) {
    sidebar.push({ text: 'Model Reports', collapsed: false, items: categories['Model Reports'] })
  }
  if (categories['Earning Ideas'].length) {
    sidebar.push({ text: 'Earning Ideas', collapsed: false, items: categories['Earning Ideas'] })
  }
  if (categories['Analysis'].length) {
    sidebar.push({ text: 'Analysis', collapsed: true, items: categories['Analysis'] })
  }
  if (categories['Playbook'].length) {
    sidebar.push({ text: 'Playbooks', collapsed: true, items: categories['Playbook'] })
  }
  if (categories['Other'].length) {
    sidebar.push({ text: 'Other', collapsed: true, items: categories['Other'] })
  }

  return sidebar
}

export default withMermaid(
  defineConfig({
    title: 'Tech Research',
    description: 'Technical research, overviews, and earning opportunities',

    // GitHub Pages base path
    base: '/tech-research/',

    // Use researching folder as part of source
    srcDir: '.',

    head: [
      // Google Analytics
      ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-YXKJRQ2ZF3' }],
      ['script', {}, `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-YXKJRQ2ZF3');`]
    ],

    themeConfig: {
      logo: '/logo.svg',

      nav: [
        { text: 'Home', link: '/' },
        { text: 'Overviews', link: '/researching/bitcoin-overview' },
        { text: 'Earning Ideas', link: '/researching/clawdbot-earning-ideas' }
      ],

      sidebar: {
        '/researching/': getSidebarItems()
      },

      search: {
        provider: 'local'
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/quochuydev/tech-research' }
      ],

      footer: {
        message: 'Technical research and documentation',
        copyright: `Copyright ${new Date().getFullYear()}`
      },

      outline: {
        level: [2, 3]
      }
    },

    // Mermaid config
    mermaid: {
      theme: 'neutral'
    },

    markdown: {
      lineNumbers: true
    }
  })
)
