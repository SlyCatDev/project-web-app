<template>
  <div class="product-detail">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <LoadingSpinner />
        <span class="ml-3 text-gray-600">Chargement du produit...</span>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <div class="text-red-600">
          <span class="font-semibold">Erreur :</span> {{ error }}
        </div>
        <router-link 
          to="/products" 
          class="inline-block mt-4 text-blue-600 hover:text-blue-800 underline"
        >
          ← Retour aux produits
        </router-link>
      </div>

      <!-- Product detail -->
      <div v-else-if="product" class="max-w-6xl mx-auto">
        <!-- Breadcrumb -->
        <nav class="mb-8">
          <ol class="flex items-center space-x-2 text-sm text-gray-600">
            <li><router-link to="/" class="hover:text-blue-600">Accueil</router-link></li>
            <li>/</li>
            <li><router-link to="/products" class="hover:text-blue-600">Produits</router-link></li>
            <li>/</li>
            <li class="text-gray-900">{{ product.title }}</li>
          </ol>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Product Image -->
          <div class="product-image-section">
            <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                :src="product.image" 
                :alt="product.title"
                class="w-full h-full object-contain"
                @error="handleImageError"
              />
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-info-section">
            <div class="mb-4">
              <span v-if="product.category" class="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full capitalize">
                {{ product.category }}
              </span>
            </div>
            
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.title }}</h1>
            
            <div class="flex items-center mb-6">
              <span class="text-3xl font-bold text-blue-600">${{ product.price.toFixed(2) }}</span>
              <div v-if="product.rating" class="ml-4 flex items-center">
                <div class="flex items-center">
                  <span class="text-yellow-400">★</span>
                  <span class="ml-1 text-sm text-gray-600">{{ product.rating.rate }}/5 ({{ product.rating.count }} avis)</span>
                </div>
              </div>
            </div>

            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
            </div>

            <!-- Add to Cart Section -->
            <div class="border-t pt-8">
              <div class="flex items-center space-x-4 mb-6">
                <label for="quantity" class="text-sm font-semibold text-gray-700">Quantité :</label>
                <select 
                  id="quantity"
                  v-model="selectedQuantity" 
                  class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>

              <div class="flex flex-col sm:flex-row gap-4">
                <button 
                  @click="addToCart"
                  :disabled="addingToCart"
                  class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <span v-if="addingToCart">Ajout en cours...</span>
                  <span v-else>Ajouter au panier</span>
                </button>
                
                <router-link 
                  to="/products"
                  class="flex-1 text-center border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors font-semibold"
                >
                  Continuer les achats
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product not found -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">Produit introuvable</h3>
        <p class="text-gray-500 mb-6">Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
        <router-link 
          to="/products" 
          class="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Voir tous les produits
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { productService } from '@/services';
import { useCartStore } from '@/stores/cart.js';
import { useNotifications } from '@/composables/useNotifications.js';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

export default {
  name: 'ProductDetailView',
  components: {
    LoadingSpinner,
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup() {
    const cartStore = useCartStore();
    const { showSuccess, showError } = useNotifications();
    
    return {
      cartStore,
      showSuccess,
      showError
    };
  },
  data() {
    return {
      product: null,
      loading: true,
      error: null,
      selectedQuantity: 1,
      addingToCart: false
    };
  },
  async created() {
    await this.loadProduct();
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.loadProduct();
      }
    }
  },
  methods: {    async loadProduct() {
      try {
        this.loading = true;
        this.error = null;
        this.product = await productService.getProduct(this.id);
      } catch (err) {
        console.error('Erreur lors du chargement du produit:', err);
        this.error = 'Impossible de charger les détails du produit';
      } finally {
        this.loading = false;
      }
    },

    async addToCart() {
      if (!this.product) return;
      
      try {
        this.addingToCart = true;
        const success = this.cartStore.addToCart(this.product, this.selectedQuantity);
        
        if (success) {
          this.showSuccess(`${this.product.title} ajouté au panier (x${this.selectedQuantity}) !`);
        } else {
          this.showError('Erreur lors de l\'ajout au panier');
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        this.showError('Erreur lors de l\'ajout au panier');
      } finally {
        this.addingToCart = false;
      }
    },

    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/400x400?text=Produit';
    }
  }
};
</script>

<style scoped>
.product-detail {
  min-height: 60vh;
}

.container {
  max-width: 1200px;
}

.product-image-section img {
  transition: transform 0.3s ease;
}

.product-image-section:hover img {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .product-detail .grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
