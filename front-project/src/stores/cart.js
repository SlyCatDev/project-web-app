import { defineStore } from 'pinia'

const CART_STORAGE_KEY = 'ecommerce_cart'

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      return Array.isArray(parsedCart) ? parsedCart : []
    }
    return []
  } catch (error) {
    console.error('Erreur lors du chargement du panier depuis localStorage:', error)
    return []
  }
}

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du panier dans localStorage:', error)
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: loadCartFromStorage(),
    loading: false,
    error: null
  }),

  getters: {
    // Nombre total d'articles dans le panier
    itemCount: (state) => 
      state.items.reduce((total, item) => total + item.quantity, 0),
    
    // Montant total du panier
    totalAmount: (state) => 
      state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    
    // Vérifier si le panier est vide
    isEmpty: (state) => state.items.length === 0,
    
    // Obtenir un article spécifique par ID
    getItemById: (state) => (productId) => 
      state.items.find(item => item.id === productId),
    
    // Vérifier si un produit est dans le panier
    isInCart: (state) => (productId) => 
      state.items.some(item => item.id === productId)
  },

  actions: {
    addToCart(product, quantity = 1) {
      try {
        this.error = null
        
        // Vérifier si le produit existe déjà dans le panier
        const existingItemIndex = this.items.findIndex(item => item.id === product.id)
        
        if (existingItemIndex > -1) {
          // Mettre à jour la quantité si le produit existe déjà
          this.items[existingItemIndex].quantity += quantity
        } else {
          // Ajouter un nouveau produit au panier
          const cartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity,
            // Propriétés optionnelles
            category: product.category || '',
            description: product.description || ''
          }
          this.items.push(cartItem)
        }
        
        saveCartToStorage(this.items)
        return true
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error)
        this.error = 'Erreur lors de l\'ajout au panier'
        return false
      }
    },

    // Mettre à jour la quantité d'un produit
    updateQuantity(productId, newQuantity) {
      try {
        this.error = null
        
        if (newQuantity <= 0) {
          this.removeFromCart(productId)
          return true
        }
        
        const itemIndex = this.items.findIndex(item => item.id === productId)
        if (itemIndex > -1) {
          this.items[itemIndex].quantity = newQuantity
          saveCartToStorage(this.items)
          return true
        }
        return false
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la quantité:', error)
        this.error = 'Erreur lors de la mise à jour de la quantité'
        return false
      }
    },

    // Supprimer un produit du panier
    removeFromCart(productId) {
      try {
        this.error = null
        const initialLength = this.items.length
        this.items = this.items.filter(item => item.id !== productId)
        
        if (this.items.length < initialLength) {
          saveCartToStorage(this.items)
          return true
        }
        return false
      } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error)
        this.error = 'Erreur lors de la suppression du produit'
        return false
      }
    },

    // Vider complètement le panier
    clearCart() {
      try {
        this.error = null
        this.items = []
        saveCartToStorage(this.items)
        return true
      } catch (error) {
        console.error('Erreur lors du vidage du panier:', error)
        this.error = 'Erreur lors du vidage du panier'
        return false
      }
    },

    // Méthode pour synchroniser avec l'API (optionnelle)
    async syncWithAPI() {
      try {
        this.loading = true
        this.error = null
        
        // TODO: Implémenter la synchronisation avec l'API si nécessaire
        // const { cartService } = await import('@/services/api.js')
        // await cartService.syncCart(this.items)
        
        return true
      } catch (error) {
        console.error('Erreur lors de la synchronisation avec l\'API:', error)
        this.error = 'Erreur lors de la synchronisation'
        return false
      } finally {
        this.loading = false
      }
    },

    // Effacer les erreurs
    clearError() {
      this.error = null
    }
  }
})
