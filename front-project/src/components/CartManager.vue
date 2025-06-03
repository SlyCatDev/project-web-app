<template>  <div class="cart-manager bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Gestionnaire de Panier API</h2>
    
    <!-- Sélecteur d'opération -->    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Choisir une opération :
      </label>
      <select 
        v-model="selectedOperation" 
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @change="resetForm"
      >
        <option value="add">Ajouter un produit au panier</option>
        <option value="update"> Modifier le panier</option>
        <option value="delete"> Supprimer le panier</option>
        <option value="get"> Consulter le panier</option>
      </select>
    </div>

    <!-- Formulaire pour ajouter un produit -->
    <div v-if="selectedOperation === 'add'" class="mb-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">Ajouter un produit au panier</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ID du produit :</label>
          <input 
            v-model.number="formData.productId" 
            type="number" 
            min="1"
            placeholder="Ex: 1"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Quantité :</label>
          <input 
            v-model.number="formData.quantity" 
            type="number" 
            min="1"
            placeholder="Ex: 2"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Formulaire pour modifier un panier -->
    <div v-if="selectedOperation === 'update'" class="mb-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">Modifier un panier existant</h3>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">ID du panier :</label>
        <input 
          v-model.number="formData.cartId" 
          type="number" 
          min="1"
          placeholder="Ex: 1"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Produits dans le panier :</label>
        <div v-for="(product, index) in formData.products" :key="index" class="flex gap-2 mb-2">
          <input 
            v-model.number="product.productId" 
            type="number" 
            placeholder="ID produit"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            v-model.number="product.quantity" 
            type="number" 
            placeholder="Quantité"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            @click="removeProduct(index)"
            class="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            ✕
          </button>
        </div>
        <button 
          @click="addProduct"
          class="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          + Ajouter un produit
        </button>
      </div>
    </div>

    <!-- Formulaire pour supprimer/consulter un panier -->
    <div v-if="selectedOperation === 'delete' || selectedOperation === 'get'" class="mb-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">
        {{ selectedOperation === 'delete' ? 'Supprimer un panier' : 'Consulter un panier' }}
      </h3>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">ID du panier :</label>
        <input 
          v-model.number="formData.cartId" 
          type="number" 
          min="1"
          placeholder="Ex: 1"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Bouton d'action -->
    <div class="mb-6">
      <button 
        @click="executeOperation"
        :disabled="loading || !isFormValid"
        class="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Traitement...
        </span>
        <span v-else>
          {{ getButtonText() }}
        </span>
      </button>
    </div>

    <!-- Affichage des erreurs -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
      <div class="flex">
        <div class="text-red-600">
          <span class="font-semibold">Erreur :</span> {{ error }}
        </div>
      </div>
    </div>

    <!-- Affichage des résultats -->
    <div v-if="data" class="bg-green-50 border border-green-200 rounded-md p-4">
      <h4 class="text-lg font-semibold text-green-800 mb-2">✅ Résultat :</h4>
      <pre class="bg-white p-3 rounded border text-sm overflow-x-auto">{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import { useCart } from '@/composables/useApi.js';

export default {
  name: 'CartManager',
  setup() {
    return useCart();
  },
  data() {
    return {
      selectedOperation: 'add',
      formData: {
        productId: null,
        quantity: 1,
        cartId: null,
        products: [{ productId: null, quantity: 1 }]
      }
    };
  },
  computed: {
    isFormValid() {
      switch (this.selectedOperation) {
        case 'add':
          return this.formData.productId && this.formData.quantity > 0;
        case 'update':
          return this.formData.cartId && this.formData.products.every(p => p.productId && p.quantity > 0);
        case 'delete':
        case 'get':
          return this.formData.cartId;
        default:
          return false;
      }
    }
  },
  methods: {
    resetForm() {
      this.formData = {
        productId: null,
        quantity: 1,
        cartId: null,
        products: [{ productId: null, quantity: 1 }]
      };
      this.reset();
    },

    addProduct() {
      this.formData.products.push({ productId: null, quantity: 1 });
    },

    removeProduct(index) {
      if (this.formData.products.length > 1) {
        this.formData.products.splice(index, 1);
      }
    },

    getButtonText() {
      const texts = {
        add: '📥 Ajouter au panier',
        update: '✏️ Modifier le panier',
        delete: '🗑️ Supprimer le panier',
        get: '👁️ Consulter le panier'
      };
      return texts[this.selectedOperation];
    },

    async executeOperation() {
      try {
        this.reset();
        
        switch (this.selectedOperation) {
          case 'add':
            await this.addToCart(this.formData.productId, this.formData.quantity);
            break;
          case 'update':
            await this.updateCart(this.formData.cartId, this.formData.products);
            break;
          case 'delete':
            await this.deleteCart(this.formData.cartId);
            break;
          case 'get':
            await this.fetchCart(this.formData.cartId);
            break;
        }
      } catch (error) {
        console.error('Erreur lors de l\'opération:', error);
      }
    }
  }
};
</script>

<style scoped>
.cart-manager {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Animation pour le spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
