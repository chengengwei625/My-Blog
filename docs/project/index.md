# 包管理配置工具命令

| 初始化命令     | npm init                            | yarn init                   | pnpm init                   |
| -------------- | ----------------------------------- | --------------------------- | :-------------------------- |
| 运行脚本       | npm run                             | yarn run/yarn               | pnpm                        |
| 发布包         | npm publish                         | yarn publish                |                             |
| 清除缓存       | npm cache clean                     | yarn cache clean            |                             |
| 安装所有依赖   | npm install                         | yarn                        | pnpm install/i              |
| 安装某个依赖项 | npm install [package]               | yarn add [package]          | pnpm add [package]          |
| 安装开发依赖   | npm install --save-dev/-D [package] | yarn add --dev/-D [package] | pnpm add --dev/-D [package] |
| 卸载依赖       | npm uninstall [package]             | yarn remove [package]       | pnpm remove/rm [package]    |
| 更新全部依赖   | npm update                          | yarn upgrade                | pnpm update/up              |
| 更新某个依赖   | npm update [package]                | yarn upgrade [package]      | pnpm update/up [package]    |

# 创建 vite+vue3+pinin+ts 项目

## 项目初始化

> pnpm create vite
> cd vite-vue3-ts-pinia
> pnpm i
> pnpm run dev

## 设置路径别名

> pnpm i @types/node --save-dev// 使用 path 包设置路径别名 @ 时需要此包

修改`vite.config.ts`

```diff
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
+import * as path from 'path' // 使用path包需要pnpm i @types/node --save-dev
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 配置自动导入
    AutoImport({
      imports: ['vue'],
      dts: 'src/auto-import.d.ts'
    })
  ],
  resolve: {
    //设置别名
+    alias: {
+      '@': path.resolve(__dirname, 'src')
+    }
  },
  server: {
    port: 8080, //启动端口
    hmr: {
      host: '127.0.0.1',
      port: 8080
    },
    // 设置 https 代理
    proxy: {
      '/api': {
        target: 'your https address',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

修改`tsconfig.json`

```diff
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
+    "typeRoots": [
+      "node_modules/@types", // 默认值
+      "src/types"
+    ],
+    "baseUrl": "./",
+    "paths": {
+      "@": ["src"],
+      "@/*": ["src/*"]
+    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 集成 eslint

> pnpm i eslint eslint-plugin-vue -D

由于 ESLint 默认使用 Espree 进行语法解析，无法识别 TypeScript 的一些语法，故我们需要安装 @typescript-eslint/parser 替代掉默认的解析器

> pnpm i @typescript-eslint/parser -D

安装对应的插件 @typescript-eslint/eslint-plugin 它作为 eslint 默认规则的补充，提供了一些额外的适用于 ts 语法的规则

> pnpm i @typescript-eslint/eslint-plugin -D

创建配置文件： .eslintrc.js 或 .eslintrc.json

```js
module.exports = {
  parser: 'vue-eslint-parser',

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },

  extends: ['plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended'],

  rules: {
    // override/add rules settings here, such as:
  }
}
```

创建忽略文件：.eslintignore

```
node_modules/
dist/
index.html
```

修改 package.json

```json
{
    ...
    "scripts": {
        ...
        "eslint:comment": "使用 ESLint 检查并自动修复 src 目录下所有扩展名为 .js 和 .vue 的文件",
        "eslint": "eslint --ext .js,.vue --ignore-path .gitignore --fix src",
    }
    ...
}
```

## 集成 prettier

> pnpm i prettier eslint-config-prettier eslint-plugin-prettier -D

创建配置文件： prettier.config.js 或 .prettierrc.js

```js
module.exports = {
  // 一行最多 80 字符
  printWidth: 80,
  // 使用 4 个空格缩进
  tabWidth: 2,
  // 不使用 tab 缩进，而使用空格
  useTabs: true,
  // 行尾需要有分号
  semi: false,
  // 使用单引号代替双引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾使用逗号
  trailingComma: 'all',
  // 大括号内的首尾需要空格 { foo: bar }
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 换行符使用 lf
  endOfLine: 'lf'
}
```

修改 .eslintrc.js 配置

```js
module.exports = {
    ...

    extends: [
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended'
    ],

    ...
};
```

命令行式运行：修改 package.json

```json
{
    ...
    "scripts": {
        ...
        "prettier:comment": "自动格式化当前目录下的所有文件",
        "prettier": "prettier --write"
    }
    ...
}

```

## 集成 vueuse

VueUse 是一个基于 Composition API 的实用函数集合。

> pnpm i @vueuse/core

创建一个新的 src/page/vueUse.vue 页面来做一个简单的 demo

```vue
<template>
  <h1>测试 vueUse 的鼠标坐标</h1>
  <h3>Mouse: {{ x }} x {{ y }}</h3>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMouse } from '@vueuse/core'

export default defineComponent({
  name: 'VueUse',
  setup() {
    const { x, y } = useMouse()

    return {
      x,
      y
    }
  }
})
</script>
```

## 安装 axios

axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。

注意：不是所有的插件都带有类型声明文件，只有类型声明文件才能保证支持 ts，没有类型声明文件的插件需要安装类型声明文件。

> pnpm i axios @types/axios

新建 src/utils/axios.ts

```typescript
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

const service = axios.create()

// Request interceptors
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // do something
    return config
  },
  (error: any) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    // do something
  },
  (error: any) => {
    // do something
    return Promise.reject(error)
  }
)

export default service
```

在页面中使用即可

```typescript
<script lang="ts">
    import request from '@/utils/axios';
    const requestRes = async () => {
        let result = await request({
                    url: '/api/xxx',
                    method: 'get'
                  });
    }
</script>
```

封装请求参数和响应数据的所有 api

新建 src/api/index.ts

```typescript
import * as login from './module/login'
import * as index from './module/index'

export default Object.assign({}, logins, index)
```

新建 src/api/module/login.ts 和 src/api/module/index.ts

```typescript
import request from '@/utils/axios'

/**
 * 登录
 */

interface IResponseType<P = {}> {
  code?: number
  status: number
  msg: string
  data: P
}
interface ILogin {
  token: string
  expires: number
}
export const login = (username: string, password: string) => {
  return request<IResponseType<ILogin>>({
    url: '/api/auth/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}
```

由于使用了 typescript，所以需新增 src/types/shims-axios.d.ts

```typescript
import { AxiosRequestConfig } from 'axios'
/**
 * 自定义扩展axios模块
 * @author Maybe
 */
declare module 'axios' {
  export interface AxiosInstance {
    <T = any>(config: AxiosRequestConfig): Promise<T>
    request<T = any>(config: AxiosRequestConfig): Promise<T>
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  }
}
```

在 src/pages/request.vue 页面中使用

```typescript
<script lang="ts">
    import API from '@/api';

    const requestRes = async () => {
        let result = await API.login('zhangsan', '123456');
    }
</script>
```

详细使用:

https://blog.csdn.net/Royzilong/article/details/123736090

## 安装路由 router

> pnpm i -S vue-router

在 src 目录下新建 router 文件夹，然后在 router 目录下新建 index.ts 文件，在 index.ts 文件下配置路由

```ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
// import Layout from '@/views/layout/index.vue'
// import Home from '@/views/home/index.vue'

const router = createRouter({
  history: createWebHashHistory(),
  // scrollBehavior: () => {
  //   return {
  //     top: 0
  //   }
  // },
  routes: [
    // {
    //   path: '/',
    //   component: Layout,
    //   children: [
    //     {
    //       path: '',
    //       component: Home
    //     },
    //     {
    //       path: '/category/:id',
    //       component: () => import('@/views/category/index.vue')
    //     },
    //     {
    //       path: '/category/sub/:id',
    //       component: () => import('@/views/category/sub.vue')
    //     },
    //     {
    //       path: '/goods/:id',
    //       component: () => import('@/views/goods/index.vue')
    //     },
    //   ]
    // },
    // {
    //   path: '/login',
    //   component: () => import('@/views/login/index.vue')
    // }
  ]
})
export default router
```

然后在 main.ts 中引入

```diff
import { createApp } from 'vue'
import App from './App.vue'
+import router from './router/index'

const app =createApp(App)
+app.use(router)
app.mount('#app')
```

在页面中获取当前路由的参数

```typescript
import { useRouter } from 'vue-router'

const { currentRoute } = useRouter()
// URL 参数，比如：localhost:3000/login?redirect=/home
const query = currentRoute.value.query.redirect
```

## 安装 element-plus

> pnpm i -S element-plus

在 main.ts 中引入使用

```diff
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
+import ElementPlus from 'element-plus'
+import 'element-plus/dist/index.css'

const app =createApp(App)
+app.use(router).use(ElementPlus)
app.mount('#app')
```

## 安装 sass 和 sass-loader

> pnpm i -D sass sass-loader

## 安装 unplugin-auto-import

> pnpm i -D unplugin-auto-import

在 vite.config.ts 中配置

```diff
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from '@vitejs/plugin-vue-jsx';
// 引入自动导入插件
+import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //配置jsx
    vueJsx(),
    // 配置自动导入，dts配置需要重新运行才可以在src中生成auto-import.d.ts文件
+    AutoImport({
+      imports: ['vue'],
+      dts: 'src/auto-import.d.ts'
+    })
  ],
  server: {
    host: "0.0.0.0",
    port: 8088,
  },
});
```

## 安装 less

> pnpm add -D less

```less
 <style lang="less">
   .root {}
 </style>
```

## 安装 pinia

> pnpm i pinia

main.ts 中引用

```diff
import { createApp } from "vue";
+import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

+app.use(createPinia());
app.use(router);

app.use(ElementPlus);

app.mount("#app");
```

项目 src 下创建文件 stores/counter.ts

```typescript
import { defineStore } from 'pinia'

// export const useCounterStore = defineStore('counter', {
export const useCounterStore = defineStore({
  id: 'counter',
  state: () => ({
    counter: 0
  }),
  getters: {
    doubleCount: state => state.counter * 2
  },
  actions: {
    increment() {
      this.counter++
    }
  }
})
```

在组件中使用

```vue
<template>
  <h1 @click="cahnge">{{ useCounter.counter }}</h1>
</template>
<script lang="ts" setup>
import { useCounterStore } from '../stores/counter'
const useCounter = useCounterStore()
const cahnge = () => {
  useCounter.increment()
}
useCounter.$subscribe((args, state) => {
  console.log('store', args, state)
})
</script>
```

修改 State：

```vue
// 1. 直接修改 state （不建议） userStore.name = '李四' // 2. 通过 actions 去修改
<script lang="ts" setup>
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
userStore.updateName('李四')
</script>
```

## 手写 pinia 持久化插件

在 main.ts 中定义一个方法在 pinia 中注册

```diff
import { createApp } from "vue";
import App from "./App.vue";
// 引用pinia
import { createPinia, PiniaPluginContext } from "pinia";

//定义一个方法
+const piniaPlugin = (options: Options) => {
+  return (context: PiniaPluginContext) => {
+  };
+};

//在pinia中注册一下
+const store = createPinia();

+store.use(
+  piniaPlugin({
+    key: "pinia-test",
+  })
+);

const Vue = createApp(App);

+Vue.use(store);

Vue.mount("#app");
```

在`store`创建 `store/piniaPlugin.ts`

在`piniaPlugin`方法中我们可使用`store.$subscribe`监听`state`的变化然后做存储

```typescript
import { PiniaPluginContext } from 'pinia'

const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const getStorage = (key: string) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string) : {}
}

type Options = {
  key?: string
}
const __piniaKey__: string = 'mystoragekey'

export const piniaPlugin = (options: Options) => {
  return (context: PiniaPluginContext) => {
    console.log('main-pinia', context)
    const { store } = context
    const data = getStorage(`${options?.key ?? __piniaKey__}-${store.$id}`)

    store.$subscribe(() => {
      console.log('store---change')
      setStorage(`${options?.key ?? __piniaKey__}-${store.$id}`, toRaw(store.$state))
    })
    console.log('H00000000000', store)
    return {
      ...data
    }
  }
}
```

在`mian.ts`中引用

```diff
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/reset.css";

// 引用pinia
import { createPinia, PiniaPluginContext } from "pinia";
+import { piniaPlugin } from "./Store/piniaPlugin"

+const store = createPinia();

+store.use(
+  piniaPlugin({
+    key: "pinia-test",
+  })
+);

const Vue = createApp(App);

+Vue.use(store);

Vue.mount("#app");
```

## 安装 vite-plugin-vue-setup-extend

在使用 Vue3.2 的 setup 语法糖后，无法优雅的定义组件的 name 值，虽然 vite 会根据组件的文件名自动生成组件名，但是需要自定义的组件名时，就很不方便。

解决方法

方案 1：写两个 script 标签

最简单的方法就是写两个 script 标签，一个用 setup 语法，一个不用 setup 语法，代码如下：

```typescript
<script>
    export default {
        name: 'demo'
    }
</script>

<script setup>
    // do something...
</script>
```

方案 2：使用 vite 插件 vite-plugin-vue-setup-extend

> pnpm i vite-plugin-vue-setup-extend -D

配置 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
export default defineConfig({
  plugins: [VueSetupExtend()]
})
```

使用:

```typescript
<script lang="ts" setup name="demo"></script>
```

问题：

在使用 vite-plugin-vue-setup-extend 0.4.0 及以前版本时，会有个问题：如果 script 标签内没有内容，即使给 script 标签添加上 name 属性，其在 vue-devtools 内也不会生效。

解决办法: 不要让 script 标签内空着，例如：加行注释。

```vue
<script lang="ts" setup name="demo">
// test
</script>
```

## 安装全局事件发布订阅 mitt

在 vue2 中我们可以创建一个新的 const eventbus = new Vue() 实例去做事件广播，但是在 vue3.x 中不允许我们这样做，我们可以使用插件 mitt 实现

> pnpm i mitt -S

在 main.ts 中 全局引用

```diff
import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/reset.css'
+import mitt from 'mitt'
+const Mit = mitt()
const Vue = createApp(App)
// 全局声明 获取mitt所有的类型
+declare module 'vue' {
+  export interface ComponentCustomProperties {
+    $Bus: typeof Mit
+  }
+}
//全局挂载
+Vue.config.globalProperties.$Bus = Mit
Vue.mount('#app')
```

组件中使用

A.vue 发布事件

```vue
<template>
  <div class="header">
    <button @click="sendEmit">派发事件</button>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'

let instance = getCurrentInstance()

let sendEmit = () => {
  instance?.proxy?.$Bus.emit('on-paifa', 'mitt 全局广播事件')
}
</script>

<style lang="less" scoped></style>
```

B.vue 订阅事件

```vue
<template>
  <div class="b-div">
    <h1>我是BBBBB组件</h1>
    <h5 style="color: #fff;">{{ name }}</h5>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, inject, Ref, ref } from 'vue'

let instace = getCurrentInstance()
instace?.proxy?.$Bus.on('on-a', (res: any) => {
  name.value = res
  console.log('res', res)
})
</script>

<style scoped></style>
```

派发多个事件

```typescript
import { getCurrentInstance } from 'vue'

let instance = getCurrentInstance()

let sendEmit = () => {
  instance?.proxy?.$Bus.emit('on-paifa', 'mitt 全局广播事件')
  instance?.proxy?.$Bus.emit('on-a', 'mitt 全局广播事件AAAA')
  instance?.proxy?.$Bus.emit('on-b', 'mitt 全局广播事件BBBB')
}
```

订阅多个事件

```typescript
import { getCurrentInstance } from 'vue'

let instance = getCurrentInstance()

//type 事件名称  res传参
instance?.proxy?.$Bus.on('*', (type: any, res: any): void => {
  console.log('mitt派发======', type, res)
})
```

卸载监听 $Bus.off('事件名称', fun())

```typescript
let fun = (res: any) => {
  console.log('mitt派发======', res)
  tname.value = res
}

instace?.proxy?.$Bus.on('on-paifa', fun)

setTimeout(() => {
  // 卸载监听
  instace?.proxy?.$Bus.off('on-paifa', fun)
}, 2000)
```

卸载全部监听

```typescript
// 卸载全部监听
instace?.proxy?.$Bus.all.clear()
```

全局挂载方法

```typescript
Vue.config.globalProperties.$Bus = Mit
```

获取全局方法（多种）

```vue
<script setup lang="ts">
import { getCurrentInstance, inject, Ref, ref } from 'vue'

//第一种
let instace = getCurrentInstance()
instace?.proxy?.$Bus.on()

//第二种
let {
  appContext: {
    config: { globalProperties: $global }
  }
} = getCurrentInstance() as any

$global.$Bus.on()
console.log('aaaa', $global)

//第三种
let { proxy } = getCurrentInstance() as any
proxy.$Bus.on()
</script>
```

> 五、路由方面：路由全局守卫、动态路由等
> 项目中使用vue-router@4.x 可以参考之前写的文档
>
> 1、
> router 跳转传参/嵌套路由/路由重定向/别名
> https://blog.csdn.net/csl125/article/details/125862159?spm=1001.2014.3001.5501
>
> 2、
> 前置守卫、后置守卫、路由元信息、过渡动效、滚动行为
> https://blog.csdn.net/csl125/article/details/125958252?spm=1001.2014.3001.5501
>
> 3、
> 动态路由
> https://blog.csdn.net/csl125/article/details/125960809?spm=1001.2014.3001.5501

## 设置跨域代理

```diff
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        //设置别名
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    plugins: [vue()],
    server: {
        port: 8080, //启动端口
        hmr: {
            host: '127.0.0.1',
            port: 8080
        },
        // 设置 https 代理
+        proxy: {
+            '/api': {
+                target: 'your https address',
+                changeOrigin: true,
+                rewrite: (path: string) => path.replace(/^\/api/, '')
+            }
+        }
    }
});
```

## 原生 css variable 新特性

原生支持，不需要第三方插件，具体使用文档可 查看

新建文件 src/styles/index.css

```css{1,3}
 :root {
   --main-bg-color: pink;
 }
 ​
 body {
   background-color: var(--main-bg-color);
 }
```

## 安装 postcss-px-to-viewport

> ```ruby
> pnpm i postcss-px-to-viewport --save-dev
> ```
