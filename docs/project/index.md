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

## pnpm

**基本特性**

- 本地安装包速度快： 相比于npm / yarn 快 2-3 倍。
- 磁盘空间利用高效： 及时版本不同也不会重复安装同一个包。
- 安全性高：避免了npm/yarn 非法访问依赖和二重身的风险

**pnpm 是如何提升性能的？**
一句话概括：pnpm 在安装依赖时使用了 hard link 机制，使得用户可以通过不同的路径去寻找某个文件。pnpm 会在全局的 store 目录下存储 node_modules 文件的 hard link。

**下面先简单讲讲几个概念： hard link 、symlink 以及全局的 store 目录。**

**什么是 hard link 和 symlink**
本质上都是文件访问的方式。

**hard link(硬链接)：**如果 A 是 B 的硬链接，则 A 的 indexNode（可以理解为指针） 与 B 的 indexNode 指向的是同一个。删除其中任何一个都不会影响另外一个的访问。作用是：允许一个文件拥有多个有效路径，这样用户可以避免误删。

**symlink（软链接或符号链接symbolic link）：**类似于桌面快捷方式。比如 A 是 B 的软连接（A 和 B 都是文件名），A 和 B 的 indexNode 不相同，但 A 中只是存放这 B 的路径，访问 A 时，系统会自动找到 B。删掉 A 与 B 没有影响，相反删掉 B，A 依然存在，但它的指向是一个无效链接。

**store 目录:**
store 目录一般在${os.homedir}/.pnpm-store/v3/files 这个目录下。 由于 pnpm 会在全局的 store 目录下存储 node_modules 文件的 hard link，这样在不同项目中安装同一个依赖的时候，不需要每次都去下载，只需要安装一次就行，避免了二次安装的消耗。这点 npm 、yarn 在不同项目上使用，都需要重新下载安装。

**npm迁移到pnpm:**

首先，删除 `package-lock.json` 文件以及 `node_modules` 目录。 确保通过 `npm i -g pnpm` 安装好 `pnpm` 的前提下，执行 `pnpm install` 安装全部依赖。

运行项目:

> pnpm run dev



# 创建vite+vue3+pinin+ts项目

## 项目初始化

> pnpm create  vite
> cd vite-vue3-ts-pinia
> pnpm i
> pnpm run dev

## 配置自动启动浏览器和局域网访问:

`package.json`

```json{5}
{
  "name": "consult-patients",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite --open --host",
    "build": "run-p type-check build-only",
    "preview": "vite preview --port 4173",
    "build-only": "vite build",
    "type-check": "vue-tsc --noEmit",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore"
  },
}
```



## 设置路径别名

> pnpm i @types/node --save-dev// 使用path包设置路径别名 @ 时需要此包

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

    extends: [
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
    ],

    rules: {
        // override/add rules settings here, such as:
    }
};
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

## 集成prettier

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
   <h1> 测试 vueUse 的鼠标坐标 </h1>
   <h3>Mouse: {{x}} x {{y}}</h3>
 </template>

 <script lang="ts">
     import { defineComponent } from 'vue';
     import { useMouse } from '@vueuse/core'

     export default defineComponent({
         name: 'VueUse',
         setup() {
           const { x, y } = useMouse()

           return {
             x, y
           }
         }
     });
 </script>
```

## 安装axios

axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。

注意：不是所有的插件都带有类型声明文件，只有类型声明文件才能保证支持ts，没有类型声明文件的插件需要安装类型声明文件。

> pnpm i axios @types/axios

新建 src/utils/axios.ts

```typescript
 import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

 const service = axios.create();

 // Request interceptors
 service.interceptors.request.use(
     (config: AxiosRequestConfig) => {
         // do something
         return config;
     },
     (error: any) => {
         Promise.reject(error);
     }
 );

 // Response interceptors
 service.interceptors.response.use(
     async (response: AxiosResponse) => {
         // do something
     },
     (error: any) => {
         // do something
         return Promise.reject(error);
     }
 );

 export default service;
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
import * as login from './module/login';
import * as index from './module/index';

export default Object.assign({}, logins, index);
```

新建 src/api/module/login.ts 和 src/api/module/index.ts

```typescript
import request from '@/utils/axios';

/**
 * 登录
 */
 
interface IResponseType<P = {}> {
    code?: number;
    status: number;
    msg: string;
    data: P;
}
interface ILogin {
    token: string;
    expires: number;
}
export const login = (username: string, password: string) => {
    return request<IResponseType<ILogin>>({
        url: '/api/auth/login',
        method: 'post',
        data: {
            username,
            password
        }
    });
};
```

由于使用了 typescript，所以需新增 src/types/shims-axios.d.ts

```typescript
import { AxiosRequestConfig } from 'axios';
/**
 * 自定义扩展axios模块
 * @author Maybe
 */
declare module 'axios' {
    export interface AxiosInstance {
        <T = any>(config: AxiosRequestConfig): Promise<T>;
        request<T = any>(config: AxiosRequestConfig): Promise<T>;
        get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
        delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
        head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
        post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
        put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
        patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
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

## 安装路由router

> pnpm i -S vue-router

在src目录下新建router文件夹，然后在router目录下新建index.ts文件，在index.ts文件下配置路由

```ts
import { createRouter,createWebHistory } from "vue-router";
import Home from "../views/Home.vue"
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

然后在main.ts中引入

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



## 安装element-plus

> pnpm i -S  element-plus

在main.ts中引入使用

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

## 安装sass 和sass-loader

> pnpm i -D sass sass-loader

## 安装unplugin-auto-import

> pnpm i -D unplugin-auto-import

在vite.config.ts中配置

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

## 安装less

>  pnpm add -D less

```less
 <style lang="less">
   .root {}
 </style>
```



## 安装pinia

> pnpm i pinia

main.ts中引用

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

项目src下创建文件stores/counter.ts

```typescript
import { defineStore } from 'pinia'

// export const useCounterStore = defineStore('counter', {
export const useCounterStore = defineStore({
  id: 'counter',
  state: () => ({
    counter: 0
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
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
import { useCounterStore } from "../stores/counter"
const useCounter = useCounterStore()
const cahnge = () => {
  useCounter.increment()
}
useCounter.$subscribe((args, state) => {
  console.log("store", args, state)
})
</script>
```

修改State：

```vue
 // 1. 直接修改 state （不建议）
 userStore.name = '李四'

 // 2. 通过 actions 去修改
 <script lang="ts" setup>
 import { useUserStore } from '@/store/user'

 const userStore = useUserStore()
 userStore.updateName('李四')
 </script>

```



## 手写pinia持久化插件

在main.ts中定义一个方法在pinia中注册

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
import { PiniaPluginContext } from "pinia";
 
const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};
 
const getStorage = (key: string) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string) : {};
};
 
type Options = {
  key?: string;
};
const __piniaKey__: string = "mystoragekey";
 
export const piniaPlugin = (options: Options) => {
  return (context: PiniaPluginContext) => {
    console.log("main-pinia", context);
    const { store } = context;
    const data = getStorage(`${options?.key ?? __piniaKey__}-${store.$id}`);
 
    store.$subscribe(() => {
      console.log("store---change");
      setStorage(`${options?.key ?? __piniaKey__}-${store.$id}`, toRaw(store.$state));
    });
    console.log("H00000000000", store);
    return {
      ...data,
    };
  };
};
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

## 安装vite-plugin-vue-setup-extend

在使用 Vue3.2 的 setup 语法糖后，无法优雅的定义组件的 name 值，虽然 vite 会根据组件的文件名自动生成组件名，但是需要自定义的组件名时，就很不方便。

解决方法

方案1：写两个 script 标签

最简单的方法就是写两个script 标签，一个用 setup 语法，一个不用 setup 语法，代码如下：

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

方案2：使用 vite 插件 vite-plugin-vue-setup-extend

> pnpm i vite-plugin-vue-setup-extend -D

配置 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
export default defineConfig({
  plugins: [ VueSetupExtend() ]
})
```

使用:

```typescript
<script lang="ts" setup name="demo">

</script>
```

问题：

在使用 vite-plugin-vue-setup-extend 0.4.0 及以前版本时，会有个问题：如果 script 标签内没有内容，即使给 script 标签添加上 name 属性，其在 vue-devtools 内也不会生效。

解决办法: 不要让script标签内空着，例如：加行注释。

```vue
<script lang="ts" setup name="demo">
// test
</script>
```

## 安装全局事件发布订阅mitt

在vue2 中我们可以创建一个新的 const eventbus = new Vue() 实例去做事件广播，但是在vue3.x中不允许我们这样做，我们可以使用插件mitt实现

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

A.vue  发布事件

```vue
<template>
  <div class="header">
    <button @click="sendEmit">派发事件</button>
  </div>
</template>
 
<script setup lang="ts">
import { getCurrentInstance } from 'vue';
 
let instance = getCurrentInstance()
 
let sendEmit = () => {
  instance?.proxy?.$Bus.emit('on-paifa', 'mitt 全局广播事件')
 
}
</script>
 
<style lang="less" scoped>
 
</style>
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
import { getCurrentInstance, inject, Ref, ref } from "vue";
 
let instace = getCurrentInstance()
instace?.proxy?.$Bus.on("on-a", (res: any) => {
  name.value = res
  console.log("res", res)
})
</script>
 
<style scoped>
 
</style>
```

派发多个事件

```typescript
import { getCurrentInstance } from 'vue';
 
 
let instance = getCurrentInstance()
 
let sendEmit = () => {
  instance?.proxy?.$Bus.emit('on-paifa', 'mitt 全局广播事件')
  instance?.proxy?.$Bus.emit('on-a', 'mitt 全局广播事件AAAA')
  instance?.proxy?.$Bus.emit('on-b', 'mitt 全局广播事件BBBB')
}
```

订阅多个事件

```typescript
import { getCurrentInstance } from 'vue';
 
let instance = getCurrentInstance()
 
//type 事件名称  res传参
 instance?.proxy?.$Bus.on('*', (type: any, res: any): void => {
  console.log("mitt派发======", type, res)
})
```

卸载监听 $Bus.off('事件名称', fun())

```typescript
let fun = (res: any) => {
  console.log("mitt派发======", res)
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
import { getCurrentInstance, inject, Ref, ref } from "vue";
 
//第一种
let instace = getCurrentInstance()
instace?.proxy?.$Bus.on()
 
//第二种
let { appContext: { config: { globalProperties: $global } } } = getCurrentInstance() as any
 
$global.$Bus.on()
console.log("aaaa", $global)
 
//第三种
let { proxy } = getCurrentInstance() as any
proxy.$Bus.on()
 
</script>
```

> 五、路由方面：路由全局守卫、动态路由等
> 项目中使用vue-router@4.x 可以参考之前写的文档
>
> 1、
> router跳转传参/嵌套路由/路由重定向/别名
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

## 原生css variable新特性

原生支持，不需要第三方插件，具体使用文档可 查看

新建文件 src/styles/index.css

```css{1,3}
 :root {
   --main-bg-color: pink;
 }
 body {
   background-color: var(--main-bg-color);
 }
```

## 安装postcss-px-to-viewport

如果你的样式需要做根据视口大小来调整宽度，这个脚本可以将你CSS中的px单位转化为vw，1vw等于1/100视口宽度。
使用npm安装

> pnpm install postcss-px-to-viewport --save-dev
>
> pnpm install postcss-px-to-viewport-8-plugin

或者使用yarn进行安装

> yarn add -D postcss-px-to-viewport

配置参数(默认参数):

```js
{
  unitToConvert: 'px',// 需要转换的单位，默认为"px"
  viewportWidth: 320,// 设计稿的视口宽度
  unitPrecision: 5,// 单位转换后保留的精度
  propList: ['*'],// 能转化为vw的属性列表,在特定属性前加 "!"，将不转换该属性的单位 . 例如: ['*', '!letter-spacing']，将不转换letter-spacing
      //在属性的前或后添加"",可以匹配特定的属性. (例如['position*'] 会匹配 background-position-y)
  viewportUnit: 'vw',// 希望使用的视口单位
  fontViewportUnit: 'vw',// 字体使用的视口单位
  selectorBlackList: [],// 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位
      // 如果传入的值为字符串的话，只要选择器中含有传入值就会被匹配;例如 selectorBlackList 为 ['body'] 的话， 那么 .body-class 就会被忽略
      // 如果传入的值为正则表达式的话，那么就会依据CSS选择器是否匹配该正则;例如 selectorBlackList 为 [/^body$/] , 那么 body 会被忽略，而 .body 不会
  minPixelValue: 1,// 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
  mediaQuery: false,// 媒体查询里的单位是否需要转换单位
  replace: true,// 是否直接更换属性值，而不添加备用属性
  exclude: undefined,// 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件;如果值是一个正则表达式，那么匹配这个正则的文件会被忽略;如果传入的值是一个数组，那么数组里的值必须为正则
  include: undefined,// 如果设置了include，那将只有匹配到的文件才会被转换，例如只转换 'src/mobile' 下的文件 (include:/\/src\/mobile\//)
      // 如果值是一个正则表达式，将包含匹配的文件，否则将排除该文件
// 如果传入的值是一个数组，那么数组里的值必须为正则
  landscape: false,// 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
  landscapeUnit: 'vw',// 横屏时使用的单位
  landscapeWidth: 568// 横屏时使用的视口宽度
}
// exclude和include是可以一起设置的，将取两者规则的交集。
```

在项目根目录下添加`.postcssrc.js`文件

```js
module.exports = {
  plugins: {
    autoprefixer: {}, // 用来给不同的浏览器自动添加相应前缀，如-webkit-，-moz-等等
    "postcss-px-to-viewport": {
      unitToConvert: "px", // 要转化的单位
      viewportWidth: 750, // UI设计稿的宽度
      unitPrecision: 6, // 转换后的精度，即小数点位数
      propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
      selectorBlackList: ["wrap"], // 指定不转换为视窗单位的类名，
      minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
      mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
      replace: true, // 是否转换后直接更换属性值
      exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
      landscape: false // 是否处理横屏情况
    }
  }
};
```

- `propList`: 当有些属性的单位我们不希望转换的时候，可以添加在数组后面，并在前面加上!号，如`propList: ["*","!letter-spacing"]`,这表示：所有css属性的属性的单位都进行转化，除了`letter-spacing`的
- `selectorBlackList`：转换的黑名单，在黑名单里面的我们可以写入字符串，只要类名包含有这个字符串，就不会被匹配。比如`selectorBlackList: ['wrap']`,它表示形如`wrap`,`my-wrap`,`wrapper`这样的类名的单位，都不会被转换

当然，当我们引入一些第三方库的时候，比如`vant`，上面配置的`exclude`去掉，表示全部内容进行vw转换，会遇到这样的问题：

像这个TabBar，变得非常的小，被压扁了。

其实vant官网也是给出了关于viewport的适配方案，在github找一个名为vant-demo的项目，可以看到其配置如下，github链接：


很尴尬，vant团队的是根据375px的设计稿去做的，理想视口宽度为375px。

那么，我们是否也要叫UI重新出一版375px的设计稿？

或者，我们在书写的过程心算一下，所有标注的尺寸都除以2？

让我们回到webpack本身，重新看一下这份.postcssrc.js文件，它除了暴露一个对象，也可以暴露一个函数，无论暴露什么，在webpack运行时，都会被我们配置的海量文件读取并执行。

暴露函数有一个好处，可以拿到webpack运行的当前执行文件的信息。

那么我们可以有这样一个思路：如果读取的是vant相关的文件，viewportWidth就设为375，如果是其他的文件，我们就按照我们UI的宽度来设置viewportWidth，即750。

改写.postcssrc.js文件配置如下：

```js
const path = require('path');

module.exports = ({ webpack }) => {
  const designWidth = webpack.resourcePath.includes(path.join('node_modules', 'vant')) ? 375 : 750;

  return {
    plugins: {
      autoprefixer: {},
      "postcss-px-to-viewport": {
        unitToConvert: "px",
        viewportWidth: designWidth,
        unitPrecision: 6,
        propList: ["*"],
        viewportUnit: "vw",
        fontViewportUnit: "vw",
        selectorBlackList: [],
        minPixelValue: 1,
        mediaQuery: true,
        exclude: [],
        landscape: false
      }
    }
  }
}
// 注意：这里使用path.join('node_modules', 'vant')是因为适应不同的操作系统，
// 在mac下结果为node_modules/vant，而在windows下结果为node_modules\vant

```

在vite中使用:

问题描述：
安装完 postcss-px-to-viewport 插件后，按照之前vue-cli项目的方式，src目录下新建 postcss.config.js 文件并进行规则配置。运行起来并未报错，但是发现px并没有转换为vw单位。

问题解决：
因为vite中已经内联了postcss，所以并不需要额外的创建 postcss.config.js文件，vite关于css.postcss 我们只需要在 vite.config.ts中进行配置即可：具体配置如下:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcsspxtoviewport from 'postcss-px-to-viewport'

export default defineConfig({
  plugins: [
    vue()
  ],
  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport({
          unitToConvert: 'px', // 要转化的单位
          viewportWidth: 750, // UI设计稿的宽度
          unitPrecision: 6, // 转换后的精度，即小数点位数
          propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
          viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
          fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
          selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
          minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
          mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          replace: true, // 是否转换后直接更换属性值
          // exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
          exclude: [],
          landscape: false // 是否处理横屏情况
        })
      ]
    }
  }
})
```

解决vite中使用postcss-px-to-viewport无法使用vant等多种设计尺寸问题

> pnpm i cnjm-postcss-px-to-viewport

一直希望在**vite** 中 使用 postcss-px-to-viewport 时可以设置不同的设计尺寸，比如**vant**是375设计的

```js
const path = require("path");
module.exports = () => {
  return {
    plugins: {
      autoprefixer: {
        overrideBrowserslist: ["Android 4.1", "iOS 7.1", "Chrome > 31", "ff > 31", "ie >= 8"],
      },
      // 修改插件名称
      "cnjm-postcss-px-to-viewport": {
        unitToConvert: "px", // 要转化的单位
        viewportWidth: 750, // UI设计稿的宽度
        unitPrecision: 6, // 转换后的精度，即小数点位数
        propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
        viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
        fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
        selectorBlackList: ["ignore"], // 指定不转换为视窗单位的类名，
        minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
        mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
        replace: true, // 是否转换后直接更换属性值
        exclude: [], // 设置忽略文件，用正则做目录名匹配
        landscape: false, // 是否处理横屏情况
        // 如果没有使用其他的尺寸来设计，下面这个方法可以不需要，比如vant是375的
        customFun: ({ file }) => {
          // 这个自定义的方法是针对处理vant组件下的设计稿为375问题
          const designWidth = path.join(file).includes(path.join("node_modules", "vant")) ? 375 : 750;
          return designWidth;
        },
      },
    },
  };
};
```

## 安装vite-plugin-svg-icons

一、安装 vite-plugin-svg-icons

```
npm i vite-plugin-svg-icons -D
// 或者
yarn add vite-plugin-svg-icons -D
```

二、在main.js引入

```js
import 'virtual:svg-icons-register'
```

三、配置SVG图片文件夹

![img](https://img-blog.csdnimg.cn/9c6af5cc6ee64c41bc89cf4570a52839.png)

四、在vite.config.js中配置

```diff
//import path,{ resolve } from 'path'
import path from 'path'
+import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
 
export default defineConfig((command) => {
 return {
    plugins: [
+      createSvgIconsPlugin({
+        // 指定要缓存的文件夹
+        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
+        // 指定symbolId格式
+        symbolId: '[name]'
+      })
    ],
}
})
```

五、新建svg封装组件，路径参考：src\components\svg-icon\index.vue

```vue
<template>
  <svg :class="svgClass" aria-hidden="true">
    <use class="svg-use" :href="symbolId" />
  </svg>
</template>
 
<script>
  import { defineComponent, computed } from 'vue'
 
  export default defineComponent({
    name: 'SvgIcon',
    props: {
      prefix: {
        type: String,
        default: 'icon'
      },
      name: {
        type: String,
        required: true
      },
      className: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      const symbolId = computed(() => `#${props.name}`)
      const svgClass = computed(() => {
        if (props.className) {
          return `svg-icon ${props.className}`
        }
        return 'svg-icon'
      })
      return { symbolId, svgClass }
    }
  })
</script>
<style scope>
  .svg-icon { 
    vertical-align: -0.1em; /* 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果 */
    fill: currentColor; /* 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承 */
    overflow: hidden;
  } 
</style>
```

六、按需引入使用

```vue
<template>
  <SvgIcon name="issue"></SvgIcon>
</template>
 
<script setup>
import SvgIcon from "@/components/SvgIcon.vue";
</script>
```

七、全局引入使用

在main.js中加入

```diff
//src/main.js
 
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
 
 
+import svgIcon from './components/svgIcon/index.vue'
+import 'vite-plugin-svg-icons/register'
 
createApp(App)
    .use(router)
+    .component('svg-icon', svgIcon)
    .mount('#app')
```

使用:

```vue
  <svg-icon name="arrow-down" class="any" />
```

## 移动端调试神器Eruda

你可以通过 npm 来下载使用该工具：

> npm install eruda --save

然后在页面中引入以下脚本：

> (function () {
>  var src = 'node_modules/eruda/dist/eruda.min.js';
>  if (!/eruda=true/.test(window.location) && localStorage.getItem('active-eruda') != 'true') return;
>  document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
> })();

```html
<!DOCTYPE html>      
<html lang="en">      
<head>      
    <meta charset="UTF-8">      
    <title>移动端调试神器（eruda）</title>    
    <style type="text/css">  
      .test{background: green;}  
      .one{display: inline-block; width:100px;height: 100px;background: #ddd;}
      .two{display: inline-block; width:100px;height: 100px;background: #666;}
    </style>     
</head>      
<body>

<div class="test">
  <div class="one">1</div>
  <div class="two">2</div>
  <button id="btn">按钮</button>
</div>  

<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.js"></script>
<script type="text/javascript">
  console.log('这个输出在eruda之前，所以无法捕获到~');
</script>
<script type="text/javascript">
(function () {
    //var src = 'http://eruda.liriliri.io/eruda.min.js';
    //var src = 'https://cdn.jsdelivr.net/npm/eruda';
    var src = 'https://cdn.bootcss.com/eruda/1.3.2/eruda.min.js';

    //添加下面的代码需要在url里填?eruda=true才能启动eruda
    //if (!/eruda=true/.test(window.location)) return; 

    document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
    document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();
</script>
<script type="text/javascript">
  console.log('这个输出在eruda之后，成功捕获！');
  $('#btn').on('click', function() {
    console.log('徐同保');
  });
</script>
</body>      
</html>
```

通过CDN引入

```html
<script src="//cdn.bootcss.com/eruda/1.3.0/eruda.min.js"></script> 
<script>eruda.init();</script>
```

通过npm引入

> npm install eruda --save

在页面中加载脚本：

```html
<script src="node_modules/eruda/eruda.min.js"></script> 
<script>eruda.init();</script>
```

配置面板的代码如下：

```html
<script>eruda.init({tool: ['console', 'elements']});</script>
```

## 使用middir生成项目目录

安装:

> npm i mddir -g

在需要得到目录结构树的目录下打开终端,输入mddir,在根目录得到一个`directoryList.md`

# vue3+ts+vite 搭建uniapp项目

> npx @dcloudio/uvm // 控制包版本切换,更新包防止创建项目失败
> npx degit dcloudio/uni-preset-vue#vite uni-shop //创建vue3的uni-app项目
> 就是Vue3创建的项目默认不安装API语法提示依赖，所以要我们手动去安装一下，然后去tsconfig.json配置一下
> npm i @dcloudio/types miniprogram-api-typings mini-types -D
> npm i
> npm run dev:mp-weixin
> npm run build:

## **模板下载：**

uniapp 官网通过vue-cli 命令行创建uniapp，参考uni-app官网，使用  `npx degit dcloudio/uni-preset-vue#vite-ts my-vue3-project`下载模板；

## **安装css预处理 sass:**

项目终端输入：`yarn add node-sass@^4.0.0 sass-loader@^10.0.1 sass`（模板没有默认安装sass, 如果不安装直接使用会报错）

## **安装uni-ui组件库，配置easycom模式无引入使用:**

项目终端输入：`yarn add @dcloudio/uni-ui`
`src/package.json` 文件配置easycom模式(组件无需import | require直接使用)

```json
"easycom": {
    "autoscan": true,
    "custom": {
      "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
    }
  }
```

## **配置使用微信小程序API**

由于安装的`uniapp-ts`项目只会包含uni-app本身的@types声明，如果想直接使用wx或小程序的api的话就需要自行添加，以微信小程序为例：项目终端输入：`yarn add @types/weixin-app`

打开`tsconfig.json`文件，在types选项中添加`weixin`使用的声明

```json
 "types": [
        "@dcloudio/types",      //这一项是原本包含的  
        "weixin-app",           //wx-app的TypeScript定义  新添加 
 
/******************以下包需要先安装***************************/
        
        "miniprogram-api-typings",//微信小程序api的typescript类型定义文件，和weixin-app同；可选
        "mini-types",             //支付宝小程序的typescript类型定义文件
    ],
```

## **配置文件路径别名 | 可选**

打开`vite.config.ts`文件，使用resolve选项配置：

```typescript
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
 
const path = require('path')
 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
```

## **tsconfig.json中配置**

```json
//compilerOptions中配置
 
"baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
```

## **发现在vite.config.ts中无法使用关键字 require；要重启编辑器）**

安装依赖包：`pnpm add @types/node -D`

`tsconfig.json`中配置 | 可选：

```json
//compilerOptions中配置
 
"types": [
        "@dcloudio/types",
        "weixin-app", 
        "miniprogram-api-typings",
        "mini-types",
        "node"          //可选
    ],
```

**重启编辑器**

**运行项目：** 

使用`pnpm run dev:mp-weixin`运行**；微信开发者工具打开**`dist/mp-weixin`文件夹

**卸载不需要的包**
因为默认的项目中带了`vue-i18n`的包，而我们小程序和微信H5项目一般都不需要多语言所以把`vue-i18n`删除了

> pnpm uninstall vue-i18n

## **配置 eslint + prettier 自动格式化代码**

安装相关依赖包

> pnpm add @typescript-eslint/eslint-plugin --dev
> pnpm add @typescript-eslint/parser --dev
> pnpm add @vue/eslint-config-prettier --dev
> pnpm add @vue/eslint-config-typescript --dev
> pnpm add @vuedx/typescript-plugin-vue --dev
> pnpm add eslint --dev
> pnpm add eslint-plugin-prettier --dev
> pnpm add eslint-plugin-vue --dev
> pnpm add prettier --dev

**ESLint配置.eslintrc.js文件**

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
     // eslint-config-prettier 的缩写
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2021
  },
  plugins: [],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    semi: 0,
  }
}
```

**prettier配置 .prettierrc.js**

```js
module.exports = {
  printWidth: 120,
  tabWidth: 2,
  tabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'auto',
}
```

**vscode 配置 .vscode/settings.json**

```json
{
    "editor.formatOnSave": false,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "eslint.validate": ["typescript", "vue", "html", "json"],
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[vue]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[html]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[json]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "json.format.enable": false
  }
```

**配置package包检测命令**

```json
"lint": "eslint --ext .ts,tsx,vue src/** --no-error-on-unmatched-pattern --quiet",
"lint:fix": "eslint --ext .ts,tsx,vue src/** --no-error-on-unmatched-pattern --fix"
```

**配置忽略检查的文件.eslintignore**

```
*.css
*.less
*.scss
*.jpg
*.png
*.gif
*.svg
*vue.d.ts
```

## **设置别名**

vite.config.ts

```typescript
resolve: {
    alias: [
        {
            find: '@',
            replacement: resolve(__dirname, 'src'),
        },
    ],
},
```

tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": [ "src/*" ],
    },
  }
}
```

## **配置vuex**

> pnpm add vuex@next

![05.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d1541c6d0d444a4a3e261126e2c0c43~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

src\store\modules\app\action-types.ts

```typescript
export enum AppActionTypes {
  ACTION_LOGIN = 'ACTION_LOGIN',
  ACTION_RESET_TOKEN = 'ACTION_RESET_TOKEN',
}
```

src\store\modules\app\ations.ts

```typescript
import { ActionTree, ActionContext } from 'vuex'
import { RootState } from '@/store'
import { AppState } from './state'
import { Mutations } from './mutations'
import { AppActionTypes } from './action-types'
import { AppMutationTypes } from './mutation-types'

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(key: K, payload: Parameters<Mutations[K]>[1]): ReturnType<Mutations[K]>
} & Omit<ActionContext<AppState, RootState>, 'commit'>

export interface Actions {
  [AppActionTypes.ACTION_RESET_TOKEN]({ commit }: AugmentedActionContext): void
}

export const actions: ActionTree<AppState, RootState> & Actions = {
  [AppActionTypes.ACTION_LOGIN]({ commit }: AugmentedActionContext, token: string) {
    commit(AppMutationTypes.SET_TOKEN, token)
  },
  [AppActionTypes.ACTION_RESET_TOKEN]({ commit }: AugmentedActionContext) {
    commit(AppMutationTypes.SET_TOKEN, '')
  },
}
```

src\store\modules\app\index.ts

```typescript
import { Store as VuexStore, CommitOptions, DispatchOptions, Module } from 'vuex'
import { RootState } from '@/store'
import { state } from './state'
import { actions, Actions } from './ations'
import { mutations, Mutations } from './mutations'
import type { AppState } from './state'

export { AppState }

export type AppStore<S = AppState> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch'> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>
}

export const store: Module<AppState, RootState> = {
  state,
  actions,
  mutations,
}
```

src\store\modules\app\mutation-types.ts

```typescript
export enum AppMutationTypes {
  SET_TOKEN = 'SET_TOKEN',
}
```

src\store\modules\app\mutations.ts

```typescript
import { MutationTree } from 'vuex'
import { AppState } from './state'
import { AppMutationTypes } from './mutation-types'

export type Mutations<S = AppState> = {
  [AppMutationTypes.SET_TOKEN](state: S, token: string): void
}
export const mutations: MutationTree<AppState> & Mutations = {
  [AppMutationTypes.SET_TOKEN](state: AppState, token: string) {
    state.token = token
  },
}
```

src\store\modules\app\state.ts

```typescript
export interface AppState {
  token: string
}

export const state: AppState = {
  token: '',
}
```

src\store\getters.ts

```typescript
import { RootState } from '@/store'
export default {
  token: (state: RootState) => state.app.token,
}
```

src\store\index.ts

```typescript
import { createStore } from 'vuex'
import { store as app, AppState, AppStore } from '@/store/modules/app'
import getters from './getters'
export interface RootState {
  app: AppState
}
export type Store = AppStore<Pick<RootState, 'app'>>

export const store = createStore<RootState>({
  modules: {
    app,
  },
  getters,
})

export function useStore(): Store {
  return store as Store
}
```

vuex使用示例

```vue
<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
      <view @click="setToken">login</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AppActionTypes } from '@/store/modules/app/action-types'
import { useStore } from 'vuex'
const title = ref('Hello')
const store = useStore()
const setToken = () => {
  store.dispatch(AppActionTypes.ACTION_LOGIN, 'token')
  title.value = store.state.app.token
}
</script>
```

## **配置uni.request实现网络请求**

```typescript
/* eslint-disable @typescript-eslint/ban-types */
import appConfig from '@/config/app'
import { useStore } from 'vuex'
const { HEADER, HEADERPARAMS, TOKENNAME, HTTP_REQUEST_URL } = appConfig
type RequestOptionsMethod = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
type RequestOptionsMethodAll = RequestOptionsMethod | Lowercase<RequestOptionsMethod>

/**
 * 发送请求
 */
function baseRequest(
  url: string,
  method: RequestOptionsMethod,
  data: any,
  { noAuth = false, noVerify = false }: any,
  params: unknown
) {
  const store = useStore()
  const token = store.state.app.token
  const Url = HTTP_REQUEST_URL
  let header = JSON.parse(JSON.stringify(HEADER))
  if (params != undefined) {
    header = HEADERPARAMS
  }
  if (!noAuth) {
    if (!token) {
      return Promise.reject({
        msg: '未登录',
      })
    }
    if (token && token !== 'null') header[TOKENNAME] = 'Bearer ' + token
  }

  return new Promise((reslove, reject) => {
    uni.showLoading({
      title: '加载中',
      mask: true,
    })
    uni.request({
      url: Url + url,
      method: method || 'GET',
      header: header,
      data: data || {},
      success: (res: any) => {
        console.log('res', res)
        uni.hideLoading()
        res.data.token &&
          res.data.token !== 'null' &&
          store.commit('LOGIN', {
            token: res.data.token,
          })
        if (noVerify) {
          reslove(res)
        } else if (res.statusCode === 200) {
          reslove(res)
        } else {
          reject(res.data.message || '系统错误')
        }
      },
      fail: (msg) => {
        uni.hideLoading()
        reject('请求失败')
      },
    })
  })
}

// const request: Request = {}
const requestOptions: RequestOptionsMethodAll[] = [
  'options',
  'get',
  'post',
  'put',
  'head',
  'delete',
  'trace',
  'connect',
]
type Methods = typeof requestOptions[number]
const request: { [key in Methods]?: Function } = {}

requestOptions.forEach((method) => {
  const m = method.toUpperCase as unknown as RequestOptionsMethod
  request[method] = (api, data, opt, params) => baseRequest(api, m, data, opt || {}, params)
})

export default request
```

## **利用Koa配置Mock数据服务器**

dependencies

```javascript
"dependencies": {
    "koa": "^2.13.0",
    "koa-body": "^4.2.0",
    "koa-logger": "^3.2.1",
    "koa-router": "^10.0.0",
    "koa2-cors": "^2.0.6",
    "lodash": "^4.17.20",
    "log4js": "^6.3.0",
    "faker": "^5.1.0",
    "reflect-metadata": "^0.1.13"
}
```

devDependencies

```javascript
"devDependencies": {
    "@types/koa": "^2.11.6",
    "@types/koa-logger": "^3.1.1",
    "@types/koa-router": "^7.4.1",
    "@types/koa2-cors": "^2.0.1",
    "@types/faker": "^5.1.5",
}
```

在根目录下建一个mock目录

具体目录结构如下

![06.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71e40462fd154acb90f258b357a2bc30~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

package.json里配置mock服务器启动命令

```javascript
"scripts": {
	"mock": "cd mock && ts-node-dev mock.ts"
}
```

api/user.ts

```javascript
import request from '@/utils/request.js'

/**
 * 获取用户信息
 *
 */
export function fetchUserInfo() {
  return request?.get?.('/user/userInfo', {}, { noAuth: true })
}
```

测试访问使用

```javascript
fetchUserInfo()
  .then((r) => {
    console.log('r', r)
  })
  .catch((err) => console.log(err))
```

## 测试运行

运行小程序测试环境

> npm run dev:mp-weixin

启动正常并打印出了mock的数据

![07.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d32f8259d8d42c6b3a81f9789216b01~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

打印出mock数据

![08.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6e01c86ae0f405da3cfeeb3356a0495~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

同理测试H5端运行情况

> npm run dev:h5

运行正常并打印出了mock数据

![09.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2cf29c9b85054bf6aa3f7db4eadb66bd~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

## ---------------

## 配置云函数目录

首先我们在 src 目录下创建一个新的目录 `src/cloudfuntioncs` 用于存放我们的云函数，当你创建后我们会发现，这个目录在编译后并没有在微信开发工具中出现，也就意味着并没有被编译到最终产物中。

这个原因是由于云函数文件夹并没有被其他的文件所引用，因此 vite 进行编译时会并不会将这个 `cloudfuntioncs` 这个目录打包到产物中，因此我们需要自己将这个文件给复制出来。这一步我使用的是 `rollup-plugin-copy` 这个 rollup 插件。

1. 首先安装 `rollup-plugin-copy`

> yarn add -D rollup-plugin-copy

1. 接着在 `vite.config.ts` 中配置一下需要复制的目录:

```ts
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import copy from 'rollup-plugin-copy'
import path from 'path'

export default defineConfig({
  plugins: [copy({
    targets: [
      {
        src: 'src/cloudfunctions/**/*',
        dest: `dist/${process.env.NODE_ENV === 'production' ? 'build' : 'dev'}/${process.env.UNI_PLATFORM}/cloudfunctions`
      }
    ]
  }), uni()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

这一步我使用了环境变量去动态复制 `cloudfunctions` 目录到开发或者生产的目录位置。配置完成后我们就可以看到 `cloudfuntioncs` 目录在微信开发工具也能看到了。

![image.png](https://img-blog.csdnimg.cn/img_convert/0b7f7539fad1d248e3d0a60c6a3a8618.png)

## 配置项目 eslint

既然配置了 ts ，为了开发更加规范，我们就将 eslint 也一并配置了，操作步骤如下：

1. 安装 eslint

> yarn add -D eslint

1. 初始化 eslint

> npx eslint --init

执行命令后根据提示进行操作选择自己的风格，我选择的风格如下：

![image.png](https://img-blog.csdnimg.cn/img_convert/fc63e2420bbdf51029625c51c26e75e0.png)

1. 配置全局变量
   由于 `uni` 或者 `wx` 这种全局变量是不需要引入就可以使用的，eslint 会提示变量未定义，因此我们需要在 `eslintrc.js` 中配置一下 globals 变量：

```js
modele.export = 
{
//...
globals: {
    uni: true,
    UniApp: true,
    wx: true,
    ICloud: true
  },
}
12345678910
```

## 配置 pinia 全局数据及数据持久化

因为使用了 `vue3 + ts` 的技术栈，继续使用 vuex 的话配置起来很麻烦，而且 ts 支持并不算好，因此我们使用 pinia 来替代 vuex，首先安装 [pinia](https://pinia.vuejs.org/)

> yarn add pinia

pinia 和 vuex 一样都可以以模块的方式去区分不同的全局数据类型，但是我这里全局数据并不多，因此我将所有的全局数据放在一个文件中：

```ts
// useStore.ts
import { defineStore, createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { User } from '../types/user'

type StateType = {
	user?: User
}
export default defineStore('global', {
  persist: {
    key: 'pinia',
    paths: ['user']
  },
  state: (): StateType => ({
    user: undefined
  }),
  actions: {
    setData<T extends keyof StateType> ({ key, value }: { key: T, value: any }) {
      this[key] = value
    }
  }
})

export const pinia = createPinia().use(
  createPersistedState({
    storage: {
      getItem (key: string): string | null {
        return uni.getStorageSync(key)
      },
      setItem (key: string, value: string) {
        uni.setStorageSync(key, value)
      }
    }
  })
)
```

在上面的代码中，我通过 `pinia-plugin-persistedstate` 进行数据的持久化，由于默认的是使用 `localstorage` 进行数据存储，因此需要自己重新定义一下，使用 uniapp 的 api 进行数据存取。

`persist` 字段中 `key` 是存储在本地的键名，`path` 则是选择某个数据需要进行持久化，我配置的持久化效果如下图：

![image.png](https://img-blog.csdnimg.cn/img_convert/0cf7d0844b620173d98d67711bef8dd1.png)

接下来在 `main.ts` 中引入一下：

```ts
// main.ts
import { createSSRApp } from 'vue'
import App from './App.vue'
import { pinia } from './hooks/useStore'

export function createApp () {
  const app = createSSRApp(App)
  app.use(pinia)
  return {
    app
  }
}
```

这样我们就可以通过 pinia 来进行全局数据的存取了,使用的方式如下：

```ts
import useStore from '@/hooks/useStore'
const store = useStore()

// 取值
console.log(store.user)

// 赋值
store.setData({ key: 'user', value:{ id: 0, name: 'oil '} })
```

### 注意点

在使用 pinia 中的变量时如果使用解构赋值，需要使用 `storeToRefs` 这个方法包裹一下，否则全局变量会失去响应式，变量更新时并不会重新渲染组件。

```ts
import { storeToRefs } from 'pinia'

// bad
const {user} = useStore()

// good
const {user} = storeToRefs(useStore())
```
