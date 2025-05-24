<template>
  <div class="api-example">
    <h2>Exemple d'utilisation de l'API FakeStore</h2>
    
    <!-- État de chargement -->
    <div v-if="loading" class="loading">
      <p>Chargement des produits...</p>
    </div>
    
    <!-- Gestion des erreurs -->
    <div v-if="hasError" class="error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <h3>Erreur de connexion à l'API</h3>
      <p>{{ error }}</p>
      <button @click="retryLoadProducts" class="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Réessayer
      </button>
    </div>
    
    <!-- Affichage des données -->
    <div v-if="hasData && products" class="products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="product in products" :key="product.id" class="product-card border rounded-lg p-4 shadow-md">
        <img :src="product.image" :alt="product.title" class="w-full h-48 object-cover mb-4">
        <h3 class="font-bold text-lg mb-2">{{ product.title }}</h3>
        <p class="text-gray-600 text-sm mb-2">{{ product.category }}</p>
        <p class="text-green-600 font-bold">${{ product.price }}</p>
      </div>
    </div>
    
    <!-- Boutons d'action -->
    <div class="actions mt-6 space-x-4">
      <button @click="loadProducts" 
              :disabled="loading" 
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50">
        Charger tous les produits
      </button>
      
      <button @click="loadLimitedProducts" 
              :disabled="loading"
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50">
        Charger 5 produits
      </button>
      
      <button @click="loadCategories" 
              :disabled="loading"
              class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50">
        Charger les catégories
      </button>
    </div>
    
    <!-- Affichage des catégories -->
    <div v-if="categories && categories.length > 0" class="categories mt-6">
      <h3 class="text-xl font-bold mb-4">Catégories disponibles :</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="category in categories" 
              :key="category" 
              @click="loadProductsByCategory(category)"
              class="bg-gray-200 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-300">
          {{ category }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProducts } from '@/composables/useApi.js'

// Utilisation du composable
const { loading, error, hasError, hasData, fetchProducts, fetchCategories, fetchProductsByCategory } = useProducts()

// États locaux
const products = ref(null)
const categories = ref(null)

// Méthodes
const loadProducts = async () => {
  try {
    const result = await fetchProducts()
    products.value = result
    console.log('Produits chargés:', result)
  } catch (err) {
    console.error('Erreur lors du chargement des produits:', err)
  }
}

const loadLimitedProducts = async () => {
  try {
    const result = await fetchProducts(5, 'desc')
    products.value = result
    console.log('Produits limités chargés:', result)
  } catch (err) {
    console.error('Erreur lors du chargement des produits limités:', err)
  }
}

const loadCategories = async () => {
  try {
    const result = await fetchCategories()
    categories.value = result
    console.log('Catégories chargées:', result)
  } catch (err) {
    console.error('Erreur lors du chargement des catégories:', err)
  }
}

const loadProductsByCategory = async (category) => {
  try {
    const result = await fetchProductsByCategory(category)
    products.value = result
    console.log(`Produits de la catégorie ${category} chargés:`, result)
  } catch (err) {
    console.error(`Erreur lors du chargement des produits de la catégorie ${category}:`, err)
  }
}

const retryLoadProducts = () => {
  loadProducts()
}

// Chargement initial
onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>

<style scoped>
.loading {
  @apply text-center py-8 text-gray-600;
}

.error {
  @apply animate-pulse;
}

.product-card {
  @apply transition-transform hover:scale-105;
}

.categories span {
  @apply transition-colors;
}
</style>
