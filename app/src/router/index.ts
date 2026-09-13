import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import SongList from "@/views/SongList.vue";
import AboutCard from "@/views/AboutCard.vue";
import SongCard from "@/views/SongCard.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/songlist'
  },
  {
    path: '/songlist',
    name: 'Lieder',
    component: SongList
  },
  {
    path: '/about',
    name: 'About',
    component: AboutCard
  },
  {
    path: '/song/:id',
    name: 'Song',
    component: SongCard
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
