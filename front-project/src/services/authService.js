// Service d'authentification et gestion des utilisateurs
import { API_URL, defaultOptions, handleResponse } from './apiConfig.js';

// Affichage de l'URL API en mode développement
if (import.meta.env.DEV) {
  console.log('🔐 Auth Service - API URL configurée:', API_URL);
}

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
  // Vérifier si un utilisateur existe localement
  _getLocalUser(username, password) {
    try {
      const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      return localUsers.find(user => 
        user.username === username && user.password === password
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs locaux:', error);
      return null;
    }
  },

  // Connexion utilisateur (vérification locale puis API)
  async login(username, password) {
    try {
      // D'abord, vérifier si l'utilisateur existe localement
      const localUser = this._getLocalUser(username, password);
      if (localUser) {
        console.log('✅ Connexion avec utilisateur local:', localUser.username);
        // Simuler une réponse d'API pour les utilisateurs locaux
        return {
          token: `local_token_${Date.now()}_${localUser.id}`,
          user: {
            id: localUser.id,
            username: localUser.username,
            email: localUser.email,
            name: {
              firstname: localUser.firstName,
              lastname: localUser.lastName
            }
          }
        };
      }

      // Sinon, essayer avec l'API FakeStore
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
  },

  // Déconnexion utilisateur
  logout() {
    try {
      // Supprimer le token du localStorage si présent
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    try {
      const token = localStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      console.error('Erreur lors de la vérification d\'authentification:', error);
      return false;
    }
  },

  // Récupérer les informations de l'utilisateur connecté
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur courant:', error);
      return null;
    }
  },  // Inscription utilisateur (stockage local + simulation API)
  async register(userData) {
    try {
      // Vérifier si l'utilisateur existe déjà localement
      const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const existingUser = localUsers.find(user => 
        user.username === userData.username || user.email === userData.email
      );
      
      if (existingUser) {
        throw new Error('Nom d\'utilisateur ou email déjà utilisé');
      }

      // Créer un nouvel utilisateur local
      const newUser = {
        id: Date.now(), // ID unique basé sur le timestamp
        email: userData.email,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '', // Ajouter le numéro de téléphone
        password: userData.password, // Dans un vrai projet, on hasherait le mot de passe
        createdAt: new Date().toISOString()
      };

      // Ajouter l'utilisateur à la liste locale
      localUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(localUsers));

      console.log('✅ Utilisateur enregistré localement:', newUser.username);

      // Simuler un appel API pour maintenir la compatibilité
      try {
        const response = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email: userData.email,
            username: userData.username,
            password: userData.password,
            name: {
              firstname: userData.firstName,
              lastname: userData.lastName
            },
            phone: userData.phone || '' 
          })
        });
        
        await handleResponse(response);
      } catch (apiError) {
        console.warn('⚠️ API FakeStore non disponible, mais utilisateur sauvegardé localement:', apiError.message);
      }
      
      // Retourner les données de l'utilisateur créé (sans le mot de passe)
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  // Obtenir la liste des utilisateurs enregistrés localement (pour debug)
  getLocalUsers() {
    try {
      return JSON.parse(localStorage.getItem('registeredUsers') || '[]')
        .map(user => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs locaux:', error);
      return [];
    }
  }
};
