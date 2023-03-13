import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "David Wu 的知识库积累",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'MarkDown Examples', link: '/markdown-examples' },
      { text: 'API Examples', link: '/api-examples' }
    ],

    sidebar: [
      {
        text: '八股文汇总🧡',
        items: [
          { text: 'JS知识点', link: '/docs/js/index' },
          { text: 'Vue知识点', link: '/docs/js/index' },
          { text: 'CSS知识点', link: '/docs/js/index' },
          { text: 'React知识点', link: '/docs/js/index' },

        ],
      },
      {
        text: 'Leetcode一辈子✌🏻',
        items: [
          { text: '二叉树', link: '/docs/js/index' },
          { text: '排序', link: '/docs/js/index' },
          { text: '动态回归', link: '/docs/js/index' },
          
          

        ],
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
