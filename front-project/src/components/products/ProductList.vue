<template>
    
    <div class="products-container">
      <PageTitle :pagetitle="pageTitle" />
      
      <!-- Filtres par catégorie -->
      <div class="categories-filter">
      <button 
        @click="resetFilters"
        class="filter-btn filter-btn-primary"
      >
        Tous les produits
      </button>
      <button 
        v-for="category in categories" 
        :key="category" 
        @click="filterByCategory(category)"
        class="filter-btn filter-btn-secondary"
      >
        {{ category }}
      </button>
    </div>
    
    <!-- Affichage de l'état du chargement -->
    <div v-if="loading" class="loading">
      Chargement des produits...
    </div>
    
    <!-- Affichage de l'erreur -->
    <div v-if="error" class="error">
      {{ error }}
    </div>
    
    <!-- Liste des produits -->
    <div v-if="!loading && !error" class="products-grid">
      <transition-group 
        name="product" 
        tag="div" 
        class="products-grid-container"
        appear
      >
        <ProductCard
          v-for="(product, index) in products"
          :key="product.id"
          :product="product"
          :style="{ '--delay': index * 0.1 + 's' }"
          @add-to-cart="handleAddToCart"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { productService } from '@/services';
import ProductCard from '@/components/products/ProductCard.vue';
import PageTitle from '@/components/ui/PageTitle.vue';
import { useCartStore } from '@/stores/cart.js';
import { useNotifications } from '@/composables/useNotifications.js';

export default {
  name: 'ProductList',
  components: {
    ProductCard,
    PageTitle
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
      products: [],
      categories: [],
      loading: true,
      error: null,
      selectedCategory: null
    };
  },
  
  computed: {
    pageTitle() {
      if (this.selectedCategory) {
        return `Produits - ${this.selectedCategory}`;
      }
      return 'Liste des produits';
    }
  },
  
  methods: {
    // Charger tous les produits
    async loadProducts() {
      try {
        this.loading = true;
        this.products = await productService.getAllProducts();
        this.loading = false;
      } catch (err) {
        this.error = "Erreur lors du chargement des produits";
        this.loading = false;
        console.error(err);
      }
    },
    
    // Charger toutes les catégories
    async loadCategories() {
      try {
        this.categories = await productService.getCategories();
      } catch (err) {
        console.error("Erreur lors du chargement des catégories:", err);
      }
    },
    
    // Filtrer les produits par catégorie
    async filterByCategory(category) {
      try {
        this.loading = true;
        this.selectedCategory = category;
        this.products = await productService.getProductsByCategory(category);
        this.loading = false;
      } catch (err) {
        this.error = "Erreur lors du filtrage des produits";
        this.loading = false;
        console.error(err);
      }
    },
    
    // Charger tous les produits sans filtre
    resetFilters() {
      this.selectedCategory = null;
      this.loadProducts();
    },
    
    // Gérer l'ajout au panier
    handleAddToCart(product) {
      const success = this.cartStore.addToCart(product, 1);
      
      if (success) {
        this.showSuccess(`${product.title} ajouté au panier !`);
      } else {
        this.showError('Erreur lors de l\'ajout au panier');
      }
    }
  },
  
  mounted() {
    this.loadProducts();
    this.loadCategories();
  }
};
</script>

<style scoped>
.products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.categories-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
  padding: 20px;
  background-color: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  text-transform: capitalize;
  transition: all 0.3s ease;
  min-height: 44px;
}

.filter-btn-primary {
  background-color: #3b82f6;
  color: white;
  border-color: 1px solid #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.filter-btn-primary:hover {
  background: linear-gradient(135deg, #1e40af, #1e3a8a);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.filter-btn-secondary {
  background-color: white;
  color: #374151;
  border-color: #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-btn-secondary:hover {
  background-color: #f3f4f6;
  border-color: #3b82f6;
  color: #3b82f6;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.filter-btn-secondary:active {
  background-color: #3b82f6;
  color: white;
  border-color: #1e40af;
}

.icon {
  font-size: 16px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 2rem;
}

.products-grid-container {
  display: contents;
}

/* Animation d'apparition des produits */
.product-enter-active {
  transition: all 0.5s ease;
  transition-delay: var(--delay);
}

.product-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.product-move {
  transition: transform 0.3s ease;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #dc2626;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .products-container {
    padding: 0 16px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  
  .categories-filter {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    gap: 8px;
  }
  
  .filter-btn {
    justify-content: center;
  }
}
</style>