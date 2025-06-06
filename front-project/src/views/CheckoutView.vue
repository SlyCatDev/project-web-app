<template>
  <div class="checkout-view">
    <div class="container mx-auto px-4 py-8">
      <!-- Vérification que le panier n'est pas vide -->
      <div v-if="cartStore.isEmpty" class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">🛒</div>
        <h2 class="text-2xl font-semibold text-gray-600 mb-2">Votre panier est vide</h2>
        <p class="text-gray-500 mb-6">Ajoutez des produits à votre panier pour procéder au paiement</p>
        <router-link 
          to="/products" 
          class="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Découvrir nos produits
        </router-link>
      </div>

      <!-- Formulaire de checkout -->
      <CheckoutForm 
        v-else
        :cart-data="{
          items: cartStore.items,
          totalAmount: cartStore.totalAmount,
          itemCount: cartStore.itemCount
        }"
      />
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart.js'
import CheckoutForm from '@/components/forms/CheckoutForm.vue'

export default {
  name: 'CheckoutView',
  components: {
    CheckoutForm
  },
  setup() {
    const cartStore = useCartStore()

    return {
      cartStore
    }
  },
  mounted() {
    // Si le panier est vide, rediriger vers la page des produits après 3 secondes
    if (this.cartStore.isEmpty) {
      setTimeout(() => {
        this.$router.push('/products')
      }, 3000)
    }
  }
}
</script>

<style scoped>
.checkout-view {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
