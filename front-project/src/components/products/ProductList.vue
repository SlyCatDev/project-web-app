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
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="product.image" :alt="product.title" class="product-image">
        <div class="product-info">
          <h3>{{ product.title }}</h3>
          <p class="product-category">{{ product.category }}</p>
          <div class="product-price">{{ product.price }} €</div>
          <div class="product-rating" v-if="product.rating">
            <span>{{ product.rating.rate }} ★</span>
            <span class="product-count">({{ product.rating.count }})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productService } from '@/services/api.js';

export default {
  name: 'ProductList',
  
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  padding: 10px;
  background-color: white;
}

.product-info {
  padding: 15px;
}

.product-info h3 {
  margin-top: 0;
  font-size: 16px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-category {
  color: #666;
  font-size: 14px;
  text-transform: capitalize;
  margin: 5px 0;
}

.product-price {
  font-weight: bold;
  font-size: 18px;
  margin: 10px 0;
}

.product-rating {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.product-count {
  margin-left: 5px;
  color: #666;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.error {
  color: #e74c3c;
}
</style>