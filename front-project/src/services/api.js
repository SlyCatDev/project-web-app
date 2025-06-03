// Services pour Fake Store API
const API_URL = import.meta.env.VITE_API_URL || 'https://fakestoreapi.com';

// Affichage de l'URL API en mode développement
if (import.meta.env.DEV) {
  console.log('🌐 API URL configurée:', API_URL);
}

// Configuration globale pour les requêtes
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Fonction utilitaire pour gérer les erreurs
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  return response.json();
};

// Service pour les produits
export const productService = {
  // Récupérer tous les produits
  async getAllProducts(limit = null, sort = null) {
    try {
      let url = `${API_URL}/products`;
      const params = [];
      
      if (limit) params.push(`limit=${limit}`);
      if (sort) params.push(`sort=${sort}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      const response = await fetch(url, defaultOptions);
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  },
  
  // Récupérer un produit par son ID
  async getProduct(id) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, defaultOptions);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      throw error;
    }
  },
  
  // Récupérer les produits par catégorie
  async getProductsByCategory(category) {
    try {
      const response = await fetch(`${API_URL}/products/category/${category}`, defaultOptions);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Erreur lors de la récupération des produits de la catégorie ${category}:`, error);
      throw error;
    }
  },
  
  // Récupérer toutes les catégories
  async getCategories() {
    try {
      const response = await fetch(`${API_URL}/products/categories`, defaultOptions);
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  }
};

// Service pour le panier
export const cartService = {
  // Récupérer tous les paniers
  async getAllCarts() {
    try {
      const response = await fetch(`${API_URL}/carts`, defaultOptions);
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des paniers:', error);
      throw error;
    }
  },
  
  // Récupérer un panier par son ID
  async getCart(id) {
    try {
      const response = await fetch(`${API_URL}/carts/${id}`, defaultOptions);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Erreur lors de la récupération du panier ${id}:`, error);
      throw error;
    }
  },

  // Ajouter un produit au panier (POST)
  async addToCart(productId, quantity = 1, userId = 1) {
    try {
      const response = await fetch(`${API_URL}/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          date: new Date().toISOString().split('T')[0],
          products: [{ productId: productId, quantity: quantity }]
        })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      throw error;
    }
  },

  // Modifier un panier existant (PUT)
  async updateCart(cartId, products, userId = 1) {
    try {
      const response = await fetch(`${API_URL}/carts/${cartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          date: new Date().toISOString().split('T')[0],
          products: products
        })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Erreur lors de la modification du panier ${cartId}:`, error);
      throw error;
    }
  },

  // Supprimer un panier (DELETE)
  async deleteCart(cartId) {
    try {
      const response = await fetch(`${API_URL}/carts/${cartId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Erreur lors de la suppression du panier ${cartId}:`, error);
      throw error;
    }
  }
};

// Service pour les utilisateurs
export const userService = {
  // Récupérer tous les utilisateurs
  async getAllUsers() {
    try {
      const response = await fetch(`${API_URL}/users`, defaultOptions);
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },
  
  // Récupérer un utilisateur par son ID
  async getUser(id) {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, defaultOptions);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      throw error;
    }
  }
};

// Service d'authentification
export const authService = {
  // Connexion utilisateur
  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }
};