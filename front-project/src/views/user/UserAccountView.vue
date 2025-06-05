<template>
  <div class="user-account-view">
    <div class="container mx-auto px-4 py-8 space-y-12">
      <!-- En-tête -->
      <section>
        <div class="bg-white rounded-lg shadow-sm p-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Mon Compte</h1>
              <p class="text-gray-600 mt-1">Gérez vos informations personnelles et vos préférences</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Informations utilisateur -->
      <section>
        <div class="bg-white rounded-lg shadow-sm p-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Informations personnelles</h2>
          <div v-if="user" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
              <div class="p-4 bg-gray-50 rounded-md">{{ user.name?.firstname || user.firstName || 'Non renseigné' }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
              <div class="p-4 bg-gray-50 rounded-md">{{ user.name?.lastname || user.lastName || 'Non renseigné' }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
              <div class="p-4 bg-gray-50 rounded-md">{{ user.username }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div class="p-4 bg-gray-50 rounded-md">{{ user.email || 'Non renseigné' }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone</label>
              <div class="p-4 bg-gray-50 rounded-md">{{ user.phone || 'Non renseigné' }}</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Actions rapides -->
      <section>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white rounded-lg shadow-sm p-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Mes commandes</h3>
            <p class="text-gray-600 mb-6">Consultez l'historique de vos commandes</p>
            <button class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Voir mes commandes
            </button>
          </div>
          
          <div class="bg-white rounded-lg shadow-sm p-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Mon panier</h3>
            <p class="text-gray-600 mb-6">Accédez rapidement à votre panier</p>
            <router-link 
              to="/cart" 
              class="block w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
            >
              Voir mon panier
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { authService } from '@/services/authService'

export default {
  name: 'UserAccountView',
  setup() {
    const user = ref(null)

    onMounted(() => {
      // Récupérer les informations de l'utilisateur connecté
      user.value = authService.getCurrentUser()
    })

    return {
      user,
    }
  }
}
</script>

<style scoped>
.user-account-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
