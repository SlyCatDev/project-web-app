<template>
  <div class="order-confirmation-view">
    <div class="container mx-auto px-4 py-8">
      <!-- État de chargement -->
      <div v-if="loading" class="text-center py-12">
        <LoadingSpinner />
        <p class="text-gray-600 mt-4">Chargement des détails de votre commande...</p>
      </div>

      <!-- Commande non trouvée -->
      <div v-else-if="!order" class="text-center py-12">
        <div class="text-red-400 text-6xl mb-4">❌</div>
        <h2 class="text-2xl font-semibold text-gray-600 mb-2">Commande introuvable</h2>
        <p class="text-gray-500 mb-6">Le numéro de commande {{ $route.params.orderNumber }} n'existe pas.</p>
        <router-link 
          to="/products" 
          class="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Retourner aux produits
        </router-link>
      </div>

      <!-- Confirmation de commande -->
      <div v-else class="max-w-4xl mx-auto">
        <!-- Header de confirmation -->
        <div class="text-center mb-8">
          <div class="text-green-500 text-6xl mb-4">✅</div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Commande confirmée !
          </h1>
          <p class="text-lg text-gray-600 mb-4">
            Merci {{ order.customer.firstName }}, votre commande a été traitée avec succès.
          </p>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
            <p class="text-green-800">
              <i class="fas fa-receipt mr-2"></i>
              Numéro de commande : <span class="font-bold">{{ order.orderNumber }}</span>
            </p>
          </div>
        </div>

        <!-- Informations de la commande -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Informations de livraison -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i class="fas fa-truck text-blue-600 mr-2"></i>
              Livraison
            </h3>
            <div class="text-gray-700 space-y-1">
              <p class="font-medium">{{ order.customer.firstName }} {{ order.customer.lastName }}</p>
              <p>{{ order.shipping.address }}</p>
              <p>{{ order.shipping.postalCode }} {{ order.shipping.city }}</p>
              <p>{{ order.shipping.country }}</p>
              <div class="mt-3 pt-3 border-t border-gray-200">
                <p class="text-sm text-gray-600">
                  <i class="fas fa-calendar text-gray-400 mr-1"></i>
                  Livraison estimée : {{ formatDeliveryDate(order.estimatedDelivery) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Informations de paiement -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i class="fas fa-credit-card text-blue-600 mr-2"></i>
              Paiement
            </h3>
            <div class="text-gray-700 space-y-1">
              <p class="flex items-center">
                <i :class="getCardIcon(order.payment.cardType)" class="text-2xl mr-2"></i>
                <span>**** **** **** {{ order.payment.lastFourDigits }}</span>
              </p>
              <p class="text-sm text-gray-600">
                Montant : {{ formatPrice(order.payment.amount) }} €
              </p>
              <div class="mt-3 pt-3 border-t border-gray-200">
                <p class="text-sm text-green-600">
                  <i class="fas fa-check-circle mr-1"></i>
                  Paiement confirmé
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Détails de la commande -->
        <div class="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i class="fas fa-shopping-bag text-blue-600 mr-2"></i>
            Détails de la commande
          </h3>
          
          <!-- Articles commandés -->
          <div class="space-y-4 mb-6">
            <div 
              v-for="item in order.items" 
              :key="item.id"
              class="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0"
            >
              <div class="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                <i class="fas fa-box text-gray-400"></i>
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900">{{ item.title }}</h4>
                <p class="text-sm text-gray-500">Quantité: {{ item.quantity }}</p>
                <p class="text-sm text-gray-500">Prix unitaire: {{ formatPrice(item.price) }} €</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900">
                  {{ formatPrice(item.total) }} €
                </p>
              </div>
            </div>
          </div>

          <!-- Récapitulatif des totaux -->
          <div class="border-t border-gray-200 pt-4">
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Sous-total</span>
                <span class="text-gray-900">{{ formatPrice(order.totals.subtotal) }} €</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Livraison</span>
                <span class="text-green-600">{{ formatPrice(order.totals.shipping) }} €</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">TVA (20%)</span>
                <span class="text-gray-900">{{ formatPrice(order.totals.tax) }} €</span>
              </div>
              <div class="border-t border-gray-200 pt-2">
                <div class="flex justify-between text-lg font-bold">
                  <span class="text-gray-900">Total</span>
                  <span class="text-gray-900">{{ formatPrice(order.totals.total) }} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Étapes suivantes -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 class="text-lg font-semibold text-blue-900 mb-4">Que se passe-t-il maintenant ?</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex items-start">
              <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                <span class="text-sm font-bold">1</span>
              </div>
              <div>
                <h4 class="font-medium text-blue-900">Préparation</h4>
                <p class="text-sm text-blue-700">Nous préparons votre commande dans notre entrepôt.</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                <span class="text-sm font-bold">2</span>
              </div>
              <div>
                <h4 class="font-medium text-blue-900">Expédition</h4>
                <p class="text-sm text-blue-700">Votre commande est expédiée vers votre adresse.</p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                <span class="text-sm font-bold">3</span>
              </div>
              <div>
                <h4 class="font-medium text-blue-900">Livraison</h4>
                <p class="text-sm text-blue-700">Vous recevez votre commande chez vous.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/products" 
            class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            <i class="fas fa-shopping-cart mr-2"></i>
            Continuer mes achats
          </router-link>
          <button 
            @click="printOrder"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <i class="fas fa-print mr-2"></i>
            Imprimer la commande
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { paymentService } from '@/services/paymentService.js'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

export default {
  name: 'OrderConfirmationView',
  components: {
    LoadingSpinner
  },
  setup() {
    const route = useRoute()
    const loading = ref(true)
    const order = ref(null)

    // Charger les détails de la commande
    const loadOrder = async () => {
      try {
        const orderNumber = route.params.orderNumber
        if (orderNumber) {
          const orderData = paymentService.getOrderByNumber(orderNumber)
          order.value = orderData
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la commande:', error)
      } finally {
        loading.value = false
      }
    }

    // Formater le prix
    const formatPrice = (price) => {
      const numericPrice = parseFloat(price)
      return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2)
    }

    // Formater la date de livraison
    const formatDeliveryDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Obtenir l'icône de la carte
    const getCardIcon = (cardType) => {
      const icons = {
        visa: 'fab fa-cc-visa text-blue-600',
        mastercard: 'fab fa-cc-mastercard text-red-600',
        amex: 'fab fa-cc-amex text-blue-700',
        paypal: 'fab fa-cc-paypal text-blue-600'
      }
      return icons[cardType] || 'fas fa-credit-card text-gray-600'
    }

    // Imprimer la commande
    const printOrder = () => {
      window.print()
    }

    onMounted(loadOrder)

    return {
      loading,
      order,
      formatPrice,
      formatDeliveryDate,
      getCardIcon,
      printOrder
    }
  }
}
</script>

<style scoped>
.order-confirmation-view {
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Styles pour l'impression */
@media print {
  .order-confirmation-view {
    background-color: white;
  }
  
  button, .no-print {
    display: none !important;
  }
}
</style>
