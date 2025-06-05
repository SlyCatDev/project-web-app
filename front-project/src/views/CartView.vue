<template>
  <div class="cart-view">
      
      <div class="container mx-auto px-4 py-8 space-y-12">
        <!-- Interface Panier E-commerce -->
        <section>
          <CartDisplay />
        </section>
        
        <!-- Gestionnaire API (uniquement en développement) -->
        <section v-if="isDev" class="border-t pt-8">
          <div class="mb-6">
            <button 
              @click="toggleApiManager"
              class="flex items-center space-x-2 text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span>Gestionnaire API</span>
              <svg 
                :class="{ 'transform rotate-180': showApiManager }"
                class="w-5 h-5 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <p class="text-sm text-gray-500 mt-1">Interface pour tester les opérations API (POST, PUT, DELETE)</p>
          </div>
          
          <div v-show="showApiManager" class="transition-all duration-300">
            <CartManager />
          </div>
        </section>
      </div>

  </div>
</template>

<script>
import CartDisplay from '@/components/CartDisplay.vue';
import CartManager from '@/components/CartManager.vue';

export default {
  name: 'CartView',
  components: {
    CartDisplay,
    CartManager
  },
  data() {
    return {
      pageTitle: 'Gestion du panier',
      showApiManager: false
    };
  },
  methods: {
    toggleApiManager() {
      this.showApiManager = !this.showApiManager;
    }
  },
  computed: {
    isDev() {
      return import.meta.env.DEV;
    }
  }
};
</script>

<style scoped>
.cart-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
