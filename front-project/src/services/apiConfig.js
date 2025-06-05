// Configuration utilitaire pour les services API
export const API_URL = import.meta.env.VITE_API_URL || 'https://fakestoreapi.com';

// Affichage de l'URL API en mode développement
if (import.meta.env.DEV) {
  console.log('🌐 API Config - URL configurée:', API_URL);
}

// Configuration globale pour les requêtes
export const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Fonction utilitaire pour gérer les erreurs HTTP
export const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  return response.json();
};

// Fonction utilitaire pour ajouter l'authentification aux headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    ...defaultOptions.headers,
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Fonction utilitaire pour créer des options de requête avec authentification
export const createAuthenticatedOptions = (method = 'GET', body = null) => {
  const options = {
    method,
    headers: getAuthHeaders()
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};
