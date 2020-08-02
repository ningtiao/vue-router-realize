# my-vue-router

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).




### vue 动态路由
```javascript

import Vue from 'vue'
import Index from '../views/Index.vue'
const routers = [
  {
    path: '/',
    name: 'Index,
    component: Index
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    // 开启props, 会把URL中的参数传递给组件
    // 在组件中通过props来接收参数
    props: true,
    component: () => import('../views/Detail.vue')
  }
]
// 获取参数
// 1 $route.params.id
// 2 通过开启props 获取id 
export default {
  name: 'Detail',
  props: ['id']
}
```
### Vue 嵌套路由 Vue Router

```javascript
{
  path: '/',
  component: Layout,
  children: [
    {
      name: 'index',
      path: '',
      component: 'Index',
    },
    {
      name: 'detail',
      path: 'detail:id',
      props: true,
      component: () => import('@/views/Detail.vue')
    }
  ]
}

```

### 编程式导航
```javascript
<button @click="push">push</button>
<button @click="go">go</button>

export default {
  name: 'Login',
  methods: {
    push() {
      this.$router.push('/')
      // 对象 路由名称
      this.$router.push({name: 'Home'})
    },
    go() {
      this.$router.go(-1)
    }
  }
}
```

### Hash模式和History 模式的区别

- Hash模式
 - https://music.163.com/#/playList?id=123456
- History 模式 需要服务端配和支持
 - https://music.163.com/playList/123456

#### 原理的区别
- Hash 模式是基于锚点,以及onhashchange事件
- History 模式是基于HTML5中的History API
history.pushState()   IE10后才支持
history.replaceState()

#### History 模式的使用
- History 需要服务器的支持
- 单页应用中,服务端不存在https:www.testurl.com/login这样的地址会返回找不到页面
- 在服务端应该除了静态资源外都返回单页面应用中的index.html

```javascript
{
  path: '/',
  component: Layout,
  children: [
    {
      name: 'index',
      path: '',
      component: 'Index',
    },
    {
      name: 'detail',
      path: 'detail:id',
      props: true,
      component: () => import('@/views/Detail.vue')
    },
    {
      name: '404',
      path: '*',
      props: true,
      component: () => import('@/views/404.vue')
    },
  ]
}

const router = new VueRouter({
  mode: 'history',
  routers
})
export default router
```

### History 模式- node.js
```javascript
const path = require('path')
// 导入处理history 模式的模块
history = require('connect-history-api-fallback')
// 导入express
const express = require('express')

consty app = express()
// 注册处理history 模式的中间价
app.use(history)
// 处理静态资源的中间件,网站根目录 ../web
// 开启服务器,端口是3000
app.use(express.static(path.join(__dirname), '../web'))

app.listen(3000, () => {
  console.log('服务器开启,端口3000')
})
// 在刷新的时候如果服务器没有找到页面,会默认把单页面应用的index.html返回浏览器
// 浏览器在加载的过程中会判断是否存在, 存在则跳转对应的页面
```

### History nginx

- nginx 服务器配置
- 从官网下载nginx的压缩包
- 把压缩包解压C盘根目录 c:nginx-1.18文件夹
- 打开命令行- 切换到根目录c:nginx-1.18.0

```javacript
/*
* start nginx 启动
* nginx -s reload 重启
* nginx -s stop 停止
*/

// 刷新页面 服务器返回404页面
// 解决
nginx.conf 配置 try_files $uri/ /index.html
// 重启nginx

server {
  listen    80;
  server_name localhost;

  location / {
    root html;
    index index.html index.htm;
    try_files $uri/ /index.html;
  }
  error_page 500 502 503 504 /50x.html
}
```

### Vue Router实现原理
#### History 模式
- 通过histoty.pushState()方法改变地址栏
- 监听popstate 时间
- 根据当前路由地址找到组件重新渲染页面
#### 前置知识
- 插件
- 混入
- Vue.observable()
- 插槽
- render函数
- 运行时和完整版的Vue

### VueRouter 模拟实现 - 分析

```javascript
// router/index.js
// 注册插件
Vue.use(VueRouter)
// 创建路由对象
const router = new VueRouter({
  routers: [
    {
      name: 'Login',
      path: '/',
      component: () => import('@/views/Login.vue')
    }
  ]
})
// main.js
// 创建vue 实例, 注册router对象

new Vue({
  router,
  render: h => h(App)
}).$mount('#app)
```

#### vue Router 类图
- options
- data
- routerMap
- Constructor(options): VueRouter
- _install(Vue): void
- init():void
- initEvent():void
- createRouterMap(): void
- initComponents(Vue): void

### Vue Router render
```
Vue.component('router-link', {
  props: {
    to: String
  },
  render (h) {
    return h('a', {
      attrs: {
        href: this.to
      }
    }, [this.$slots.default])
  }
  // template: '<a :href="to"><solt></slot></a>'
})

```

### Vue的构建版本
- 运行时版本: 不支持`template` 模版,需要打包的时候提前编译
- 完整版本: 包含运行时和编译器,体积比运行时大10k左右,程序运行的时候把模版转换成render函数