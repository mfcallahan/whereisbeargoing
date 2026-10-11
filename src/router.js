import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Instagram from './views/Instagram.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/instagram', component: Instagram },
  ],
})
