import Vue from 'vue'
import VueRouter from 'vue-router'
import Word from "@/views/Word";
import Design from "@/views/Design";
import Drawio from "@/views/Drawio";
import Design2 from "@/views/Design2";

Vue.use(VueRouter)

//获取原型对象的push函数
const originalPush = VueRouter.prototype.push
// 修改 原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err=>err)
}

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path: '/80',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/home.vue'),
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('../views/ProjectsView')
  },
  {
    path: '/team',
    name: 'team',
    component: () => import('../views/Team')
  },
  {

    path: '/teamOne',
    name: 'teamOne',
    component: () => import('../views/TeamDes')
  }, 
  {
    path: '/editWord',
    name: 'edit',
    component: () => import('../views/Edit'),
    children: [
      {
        path: 'word',
        component: Word
      },
      {
        path: 'design',
        component: Design
      },
      {
        path: 'UML',
        component: Drawio
      },
      {
        path:'design2',
        component: Design2
      }
    ]
  },
  {
    path: '/edit',
    name: 'Edit',
    component: () => import("../views/WordEdit")
  },
  {
    path: '/markdown',
    name: 'markdown',
    component: () => import("../views/UseForMarkdown") 
  },
  {
    path: '/test',
    name: 'test',
    component: () => import("../views/test")
  },
  {
    path: '/test2',
    name: 'test2',
    component: () => import("../views/test2")
  },
  {
    path: '/test3',
    name: 'test3',
    component: () => import("../views/Example")
  },
  {
    path: '/teamDoc',
    name: 'documentCenter',
    component: () => import(/* webpackChunkName: "about" */ '../views/DC.vue'),
  },
  {
    path: '/doc',
    name: 'doc',
    component: () => import(/* webpackChunkName: "about" */ '../views/doc.vue'),
  },
  {
    path: '/createDoc',
    name: 'createDoc',
    component: () => import(/* webpackChunkName: "about" */ '../views/createDoc.vue'),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
