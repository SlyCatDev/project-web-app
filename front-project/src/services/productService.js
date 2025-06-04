// Service pour les produits
import { API_URL, defaultOptions, handleResponse } from './apiConfig.js';

// Affichage de l'URL API en mode développement
if (import.meta.env.DEV) {
  console.log('🛍️ Product Service - API URL configurée:', API_URL);
}

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
