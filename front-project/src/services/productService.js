// Service pour les produits
import { API_URL, defaultOptions, handleResponse } from './apiConfig.js';

// Affichage de l'URL API en mode développement
if (import.meta.env.DEV) {
  console.log('🛍️ Product Service - API URL configurée:', API_URL);
}

// Fonction pour normaliser les produits (s'assurer que price est un nombre)
const normalizeProduct = (product) => {
  return {
    ...product,
    price: parseFloat(product.price) || 0
  };
};

export const productService = {
  // Récupérer tous les produits depuis l'API uniquement
  async getAllProducts(limit = null, sort = null) {
    try {
      let url = `${API_URL}/products`;
      const params = [];
      
      if (limit) params.push(`limit=${limit}`);
      if (sort) params.push(`sort=${sort}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      // Récupérer les produits de l'API
      const response = await fetch(url, defaultOptions);
      const apiProducts = await handleResponse(response);
      
      // Normaliser tous les produits pour s'assurer que les prix sont des nombres
      const normalizedApiProducts = apiProducts.map(normalizeProduct);
      
      console.log(`📦 Produits chargés: ${normalizedApiProducts.length} de l'API`);
      
      return normalizedApiProducts;
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
