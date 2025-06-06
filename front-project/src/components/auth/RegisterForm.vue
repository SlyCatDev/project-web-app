<template>
  <!-- ====== Register Section Start -->
  <section class="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg w-full">
      <div class="relative overflow-hidden rounded-2xl bg-white py-16 px-8 text-center shadow-xl border border-gray-200 sm:px-12 md:px-16">
        <!-- Logo Section -->
        <div class="mb-12">
          <a href="javascript:void(0)" class="mx-auto inline-block max-w-[160px]">
            <img src="@/assets/logo.svg" alt="logo" class="w-full h-auto" />
          </a>
        </div>        
        
        <!-- Section d'aide en mode développement -->
        <div v-if="isDev" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
          <div class="flex items-center mb-2">
            <span class="text-green-600 mr-2">✅</span>
            <span class="font-medium text-green-800">Système de persistance local</span>
          </div>
          <div class="text-green-700 space-y-2">
            <p class="text-xs"><strong>Nouveau :</strong> Les utilisateurs enregistrés sont sauvegardés localement !</p>
            <p class="text-xs">Vous pouvez maintenant vous connecter avec vos propres identifiants après inscription.</p>
            <div class="bg-green-100 p-2 rounded text-xs">
              <p><strong>Identifiants de test FakeStore API :</strong></p>
              <p>Username: mor_2314 | Password: 83r5^_</p>
            </div>
            <button 
              type="button"
              @click="fillTestCredentials"
              class="mt-2 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded text-xs transition-colors"
            >
              Remplir avec données de test
            </button>
          </div>
        </div>

        <!-- Form Section -->
        <form @submit.prevent="handleSubmit" class="space-y-6">          
          <!-- Email -->
          <div>
            <input
              v-model="formData.email"
              type="email"
              placeholder="Adresse email"
              required
              :disabled="isLoading"
              class="w-full px-4 py-4 text-base bg-white border border-gray-300 rounded-lg outline-none text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Username -->
          <div>
            <input
              v-model="formData.username"
              type="text"
              placeholder="Nom d'utilisateur"
              required
              :disabled="isLoading"
              class="w-full px-4 py-4 text-base bg-white border border-gray-300 rounded-lg outline-none text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': errors.username }"
            />
            <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
          </div>

          <!-- Prénom -->
          <div>
            <input
              v-model="formData.firstName"
              type="text"
              placeholder="Prénom"
              required
              :disabled="isLoading"
              class="w-full px-4 py-4 text-base bg-white border border-gray-300 rounded-lg outline-none text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': errors.firstName }"
            />
            <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
          </div>

          <!-- Nom -->
          <div>
            <input
              v-model="formData.lastName"
              type="text"
              placeholder="Nom de famille"
              required
              :disabled="isLoading"
              class="w-full px-4 py-4 text-base bg-white border border-gray-300 rounded-lg outline-none text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': errors.lastName }"
            />
            <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
          </div>

          <!-- Numéro de téléphone -->
          <div>
            <input
              v-model="formData.phone"
              type="tel"
              placeholder="Numéro de téléphone (optionnel)"
              :disabled="isLoading"
              class="w-full px-4 py-4 text-base bg-white border border-gray-300 rounded-lg outline-none text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': errors.phone }"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
          </div>

          <!-- Mot de passe -->
          <div>
            <input
              v-model="formData.password"
              type="password"
              placeholder="Mot de passe"
              required
              :disabled="isLoading"
              class="w-full px-4 py-4 text-base bg-white border border-gray-300 rounded-lg outline-none text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': errors.password }"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Confirmation du mot de passe -->
          <div>
            <input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Confirmer le mot de passe"
              required
              :disabled="isLoading"
              class="w-full px-4 py-4 text-base bg-white border border-gray-300 rounded-lg outline-none text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': errors.confirmPassword }"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </div>
          
          <div class="pt-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full px-4 py-4 text-base font-semibold text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span v-if="isLoading" class="mr-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isLoading ? 'Inscription...' : 'S\'inscrire' }}
            </button>
          </div>
        </form>

        <!-- Footer Links -->
        <div class="mt-10 space-y-4">          
          <p class="text-base text-gray-600">
            <span class="pr-1">Déjà membre ?</span>
            <router-link to="/signIn" class="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200">
              Se connecter
            </router-link>
          </p>
        </div>

        <!-- Decorative Elements -->
        <div>
          <span class="absolute top-1 right-1 opacity-10">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="1.39737" cy="38.6026" r="1.39737" transform="rotate(-90 1.39737 38.6026)" fill="#3056D3" />
              <circle cx="1.39737" cy="1.99122" r="1.39737" transform="rotate(-90 1.39737 1.99122)" fill="#3056D3" />
              <circle cx="13.6943" cy="38.6026" r="1.39737" transform="rotate(-90 13.6943 38.6026)" fill="#3056D3" />
              <circle cx="13.6943" cy="1.99122" r="1.39737" transform="rotate(-90 13.6943 1.99122)" fill="#3056D3" />
              <circle cx="25.9911" cy="38.6026" r="1.39737" transform="rotate(-90 25.9911 38.6026)" fill="#3056D3" />
              <circle cx="25.9911" cy="1.99122" r="1.39737" transform="rotate(-90 25.9911 1.99122)" fill="#3056D3" />
              <circle cx="38.288" cy="38.6026" r="1.39737" transform="rotate(-90 38.288 38.6026)" fill="#3056D3" />
              <circle cx="38.288" cy="1.99122" r="1.39737" transform="rotate(-90 38.288 1.99122)" fill="#3056D3" />
              <circle cx="1.39737" cy="26.3057" r="1.39737" transform="rotate(-90 1.39737 26.3057)" fill="#3056D3" />
              <circle cx="13.6943" cy="26.3057" r="1.39737" transform="rotate(-90 13.6943 26.3057)" fill="#3056D3" />
              <circle cx="25.9911" cy="26.3057" r="1.39737" transform="rotate(-90 25.9911 26.3057)" fill="#3056D3" />
              <circle cx="38.288" cy="26.3057" r="1.39737" transform="rotate(-90 38.288 26.3057)" fill="#3056D3" />
              <circle cx="1.39737" cy="14.0086" r="1.39737" transform="rotate(-90 1.39737 14.0086)" fill="#3056D3" />
              <circle cx="13.6943" cy="14.0086" r="1.39737" transform="rotate(-90 13.6943 14.0086)" fill="#3056D3" />
              <circle cx="25.9911" cy="14.0086" r="1.39737" transform="rotate(-90 25.9911 14.0086)" fill="#3056D3" />
              <circle cx="38.288" cy="14.0086" r="1.39737" transform="rotate(-90 38.288 14.0086)" fill="#3056D3" />
            </svg>
          </span>
          <span class="absolute left-1 bottom-1">
            <svg width="29" height="40" viewBox="0 0 29 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="2.288" cy="25.9912" r="1.39737" transform="rotate(-90 2.288 25.9912)" fill="#3056D3" />
              <circle cx="14.5849" cy="25.9911" r="1.39737" transform="rotate(-90 14.5849 25.9911)" fill="#3056D3" />
              <circle cx="26.7216" cy="25.9911" r="1.39737" transform="rotate(-90 26.7216 25.9911)" fill="#3056D3" />
              <circle cx="2.288" cy="13.6944" r="1.39737" transform="rotate(-90 2.288 13.6944)" fill="#3056D3" />
              <circle cx="14.5849" cy="13.6943" r="1.39737" transform="rotate(-90 14.5849 13.6943)" fill="#3056D3" />
              <circle cx="26.7216" cy="13.6943" r="1.39737" transform="rotate(-90 26.7216 13.6943)" fill="#3056D3" />
              <circle cx="2.288" cy="38.0087" r="1.39737" transform="rotate(-90 2.288 38.0087)" fill="#3056D3" />
              <circle cx="2.288" cy="1.39739" r="1.39737" transform="rotate(-90 2.288 1.39739)" fill="#3056D3" />
              <circle cx="14.5849" cy="38.0089" r="1.39737" transform="rotate(-90 14.5849 38.0089)" fill="#3056D3" />
              <circle cx="26.7216" cy="38.0089" r="1.39737" transform="rotate(-90 26.7216 38.0089)" fill="#3056D3" />
              <circle cx="14.5849" cy="1.39761" r="1.39737" transform="rotate(-90 14.5849 1.39761)" fill="#3056D3" />
              <circle cx="26.7216" cy="1.39761" r="1.39737" transform="rotate(-90 26.7216 1.39761)" fill="#3056D3" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  </section>
  <!-- ====== Register Section End -->
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import { useNotificationStore } from '@/composables/useNotifications.js'

const router = useRouter()
const { register } = useAuth()
const notificationStore = useNotificationStore()

// Détection du mode développement
const isDev = import.meta.env.DEV

// État du formulaire
const formData = reactive({
  email: '',
  username: '',
  firstName: '',
  lastName: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

// État des erreurs
const errors = reactive({
  email: null,
  username: null,
  firstName: null,
  lastName: null,
  phone: null,
  password: null,
  confirmPassword: null
})

// État de chargement
const isLoading = ref(false)

// Validation du formulaire
const validateForm = () => {
  // Réinitialiser les erreurs
  Object.keys(errors).forEach(key => {
    errors[key] = null
  })
  
  let isValid = true
  
  // Validation de l'email
  if (!formData.email.trim()) {
    errors.email = 'L\'adresse email est requise'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'L\'adresse email n\'est pas valide'
    isValid = false
  }
  
  // Validation du nom d'utilisateur
  if (!formData.username.trim()) {
    errors.username = 'Le nom d\'utilisateur est requis'
    isValid = false
  } else if (formData.username.length < 3) {
    errors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
    isValid = false
  }
  
  // Validation du prénom
  if (!formData.firstName.trim()) {
    errors.firstName = 'Le prénom est requis'
    isValid = false
  }
  
  // Validation du nom
  if (!formData.lastName.trim()) {
    errors.lastName = 'Le nom de famille est requis'
    isValid = false
  }
  
  // Validation du numéro de téléphone (optionnel mais avec format si fourni)
  if (formData.phone.trim() && !/^[+]?[\d\s\-()]{10,}$/.test(formData.phone.trim())) {
    errors.phone = 'Le numéro de téléphone n\'est pas valide'
    isValid = false
  }
  
  // Validation du mot de passe
  if (!formData.password.trim()) {
    errors.password = 'Le mot de passe est requis'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    isValid = false
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
    errors.password = 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    isValid = false
  }
  
  // Validation de la confirmation du mot de passe
  if (!formData.confirmPassword.trim()) {
    errors.confirmPassword = 'La confirmation du mot de passe est requise'
    isValid = false
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas'
    isValid = false
  }
  
  return isValid
}

// Gestionnaire de soumission du formulaire
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  
  try {
    console.log('📝 Tentative d\'inscription avec:', formData.username)
    
    const result = await register({
      email: formData.email,
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone.trim() || undefined, // Envoyer undefined si vide
      password: formData.password
    })
    
    // Afficher un message de succès personnalisé
    notificationStore.showSuccess(
      `Inscription réussie ! Bienvenue ${formData.firstName} ! Vous allez être redirigé vers la connexion.`
    )
    
    console.log('✅ Utilisateur enregistré:', result)
    
    // Attendre un peu avant la redirection pour que l'utilisateur puisse lire le message
    setTimeout(() => {
      // Rediriger vers la page de connexion avec les identifiants pré-remplis
      router.push({
        path: '/signIn',
        query: {
          username: formData.username,
          registered: 'true'
        }
      })
    }, 2000)
    
  } catch (error) {
    console.error('❌ Erreur d\'inscription:', error)
    
    // Gérer les différents types d'erreurs
    if (error.message.includes('déjà utilisé')) {
      notificationStore.showError('Ce nom d\'utilisateur ou cette adresse email est déjà utilisé.')
    } else if (error.message.includes('409')) {
      notificationStore.showError('Ce nom d\'utilisateur ou cette adresse email est déjà utilisé.')
    } else if (error.message.includes('400')) {
      notificationStore.showError('Données invalides. Vérifiez vos informations.')
    } else if (error.message.includes('500')) {
      notificationStore.showError('Erreur serveur. Veuillez réessayer plus tard.')
    } else {
      notificationStore.showError('Erreur d\'inscription. Vérifiez votre connexion internet.')
    }
  } finally {
    isLoading.value = false
  }
}

// Fonction utilitaire pour tester avec des données par défaut
const fillTestCredentials = () => {
  formData.email = 'test@example.com'
  formData.username = 'testuser123'
  formData.firstName = 'Test'
  formData.lastName = 'User'
  formData.phone = '06 12 34 56 78'
  formData.password = 'Test123!'
  formData.confirmPassword = 'Test123!'
}

// Exposer la fonction pour les tests (en mode développement seulement)
if (isDev) {
  window.fillTestRegisterData = fillTestCredentials
  console.log('🧪 Mode développement: utilisez fillTestRegisterData() dans la console pour remplir les données de test')
}
</script>

<style scoped>

</style>
