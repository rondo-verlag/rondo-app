import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Songlist from "@/views/Songlist.vue";
import About from "@/views/About.vue";
import Song from "@/views/Song.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/songlist'
  },
  {
    path: '/songlist',
    name: 'Lieder',
    component: Songlist
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/song/:id',
    name: 'Song',
    component: Song
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
