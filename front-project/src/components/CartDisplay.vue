<template>  
    <div class="container shadow-lg mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-12">Votre Panier</h2>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
       <LoadingSpinner/>
      <span class="ml-3 text-gray-600">Chargement du panier...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="text-red-600">
        <span class="font-semibold">Erreur :</span> {{ error }}
      </div>
    </div>

    <!-- Empty cart -->
    <div v-else-if="!cartItems || cartItems.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">🛒</div>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">Votre panier est vide</h3>
      <p class="text-gray-500 mb-6">Ajoutez des produits pour commencer vos achats</p>
      <router-link 
        to="/products" 
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
      >
        Découvrir nos produits
      </router-link>
    </div>

    <!-- Cart items -->
    <div v-else>
      <!-- Header -->
      <div class="grid grid-cols-12 gap-4 pb-4 mb-8 border-b border-gray-200">
        <div class="col-span-6 text-sm font-medium text-gray-700">Détails des produits</div>
        <div class="col-span-2 text-sm font-medium text-gray-700 text-center">Quantité</div>
        <div class="col-span-2 text-sm font-medium text-gray-700 text-center">Prix</div>
      </div>

      <!-- Cart items list -->
      <div class="space-y-8">        
        <div 
          v-for="item in cartItems" 
          :key="item.id" 
          class="grid grid-cols-12 gap-4 items-center py-6 border-b border-gray-100 last:border-b-0"
        >
          <!-- Product image and details -->
          <div class="col-span-6 flex items-center space-x-4">
            <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                :src="item.image" 
                :alt="item.title"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-900 truncate">{{ item.title }}</h3>
              <div class="flex flex-wrap gap-2 mt-1">
                <span v-if="item.category" class="text-sm text-gray-500">
                  Catégorie: {{ item.category }}
                </span>
              </div>
            </div>
          </div>

          <!-- Quantity controls -->
          <div class="col-span-2 flex justify-center">
            <div class="flex items-center space-x-2">
              <button 
                @click="updateQuantity(item.id, item.quantity - 1)"
                :disabled="item.quantity <= 1"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
              <button 
                @click="updateQuantity(item.id, item.quantity + 1)"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          <!-- Price -->
          <div class="col-span-2 text-center">
            <span class="text-lg font-semibold text-gray-900">{{ formatPrice(item.price * item.quantity) }}</span>
          </div>

          <!-- Delete button -->
          <div class="col-span-2 flex justify-end">
            <button 
              @click="removeItem(item.id)"
              class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              title="Supprimer le produit"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>    

      <!-- Cart summary -->
      <div class="mt-12 pt-8 border-t border-gray-200">
        <div class="flex justify-end">
          <div class="w-64">
            <div class="flex justify-between items-center text-xl font-bold text-gray-900 mb-8">
              <span>Total</span>
              <span>{{ formatPrice(totalAmount) }}</span>
            </div>            <div class="flex flex-col sm:flex-row gap-4">
              <button 
                @click="clearCart"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Vider le panier
              </button>
              <button 
                class="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
              >
                Procéder au paiement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart.js';
import LoadingSpinner from './ui/LoadingSpinner.vue';

export default {
  name: 'CartDisplay',
  components: {
    LoadingSpinner,
  },
  setup() {
    const cartStore = useCartStore();
    
    return {
      cartStore
    };
  },
  computed: {
    cartItems() {
      return this.cartStore.items;
    },
    totalAmount() {
      return this.cartStore.totalAmount;
    },
    loading() {
      return this.cartStore.loading;
    },
    error() {
      return this.cartStore.error;
    }
  },
  mounted() {
    // Effacer les erreurs précédentes
    this.cartStore.clearError();
  },  methods: {
    async updateQuantity(productId, newQuantity) {
      if (newQuantity < 1) return;
      
      const success = this.cartStore.updateQuantity(productId, newQuantity);
      if (!success) {
        console.error('Erreur lors de la mise à jour de la quantité');
      }
    },

    async removeItem(productId) {
      const confirmed = confirm('Êtes-vous sûr de vouloir supprimer ce produit du panier ?');
      if (!confirmed) return;
      
      const success = this.cartStore.removeFromCart(productId);
      if (!success) {
        console.error('Erreur lors de la suppression du produit');
      }
    },

    async clearCart() {
      const confirmed = confirm('Êtes-vous sûr de vouloir vider complètement le panier ?');
      if (!confirmed) return;
      
      const success = this.cartStore.clearCart();
      if (!success) {
        console.error('Erreur lors du vidage du panier');
      }
    },formatPrice(price) {
      return `${price.toFixed(2)} €`;
    },

    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/150?text=Produit';
    }
  }
};
</script>

<style scoped>
</style>