import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '@/views/ProductView.vue'
// import ProductDetailView from '@/views/ProductDetailView.vue'
import CartView from '@/views/CartView.vue'
import SignInView from '@/views/auth/SignInView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'

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
      component: ProductView,
    },
    // {
    //   path: '/products/:id',
    //   name: 'product-detail',
    //   component: ProductDetailView,
    // },
    {
      path: '/cart',
      name: 'panier',
      component: CartView,
    },
    {
      path: '/signIn',
      name: 'connexion',
      component: SignInView,
    },
    {
      path: '/register',
      name: 'inscription',
      component: RegisterView,
    },
  ],
})

export default router
