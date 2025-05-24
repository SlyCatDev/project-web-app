<template>
  <div class="api-health-check p-4 border rounded-lg">
    <h3 class="text-lg font-semibold mb-4 flex items-center">
      <span class="mr-2">🔍</span>
      État de l'API FakeStore
    </h3>
    
    <div class="space-y-3">
      <!-- Status général -->
      <div class="flex items-center justify-between p-3 rounded" 
           :class="statusClasses">
        <span class="font-medium">Connexion API</span>
        <div class="flex items-center">
          <span class="mr-2">{{ statusText }}</span>
          <div class="w-3 h-3 rounded-full" :class="statusIndicator"></div>
        </div>
      </div>
      
      <!-- Détails des tests -->
      <div v-if="testResults.length > 0" class="space-y-2">
        <h4 class="font-medium text-gray-700">Tests de connectivité :</h4>
        <div v-for="test in testResults" :key="test.name" 
             class="flex items-center justify-between p-2 rounded bg-gray-50">
          <span class="text-sm">{{ test.name }}</span>
          <span class="text-xs px-2 py-1 rounded" 
                :class="test.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ test.success ? '✅ OK' : '❌ Erreur' }}
          </span>
        </div>
      </div>
      
      <!-- Temps de réponse -->
      <div v-if="responseTime" class="text-sm text-gray-600">
        Temps de réponse : {{ responseTime }}ms
      </div>
      
      <!-- Bouton de test -->
      <button @click="runHealthCheck" 
              :disabled="isLoading"
              class="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50">
        {{ isLoading ? 'Test en cours...' : 'Tester la connexion' }}
      </button>
      
      <!-- Erreur détaillée -->
      <div v-if="error" class="mt-3 p-3 bg-red-50 border border-red-200 rounded">
        <h5 class="font-medium text-red-800 mb-1">Erreur détaillée :</h5>
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { productService } from '@/services/api.js'

// États réactifs
const isLoading = ref(false)
const apiStatus = ref('unknown') // 'ok', 'error', 'unknown'
const testResults = ref([])
const responseTime = ref(null)
const error = ref(null)

// Computed properties
const statusClasses = computed(() => {
  switch (apiStatus.value) {
    case 'ok':
      return 'bg-green-100 border border-green-200'
    case 'error':
      return 'bg-red-100 border border-red-200'
    default:
      return 'bg-gray-100 border border-gray-200'
  }
})

const statusIndicator = computed(() => {
  switch (apiStatus.value) {
    case 'ok':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    default:
      return 'bg-gray-400'
  }
})

const statusText = computed(() => {
  switch (apiStatus.value) {
    case 'ok':
      return 'Connecté'
    case 'error':
      return 'Erreur'
    default:
      return 'Non testé'
  }
})

// Méthodes
const runHealthCheck = async () => {
  isLoading.value = true
  error.value = null
  testResults.value = []
  
  const startTime = Date.now()
  
  try {
    // Test 1: Récupération des produits
    await testEndpoint('Produits', () => productService.getAllProducts(1))
    
    // Test 2: Récupération des catégories
    await testEndpoint('Catégories', () => productService.getCategories())
    
    // Test 3: Récupération d'un produit spécifique
    await testEndpoint('Produit spécifique', () => productService.getProduct(1))
    
    // Si tous les tests passent
    apiStatus.value = 'ok'
    responseTime.value = Date.now() - startTime
    
  } catch (err) {
    apiStatus.value = 'error'
    error.value = err.message
    console.error('Erreur lors du test de l\'API:', err)
  } finally {
    isLoading.value = false
  }
}

const testEndpoint = async (name, testFunction) => {
  try {
    await testFunction()
    testResults.value.push({ name, success: true })
  } catch (err) {
    testResults.value.push({ name, success: false, error: err.message })
    throw err
  }
}

// Test automatique au montage du composant
onMounted(() => {
  runHealthCheck()
})
</script>

<style scoped>
.api-health-check {
  max-width: 500px;
}
</style>
