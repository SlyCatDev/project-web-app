// Services pour Fake Store API
const API_URL = 'https://fakestoreapi.com';

// Service pour les produits
export const productService = {
  // Récupérer tous les produits
  getAllProducts(limit = null, sort = null) {
    let url = `${API_URL}/products`;
    const params = [];
    
    if (limit) params.push(`limit=${limit}`);
    if (sort) params.push(`sort=${sort}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return fetch(url).then(res => res.json());
  },
  
  // Récupérer un produit par son ID
  getProduct(id) {
    return fetch(`${API_URL}/products/${id}`).then(res => res.json());
  },
  
  // Récupérer les produits par catégorie
  getProductsByCategory(category) {
    return fetch(`${API_URL}/products/category/${category}`).then(res => res.json());
  },
  
  // Récupérer toutes les catégories
  getCategories() {
    return fetch(`${API_URL}/products/categories`).then(res => res.json());
  }
};

// Service pour le panier
export const cartService = {
  // Récupérer tous les paniers
  getAllCarts() {
    return fetch(`${API_URL}/carts`).then(res => res.json());
  },
  
  // Récupérer un panier par son ID
  getCart(id) {
    return fetch(`${API_URL}/carts/${id}`).then(res => res.json());
  }
};

// Service pour les utilisateurs
export const userService = {
  // Récupérer tous les utilisateurs
  getAllUsers() {
    return fetch(`${API_URL}/users`).then(res => res.json());
  },
  
  // Récupérer un utilisateur par son ID
  getUser(id) {
    return fetch(`${API_URL}/users/${id}`).then(res => res.json());
  }
};

// Service d'authentification
export const authService = {
  // Connexion utilisateur
  login(username, password) {
    return fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => res.json());
  }
};