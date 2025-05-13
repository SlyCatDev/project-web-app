import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShowProduct from '@/views/showProduct.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Accueil',
      component: HomeView,
    },
    {
      path: '/products',
      name: 'produits',
      component: ShowProduct,
    },
  ],
})

export default router
