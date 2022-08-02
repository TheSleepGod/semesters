import Vue from 'vue'
import VueRouter from 'vue-router'
import Word from "@/views/Word";
import Design from "@/views/Design";

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/home.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
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
    name: 'Edit',
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
