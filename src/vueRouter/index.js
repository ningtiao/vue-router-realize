let _Vue = null

export default class VueRouter {
  static install (Vue) {
    // 1 判断当前插件是否已经被安装
    if (VueRouter.install.installed) {
      return
    }
    _Vue = Vue
    VueRouter.install.installed = true
    // 2 把Vue构造函数记录到全局变量
    // 3 把创建Vue 实例时候传入的router对象注入到Vue实例上
    // 4 混入
    _Vue.mixin({
      beforeCreate () {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }

  constructor (options) {
    this.options = options
    this.routeMap = {}
    this.data = _Vue.observable({
      current: '/'
    })
  }

  init () {
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
  }

  createRouteMap () {
    // 遍历所有的路由规则, 将路由规则解析成键值对形式存储在createRouterMap这个对象上,
    // 所有的路由规则都在options 上
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  initComponents (Vue) {
    // router-link 接收一个字符串参数to,也就是超链接的地址,
    // routerlink最终渲染成超链接的内容在routerlink标签之间
    Vue.component('router-link', {
      props: {
        to: String
      },
      render (h) {
        return h('a', {
          attrs: {
            href: this.to
          },
          on: {
            click: this.clickHandler
          }
        }, [this.$slots.default])
      },
      methods: {
        clickHandler (e) {
          history.pushState({}, '', this.to)
          this.$router.data.current = this.to
          e.preventDefault()
        }
      }
      // template: '<a :href="to"><slot></slot></a>'
    })
    const self = this
    Vue.component('router-view', {
      render (h) {
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }

  initEvent () {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })
  }
}
