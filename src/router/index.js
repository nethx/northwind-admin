import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Layout from 'views/Layout'
import storage from 'utils/storage'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router)

//  NProgress.configure({
//    showSpinner: false
//  }) // NProgress Configuration

NProgress.configure({
  ease: 'cubic-bezier', //ease、linear、ease-in、ease-out、ease-in-out、cubic-bezier
  speed: 350,
  minimum: 0.1,
  showSpinner: false
})
const routerMap = [
  {
    path: '/login',
    name: 'Login',
    component: resolve => require(['views/Login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    component: resolve => require(['views/errorPage/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    name: '401',
    component: resolve => require(['views/errorPage/401'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/home',
    name: 'Home',
    hidden: true,
    children: [
      {
        path: '/home',
        component: resolve => require(['views/Home'], resolve),
        name: 'indexHome',
        hidden: true,
        meta: {
          title: '首页',
          icon: 'dashboard',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/employee',
    component: Layout,
    redirect: '/employee/list',
    name: 'Employee',
    alwaysShow: true,
    meta: {
      title: '员工管理',
      icon: 'people'
    },
    children: [
      {
        path: 'add',
        name: 'addEmployee',
        component: resolve => require(['views/employee/Edit'], resolve),
        meta: {
          title: '添加员工',
          icon: 'edit',
          noCache: true
        }
      },
      {
        path: 'edit/:id',
        name: 'editEmployee',
        component: resolve => require(['views/employee/Edit'], resolve),
        hidden: true,
        meta: {
          title: '编辑员工',
          noCache: true
        }
      },
      {
        path: 'list',
        name: 'listEmployee',
        component: resolve => require(['views/employee/List'], resolve),
        meta: {
          title: '员工列表',
          icon: 'list'
        }
      }
    ]
  },
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/list',
    name: 'Customer',
    // alwaysShow: true,
    meta: {
      title: '客户管理',
      icon: 'peoples'
    },
    children: [
      {
        path: 'add',
        name: 'addCustomer',
        component: resolve => require(['views/customer/Edit'], resolve),
        meta: {
          title: '添加客户',
          icon: 'edit',
          noCache: true
        }
      },
      {
        path: 'edit/:id',
        name: 'editCustomer',
        component: resolve => require(['views/customer/Edit'], resolve),
        hidden: true,
        meta: {
          title: '编辑客户',
          noCache: true
        }
      },
      {
        path: 'list',
        name: 'listCustomer',
        component: resolve => require(['views/customer/List'], resolve),
        meta: {
          title: '客户列表',
          icon: 'list'
        }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    name: 'product',
    // alwaysShow: true,
    meta: {
      title: '产品管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'add',
        name: 'addProduct',
        component: resolve => require(['views/product/Edit'], resolve),
        meta: {
          title: '添加产品',
          icon: 'edit',
          noCache: true
        }
      },
      {
        path: 'edit/:id',
        name: 'editProduct',
        component: resolve => require(['views/product/Edit'], resolve),
        hidden: true,
        meta: {
          title: '编辑产品',
          noCache: true
        }
      },
      {
        path: 'list',
        name: 'listProduct',
        component: resolve => require(['views/product/List'], resolve),
        meta: {
          title: '产品列表',
          icon: 'list'
        }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    name: 'order',
    alwaysShow: false,
    children: [
      {
        path: 'list',
        name: 'order_List',
        component: resolve => require(['views/order/List'], resolve),
        meta: {
          title: '订单查询',
          icon: 'shopping',
          noCache: true
        }
      }
    ]
  },
  {
    path: 'form',
    component: Layout,
    redirect: '/form',
    name: 'form',
    children: [
      {
        path: '/form',
        component: resolve => require(['views/Form'], resolve),
        name: 'formHome',
        meta: {
          title: '动态表单',
          icon: 'form',
          noCache: true
        }
      }
    ]
  }
]
const router = new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: routerMap
})
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)
  NProgress.start() // start progress bar
  let userInfo = storage.read('admin_UserInfo')
  if (userInfo) {
    if (!store.state.user.info) {
      store.dispatch('getUser')
    }
    if (to.name == 'Login') {
      next('/home')
    } else {
      next()
    }
  } else {
    if (to.name == 'Login') {
      next()
    } else {
      next('/login')
    }
  }
})
router.afterEach(transition => {
  NProgress.done()
})
export default router
