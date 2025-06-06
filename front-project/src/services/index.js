/**
 * Index des services - Point d'entrée unifié
 * Facilite l'importation des services dans l'application
 */

// Export des services principaux
export { productService } from './productService.js';
export { cartService } from './cartService.js';
export { authService, userService } from './authService.js';
export { paymentService } from './paymentService.js';

// Export de la configuration pour les cas avancés
export { API_URL, defaultOptions, handleResponse, getAuthHeaders, createAuthenticatedOptions } from './apiConfig.js';
