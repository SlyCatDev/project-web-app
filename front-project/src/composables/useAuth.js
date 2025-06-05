import { ref, computed } from 'vue'
import { authService } from '@/services'

// État global de l'authentification
const authToken = ref(localStorage.getItem('authToken'))
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

export function useAuth() {
  // Savoir si l'utilisateur est connecté
  const isAuthenticated = computed(() => !!authToken.value)
    // Fonction de connexion
  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password)
      
      if (response.token) {
        // Stocker le token et les informations utilisateur
        authToken.value = response.token
        user.value = {
          id: response.user?.id,
          username: response.user?.username || username,
          email: response.user?.email,
          firstName: response.user?.name?.firstname,
          lastName: response.user?.name?.lastname,
          loginTime: new Date().toISOString(),
          isLocalUser: response.token.startsWith('local_token_')
        }

        // Persister dans localStorage
        localStorage.setItem('authToken', response.token)
        localStorage.setItem('user', JSON.stringify(user.value))
        
        console.log('✅ Connexion réussie:', user.value)
        return { success: true, user: user.value }
      }
      
      throw new Error('Token non reçu')
    } catch (error) {
      console.error('❌ Erreur de connexion:', error)
      throw error
    }
  }

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      
      console.log('✅ Inscription réussie:', response)
      return { success: true, user: response }
    } catch (error) {
      console.error('❌ Erreur d\'inscription:', error)
      throw error
    }
  }
  
  // Fonction de déconnexion
  const logout = () => {
    authToken.value = null
    user.value = null
    
    // Supprimer du localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    
    console.log('👋 Déconnexion réussie')
  }
  
  // Fonction pour vérifier si le token est valide
  const checkAuth = () => {
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      authToken.value = storedToken
      user.value = JSON.parse(storedUser)
      return true
    }
    
    return false
  }
  
  // Fonction pour obtenir les headers d'authentification
  const getAuthHeaders = () => {
    if (!authToken.value) {
      return {}
    }
    
    return {
      'Authorization': `Bearer ${authToken.value}`
    }
  }
  
  // Initialisation : vérifier si l'utilisateur est déjà connecté
  checkAuth()
    return {
    // État
    isAuthenticated,
    user: computed(() => user.value),
    token: computed(() => authToken.value),
    
    // Méthodes
    login,
    logout,
    checkAuth,
    getAuthHeaders,
    register,
    
    // Méthodes utilitaires pour les utilisateurs locaux
    getLocalUsers: () => authService.getLocalUsers()
  }
}