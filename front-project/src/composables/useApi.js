import { ref, computed } from 'vue'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)
  const hasData = computed(() => data.value !== null)

  const executeRequest = async (apiCall) => {
    loading.value = true
    error.value = null
    data.value = null

    try {
      const result = await apiCall()
      data.value = result
      return result
    } catch (err) {
      error.value = err.message || 'Une erreur est survenue'
      console.error('Erreur API:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    loading.value = false
    error.value = null
    data.value = null
  }

  return {
    loading: isLoading,
    error: computed(() => error.value),
    data: computed(() => data.value),
    hasError,
    hasData,
    executeRequest,
    reset
  }
}

// Composable spécialisé pour les produits
export function useProducts() {
  const api = useApi()

  const fetchProducts = async (limit = null, sort = null) => {
    const { productService } = await import('@/services/api.js')
    return api.executeRequest(() => productService.getAllProducts(limit, sort))
  }

  const fetchProduct = async (id) => {
    const { productService } = await import('@/services/api.js')
    return api.executeRequest(() => productService.getProduct(id))
  }

  const fetchProductsByCategory = async (category) => {
    const { productService } = await import('@/services/api.js')
    return api.executeRequest(() => productService.getProductsByCategory(category))
  }

  const fetchCategories = async () => {
    const { productService } = await import('@/services/api.js')
    return api.executeRequest(() => productService.getCategories())
  }

  return {
    ...api,
    fetchProducts,
    fetchProduct,
    fetchProductsByCategory,
    fetchCategories
  }
}
