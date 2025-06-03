<template>
  <div class="product-card" :class="{ 'product-card--loading': loading }">
    <div class="product-image-container">
      <div class="product-image-wrapper">
        <img
          v-if="product.image && !loading"
          :src="product.image"
          :alt="product.title"
          class="product-image"
        />
        <div v-else class="product-image-placeholder"></div>
      </div>
      <button class="cart-button" @click="addToCart" aria-label="Add to cart">
        <span class="cart-icon">+</span>
      </button>
    </div>
    
    <div class="product-info">
      <h3 class="product-title">
        <span>{{ truncatedTitle }}</span>
      </h3>
      <div class="product-category" v-if="product.category">{{ product.category }}</div>
      <div class="product-price">{{ priceFormatted }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
      validator: (product) => {
        return product.id !== undefined && 
               product.title !== undefined && 
               product.price !== undefined;
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    priceFormatted() {
      return `$${this.product.price.toFixed(2)}`;
    },
    productLink() {
      return `/products/${this.product.id}`;
    },
    truncatedTitle() {
      return this.product.title.length > 50 
        ? this.product.title.substring(0, 47) + '...'
        : this.product.title;
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.product);
    }
  }
};
</script>

<style scoped>
.product-card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
}

.product-image-container {
  position: relative;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  overflow: hidden;
  background-color: #f9fafb;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1rem;
  transition: transform 0.6s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #e5e7eb;
}

.cart-button {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease;
  z-index: 2;
}

.product-card:hover .cart-button {
  opacity: 1;
  transform: translateY(0);
}

.cart-button:hover {
  background-color: #2563eb;
}

.cart-icon {
  font-size: 1.25rem;
  font-weight: bold;
}

.product-info {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.product-title a {
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

.product-title a:hover {
  color: var(--primary-color);
}

.product-category {
  color: var(--text-light);
  font-size: 0.875rem;
  text-transform: capitalize;
  margin-bottom: 0.5rem;
}

.product-price {
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  margin-top: auto;
}

/* Loading state */
.product-card--loading .product-title,
.product-card--loading .product-price,
.product-card--loading .product-category,
.product-card--loading {
  color: transparent;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

/* Styles pour desktop */
@media (min-width: 1024px) {
  .product-title {
    font-size: 1.125rem;
  }

  .product-price {
    font-size: 1.25rem;
  }
  
  .cart-button {
    width: 42px;
    height: 42px;
  }
}
</style>