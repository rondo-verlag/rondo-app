import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import SongList from "@/views/SongList.vue";
import SongCard from "@/views/SongCard.vue";
import MenuList from "@/views/MenuList.vue";
import PaymentCard from "@/views/PaymentCard.vue";
import SongSettingsCard from "@/views/SongSettingsCard.vue";
import ViewSettingsCard from "@/views/ViewSettingsCard.vue";
import AboutCard from "@/views/AboutCard.vue";

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
    path: '/song/:id',
    name: 'Song',
    component: SongCard
  },
  {
    path: '/menu',
    name: 'MenuList',
    component: MenuList
  },
  {
    path: '/payment',
    name: 'PaymentCard',
    component: PaymentCard
  },
  {
    path: '/song-settings',
    name: 'SongSettingsCard',
    component: SongSettingsCard
  },
  {
    path: '/view-settings',
    name: 'ViewSettingsCard',
    component: ViewSettingsCard
  },
  {
    path: '/about',
    name: 'AboutCard',
    component: AboutCard
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
