<template>
  <!-- ====== Forms Section Start -->
  <section class="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg w-full">
      <div class="relative overflow-hidden rounded-2xl bg-white py-16 px-8 text-center shadow-xl border border-gray-200 sm:px-12 md:px-16">
        <!-- Logo Section -->
        <div class="mb-12">
          <a href="javascript:void(0)" class="mx-auto inline-block max-w-[160px]">
            <img src="@/assets/logo.svg" alt="logo" class="w-full h-auto" />
          </a>
        </div>        <!-- Message de bienvenue après inscription -->
        <div v-if="showRegistrationMessage" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
          <div class="flex items-center mb-2">
            <span class="text-green-600 mr-2">🎉</span>
            <span class="font-medium text-green-800">Inscription réussie !</span>
          </div>
          <div class="text-green-700">
            <p class="text-xs">Connectez-vous maintenant avec vos identifiants.</p>
            <p class="text-xs mt-1">Votre nom d'utilisateur a été pré-rempli.</p>
          </div>
        </div>

        <!-- Section d'aide en mode développement -->
        <div v-if="isDev" class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <div class="flex items-center mb-2">
            <span class="text-blue-600 mr-2">🧪</span>
            <span class="font-medium text-blue-800">Mode Développement - Identifiants de test</span>
          </div>
          <div class="text-blue-700 space-y-1">
            <p class="text-xs"><strong>API FakeStore:</strong> mor_2314 / 83r5^_</p>
            <p class="text-xs"><strong>Ou utilisez vos propres identifiants</strong> après inscription !</p>
            <button 
              type="button"
              @click="fillTestCredentials"
              class="mt-2 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-xs transition-colors"
            >
              Remplir identifiants test
            </button>
          </div>
        </div>

        <!-- Form Section -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
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
          
          <div class="pt-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full px-4 py-4 text-base font-semibold text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span v-if="isLoading" class="mr-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isLoading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </div>
        </form>

        <!-- Social Login Section -->
        <div class="mt-10">
          <p class="mb-6 text-base text-gray-600">Ou connectez-vous avec</p>
          
          <div class="flex justify-center space-x-4">
            <a
              href="javascript:void(0)"
              class="flex items-center justify-center w-12 h-12 rounded-lg bg-[#4064AC] hover:bg-opacity-90 transition-all duration-200"
            >
              <svg width="10" height="20" viewBox="0 0 10 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.29878 8H7.74898H7.19548V7.35484V5.35484V4.70968H7.74898H8.91133C9.21575 4.70968 9.46483 4.45161 9.46483 4.06452V0.645161C9.46483 0.290323 9.24343 0 8.91133 0H6.89106C4.70474 0 3.18262 1.80645 3.18262 4.48387V7.29032V7.93548H2.62912H0.747223C0.359774 7.93548 0 8.29032 0 8.80645V11.129C0 11.5806 0.304424 12 0.747223 12H2.57377H3.12727V12.6452V19.129C3.12727 19.5806 3.43169 20 3.87449 20H6.47593C6.64198 20 6.78036 19.9032 6.89106 19.7742C7.00176 19.6452 7.08478 19.4194 7.08478 19.2258V12.6774V12.0323H7.66596H8.91133C9.2711 12.0323 9.54785 11.7742 9.6032 11.3871V11.3548V11.3226L9.99065 9.09677C10.0183 8.87097 9.99065 8.6129 9.8246 8.35484C9.76925 8.19355 9.52018 8.03226 9.29878 8Z" fill="white" />
              </svg>
            </a>
            
            <a
              href="javascript:void(0)"
              class="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1C9CEA] hover:bg-opacity-90 transition-all duration-200"
            >
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.5516 2.75538L20.9 1.25245C21.2903 0.845401 21.3968 0.53229 21.4323 0.375734C20.3677 0.939335 19.3742 1.1272 18.7355 1.1272H18.4871L18.3452 1.00196C17.4935 0.344423 16.429 0 15.2935 0C12.8097 0 10.8581 1.81605 10.8581 3.91389C10.8581 4.03914 10.8581 4.22701 10.8935 4.35225L11 4.97847L10.2548 4.94716C5.7129 4.82192 1.9871 1.37769 1.38387 0.782779C0.390323 2.34834 0.958064 3.85127 1.56129 4.79061L2.76774 6.54403L0.851613 5.6047C0.887097 6.91977 1.45484 7.95303 2.55484 8.7045L3.5129 9.33072L2.55484 9.67515C3.15806 11.272 4.50645 11.9296 5.5 12.18L6.8129 12.4932L5.57097 13.2446C3.58387 14.4971 1.1 14.4031 0 14.3092C2.23548 15.6869 4.89677 16 6.74194 16C8.12581 16 9.15484 15.8748 9.40322 15.7808C19.3387 13.7143 19.8 5.8865 19.8 4.32094V4.10176L20.0129 3.97652C21.2194 2.97456 21.7161 2.44227 22 2.12916C21.8935 2.16047 21.7516 2.22309 21.6097 2.2544L19.5516 2.75538Z" fill="white" />
              </svg>
            </a>
            
            <a
              href="javascript:void(0)"
              class="flex items-center justify-center w-12 h-12 rounded-lg bg-[#D64937] hover:bg-opacity-90 transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.8477 8.17132H9.29628V10.643H15.4342C15.1065 14.0743 12.2461 15.5574 9.47506 15.5574C5.95916 15.5574 2.8306 12.8821 2.8306 9.01461C2.8306 5.29251 5.81018 2.47185 9.47506 2.47185C12.2759 2.47185 13.9742 4.24567 13.9742 4.24567L15.7024 2.47185C15.7024 2.47185 13.3783 0.000145544 9.35587 0.000145544C4.05223 -0.0289334 0 4.30383 0 8.98553C0 13.5218 3.81386 18 9.44526 18C14.4212 18 17.9967 14.7141 17.9967 9.79974C18.0264 8.78198 17.8477 8.17132 17.8477 8.17132Z" fill="white" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Footer Links -->
        <div class="mt-10 space-y-4">
          <a
            href="javascript:void(0)"
            class="inline-block text-base text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-200"
          >
            Mot de passe oublié ?
          </a>
            <p class="text-base text-gray-600">
            <span class="pr-1">Pas encore membre ?</span>
            <router-link to="/register" class="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200">
              S'inscrire
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
  <!-- ====== Forms Section End -->
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import { useNotificationStore } from '@/composables/useNotifications.js'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()
const notificationStore = useNotificationStore()

// Détection du mode développement
const isDev = import.meta.env.DEV

// État du formulaire
const formData = reactive({
  username: '',
  password: ''
})

// État des erreurs
const errors = reactive({
  username: null,
  password: null
})

// État de chargement
const isLoading = ref(false)

// Message spécial si l'utilisateur vient de s'inscrire
const showRegistrationMessage = ref(false)

// Vérifier si l'utilisateur vient de s'inscrire
onMounted(() => {
  if (route.query.registered === 'true' && route.query.username) {
    formData.username = route.query.username
    showRegistrationMessage.value = true
    notificationStore.showSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter avec vos identifiants.')
    
    // Nettoyer l'URL
    router.replace({ path: '/signIn' })
  }
})

// Validation du formulaire
const validateForm = () => {
  // Réinitialiser les erreurs
  errors.username = null
  errors.password = null
  
  let isValid = true
  
  if (!formData.username.trim()) {
    errors.username = 'Le nom d\'utilisateur est requis'
    isValid = false
  }
  
  if (!formData.password.trim()) {
    errors.password = 'Le mot de passe est requis'
    isValid = false
  } else if (formData.password.length < 3) {
    errors.password = 'Le mot de passe doit contenir au moins 3 caractères'
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
    console.log('🔐 Tentative de connexion avec:', formData.username)
    
    await login(formData.username, formData.password)
    
    // Afficher un message de succès
    notificationStore.showSuccess(`Connexion réussie ! Bienvenue, ${formData.username}`)
    
    // Rediriger vers la page d'accueil ou le tableau de bord
    router.push('/')
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error)
    
    // Gérer les différents types d'erreurs
    if (error.message.includes('401')) {
      notificationStore.showError('Nom d\'utilisateur ou mot de passe incorrect.')
    } else if (error.message.includes('404')) {
      notificationStore.showError('Service d\'authentification non disponible.')
    } else if (error.message.includes('500')) {
      notificationStore.showError('Erreur serveur. Veuillez réessayer plus tard.')
    } else {
      notificationStore.showError('Erreur de connexion. Vérifiez votre connexion internet.')
    }
  } finally {
    isLoading.value = false
  }
}

// Fonction utilitaire pour tester avec des identifiants par défaut
const fillTestCredentials = () => {
  formData.username = 'mor_2314'
  formData.password = '83r5^_'
}

// Exposer la fonction pour les tests (en mode développement seulement)
if (isDev) {
  window.fillTestCredentials = fillTestCredentials
  console.log('🧪 Mode développement: utilisez fillTestCredentials() dans la console pour remplir les identifiants de test')
}
</script>

<style scoped>

</style>
