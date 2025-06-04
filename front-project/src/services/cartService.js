// Service pour le panier
import { API_URL, handleResponse } from './apiConfig.js';

// Affichage de l'URL API en mode développement
if (import.meta.env.DEV) {
  console.log('🛒 Cart Service - API URL configurée:', API_URL);
}

export const cartService = {
  // Récupérer tous les paniers
  async getAllCarts() {
    try {
      const response = await fetch(`${API_URL}/carts`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des paniers:', error);
      throw error;
    }
  },
  
  // Récupérer un panier par son ID
  async getCart(id) {
    try {
      const response = await fetch(`${API_URL}/carts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
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
