import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '@/views/ProductView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import CartView from '@/views/CartView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import OrderConfirmationView from '@/views/OrderConfirmationView.vue'
import SignInView from '@/views/auth/SignInView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import UserAccountView from '@/views/user/UserAccountView.vue'
import { authService } from '@/services/authService'

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
    {
      path: '/products/:id',
      name: 'product-detail',
      component: ProductDetailView,
      props: true, // Permet de passer les paramètres de route comme props
    },
    {
      path: '/cart',
      name: 'panier',
      component: CartView,
      meta: { requiresAuth: true } // Route protégée
    },
    {
      path: '/checkout',
      name: 'commande',
      component: CheckoutView,
      meta: { requiresAuth: true } // Route protégée
    },
    {
      path: '/order-confirmation/:orderNumber',
      name: 'order-confirmation',
      component: OrderConfirmationView,
      meta: { requiresAuth: true } // Route protégée
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
    {
      path: '/account',
      name: 'mon-compte',
      component: UserAccountView,
      meta: { requiresAuth: true } // Route protégée
    },
  ],
})

// Navigation Guards - Protection des routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  
  // Vérifier si la route nécessite une authentification
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Rediriger vers la page de connexion
    next({ name: 'connexion' })
  } else if ((to.name === 'connexion' || to.name === 'inscription') && isAuthenticated) {
    // Rediriger les utilisateurs connectés vers leur espace utilisateur
    next({ name: 'mon-compte' })
  } else {
    // Autoriser la navigation
    next()
  }
})

export default router
