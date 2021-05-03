import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Preferences from '../views/Preferences.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/preferences',
    name: 'Preferences',
    component: Preferences
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '*',
    component: NotFound,
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
