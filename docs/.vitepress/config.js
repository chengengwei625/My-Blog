import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'CGW的博客',
  base: '/My-Blog/',
  description: '我的博客', // 描述
  appearance: true, // 外观
  ignoreDeadLinks: true, // 屏蔽无效链接
  lang: 'zh-CN',
  lastUpdated: true, // 文档最后的更新时间
  markdown: { lineNumbers: true },
  titleTemplate: '博客',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    logo: '/logo.jpg',
    nav: [
      { text: '首页', link: '/' },
      { text: 'HTML', link: '/html/' },
      { text: 'CSS', link: '/css/' },
      { text: 'JavaScript', link: '/js/' },
      { text: 'TypeScript', link: '/ts/' },
      { text: 'Webpack', link: '/webpack/' },
      { text: 'Vite', link: '/vite/' },
      { text: 'Vue2.0', link: '/vue2/' },
      { text: 'Vue3.0', link: '/vue3/' },
      { text: 'Project', link: '/project/' }
    ],
    search: true,
    algolia: {
      // appKey: '',
      // indexName: '',
      appId: 'MBGMJBMQAG',
      apiKey: 'a604a4815502caa60acf88ae3f8c89e4',
      indexName: 'my-blog',
      searchParameters: {
        faeFilters: ['tags:guide,api']
      }
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/chengengwei625' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Allen Zhou'
    },
    themeConfig: {
      lastUpdatedText: 'Updated Date'
    },
    sidebar: {
      '/html/': [
        {
          text: 'HTML教程',
          items: [{ text: 'HTML', link: '/html/' }]
        }
      ],
      '/css/': [
        {
          text: 'CSS教程',
          items: [{ text: 'CSS基础', link: '/css/' }]
        }
      ],
      '/js/': [
        {
          text: 'JavaScript教程',
          items: [{ text: 'JavaScript基础', link: '/js/' }]
        }
      ],
      '/ts/': [
        {
          text: 'TypeScript教程',
          items: [{ text: 'TypeScript基础', link: '/ts/' }]
        }
      ],
      '/webpack/': [
        {
          text: 'Webpack教程',
          items: [{ text: 'Webpack基础', link: '/webpack/' }]
        }
      ],
      '/vite/': [
        {
          text: 'Vite教程',
          items: [{ text: 'Vite基础', link: '/vite/' }]
        }
      ],
      '/vue2/': [
        {
          text: 'Vue2.0教程',
          items: [{ text: 'Vue2.0基础', link: '/vue2/' }]
        }
      ],
      '/vue3/': [
        {
          text: 'Vue3.0教程',
          items: [{ text: 'Vue3.0基础', link: '/vue3/' }]
        }
      ],
      '/project/': [
        {
          text: '项目相关',
          items: [{ text: '项目基础', link: '/project/' }]
        }
      ]
    }
  }
})
