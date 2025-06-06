<template>
  <div class="product-detail">
    <div class="container mx-auto px-6 py-12">
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <LoadingSpinner />
        <span class="ml-4 text-gray-600">Chargement du produit...</span>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-10">
        <div class="text-red-600">
          <span class="font-semibold">Erreur :</span> {{ error }}
        </div>
        <router-link 
          to="/products" 
          class="inline-block mt-6 text-blue-600 hover:text-blue-800 underline"
        >
          ← Retour aux produits
        </router-link>
      </div>

      <!-- Product detail -->
      <div v-else-if="product" class="max-w-6xl mx-auto">
        <!-- Breadcrumb -->
        <div class="mb-12">
          <Breadcrumb :items="breadcrumbItems" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <!-- Product Image -->
          <div class="product-image-section">
            <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm">
              <img 
                :src="product.image" 
                :alt="product.title"
                class="w-full h-full object-contain product-detail-image"
                @error="handleImageError"
                @load="handleImageLoad"
              />
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-info-section space-y-8">
            <!-- Titre du produit -->
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.title }}</h1>
            </div>
            
            <!-- Prix -->
            <div class="py-4">
              <span class="text-4xl font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
            </div>

            <!-- Contrôles de quantité et bouton panier -->
            <div class="space-y-6">
              <div class="flex items-center space-x-6">
                <label for="quantity" class="text-base font-medium text-gray-700">Quantité</label>
                <div class="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    @click="decreaseQuantity"
                    :disabled="selectedQuantity <= 1"
                    class="px-4 py-3 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    −
                  </button>
                  <input 
                    id="quantity"
                    v-model="selectedQuantity" 
                    type="number"
                    min="1"
                    max="10"
                    class="w-20 text-center py-3 border-0 focus:outline-none"
                  />
                  <button 
                    @click="increaseQuantity"
                    :disabled="selectedQuantity >= 10"
                    class="px-4 py-3 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                @click="addToCart"
                :disabled="addingToCart"
                class="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-md"
              >
                <span v-if="addingToCart">Ajout en cours...</span>
                <span v-else>Ajouter au panier</span>
              </button>
            </div>

            <!-- Détails du produit -->
            <div class="border-t border-gray-200 pt-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Détails du produit</h3>
              
              <div class="space-y-4">
                <div class="flex justify-between py-3 border-b border-gray-100">
                  <span class="text-gray-600">Catégorie</span>
                  <span class="font-medium text-gray-900 capitalize">{{ product.category }}</span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="pt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <p class="text-gray-700 leading-relaxed text-base">{{ product.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Product not found -->
      <div v-else class="text-center py-20">
        <div class="text-gray-400 text-6xl mb-6">🔍</div>
        <h3 class="text-xl font-semibold text-gray-600 mb-4">Produit introuvable</h3>
        <p class="text-gray-500 mb-8">Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
        <router-link 
          to="/products" 
          class="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
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
import { formatPrice } from '@/utils/currency.js';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import Breadcrumb from '@/components/ui/Breadcrumb.vue';

export default {
  name: 'ProductDetailView',
  components: {
    LoadingSpinner,
    Breadcrumb,
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
  computed: {
    breadcrumbItems() {
      const items = [
        { text: 'Accueil', href: '/' },
        { text: 'Produits', href: '/products' }
      ];
      
      if (this.product) {
        items.push({ text: this.product.title });
      }
      
      return items;
    }
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
  methods: {    
    formatPrice(price) {
      return formatPrice(price);
    },

    async loadProduct() {
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

    increaseQuantity() {
      if (this.selectedQuantity < 10) {
        this.selectedQuantity++;
      }
    },

    decreaseQuantity() {
      if (this.selectedQuantity > 1) {
        this.selectedQuantity--;
      }
    },

    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/400x400?text=Produit';
      event.target.classList.add('loaded');
    },

    handleImageLoad(event) {
      event.target.classList.add('loaded');
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
  transition: transform 0.3s ease, opacity 0.4s ease;
  opacity: 0;
  transform: scale(0.9);
}

.product-image-section img.loaded {
  opacity: 1;
  transform: scale(1);
}

.product-image-section:hover img.loaded {
  transform: scale(1.05);
}

.product-detail-image {
  animation: fadeInScale 0.5s ease forwards;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (max-width: 768px) {
  .product-detail .grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .product-detail .container {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  
  .product-info-section {
    padding-top: 1rem;
  }
}
</style>
