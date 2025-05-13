<template>
  <section class="trending-products">
    <div class="container trending-container">
      <h2 class="trending-title">{{ title }}</h2>
      
      <div v-if="loading" class="products-loading">
        <div class="product-skeleton" v-for="index in limit" :key="index"></div>
      </div>
      
      <div v-else-if="error" class="products-error">
        {{ error }}
      </div>
      
      <div v-else class="products-grid">
        <ProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product"
          @add-to-cart="handleAddToCart"
        />
      </div>
      
      <div class="trending-controls">
        <button class="control-button prev-button" aria-label="Previous products">
          <span class="control-icon">&lt;</span>
        </button>
        <button class="control-button next-button" aria-label="Next products">
          <span class="control-icon">&gt;</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import ProductCard from '@/components/products/ProductCard.vue';
import { productService } from '@/services/api.js';

export default {
  name: 'TrendingProducts',
  components: {
    ProductCard
  },
  props: {
    title: {
      type: String,
      default: 'Produits tendance'
    },
    limit: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      products: [],
      loading: true,
      error: null
    };
  },
  methods: {
    async fetchProducts() {
      try {
        this.loading = true;
        this.products = await productService.getAllProducts(this.limit);
        this.loading = false;
      } catch (err) {
        this.error = "Impossible de charger les produits tendance";
        this.loading = false;
        console.error(err);
      }
    },
    handleAddToCart(product) {
      this.$emit('add-to-cart', product);
    }
  },
  mounted() {
    this.fetchProducts();
  }
};
</script>

<style scoped>
.trending-products {
  padding: 2rem 0 4rem;
}

.trending-container {
  position: relative;
}

.trending-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 2rem;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.products-loading {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.product-skeleton {
  height: 350px;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  animation: pulse 1.5s infinite;
}

.products-error {
  text-align: center;
  color: #ef4444;
  padding: 2rem;
  background-color: #fee2e2;
  border-radius: 0.5rem;
}

.trending-controls {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;
}

.control-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-button:hover {
  background-color: var(--primary-color);
  color: white;
}

.control-icon {
  font-size: 1rem;
  font-weight: bold;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

/* Styles pour tablette */
@media (min-width: 640px) {
  .products-grid,
  .products-loading {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Styles pour desktop */
@media (min-width: 1024px) {
  .trending-products {
    padding: 4rem 0 6rem;
  }
  
  .trending-title {
    font-size: 2rem;
    margin-bottom: 3rem;
  }
  
  .products-grid,
  .products-loading {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
  
  .product-skeleton {
    height: 400px;
  }
}

/* Styles pour grand écran */
@media (min-width: 1440px) {
  .products-grid,
  .products-loading {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>