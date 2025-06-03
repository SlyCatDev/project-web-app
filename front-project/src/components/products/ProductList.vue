<template>
  <div class="products-container">
    <h1>Catalogue de produits</h1>
    
    <!-- Filtres par catégorie -->
    <div class="categories-filter">
      <button @click="resetFilters">Tous les produits</button>
      <button 
        v-for="category in categories" 
        :key="category" 
        @click="filterByCategory(category)"
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
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add-to-cart="handleAddToCart"
      />
    </div>
  </div>
</template>

<script>
import { productService } from '@/services/api.js';
import ProductCard from '@/components/products/ProductCard.vue';
import { useCartStore } from '@/stores/cart.js';
import { useNotifications } from '@/composables/useNotifications.js';

export default {
  name: 'ProductList',
  components: {
    ProductCard
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
      error: null
    };
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
  padding: 20px;
}

.categories-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.categories-filter button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  text-transform: capitalize;
}

.categories-filter button:hover {
  background-color: #f0f0f0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 2rem;
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
    padding: 16px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  
  .categories-filter {
    justify-content: center;
  }
}
</style>