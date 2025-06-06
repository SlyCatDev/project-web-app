<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Récapitulatif de votre commande</h2>
      <p class="text-gray-600">Vérifiez vos informations avant de finaliser la commande</p>
    </div>

    <div class="space-y-6">
      <!-- Informations de livraison -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <i class="fas fa-truck text-blue-600 mr-2"></i>
            Adresse de livraison
          </h3>
          <button 
            @click="$emit('go-to-step', 0)"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Modifier
          </button>
        </div>
        <div class="text-gray-700">
          <p class="font-medium">{{ formData.shipping.firstName }} {{ formData.shipping.lastName }}</p>
          <p>{{ formData.shipping.address }}</p>
          <p>{{ formData.shipping.postalCode }} {{ formData.shipping.city }}</p>
          <p>{{ formData.shipping.country }}</p>
          <p class="mt-2">
            <i class="fas fa-phone text-gray-400 mr-1"></i>
            {{ formData.shipping.phone }}
          </p>
          <p>
            <i class="fas fa-envelope text-gray-400 mr-1"></i>
            {{ formData.shipping.email }}
          </p>
          <p v-if="formData.shipping.deliveryInstructions" class="mt-2 text-sm text-gray-600">
            <i class="fas fa-info-circle text-gray-400 mr-1"></i>
            {{ formData.shipping.deliveryInstructions }}
          </p>
        </div>
      </div>

      <!-- Informations de paiement -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <i class="fas fa-credit-card text-blue-600 mr-2"></i>
            Méthode de paiement
          </h3>
          <button 
            @click="$emit('go-to-step', 1)"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Modifier
          </button>
        </div>
        <div class="text-gray-700">
          <div class="flex items-center mb-2">
            <i :class="getCardIcon(formData.payment.cardType)" class="text-2xl mr-3"></i>
            <span class="font-medium">{{ getCardName(formData.payment.cardType) }}</span>
          </div>
          <p>**** **** **** {{ formData.payment.cardNumber.slice(-4) }}</p>
          <p>{{ formData.payment.cardHolderName }}</p>
          <p class="text-sm text-gray-600">
            Expire: {{ formData.payment.expiryMonth }}/{{ formData.payment.expiryYear }}
          </p>
        </div>
      </div>

      <!-- Détails de la commande -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <i class="fas fa-shopping-bag text-blue-600 mr-2"></i>
          Détails de la commande
        </h3>
        
        <!-- Articles -->
        <div class="space-y-4 mb-6">
          <div 
            v-for="item in cartData.items" 
            :key="item.id"
            class="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0"
          >
            <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                :src="item.image" 
                :alt="item.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.title }}</h4>
              <p class="text-sm text-gray-500">Quantité: {{ item.quantity }}</p>
              <p class="text-sm text-gray-500">Prix unitaire: {{ formatPrice(item.price) }} €</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900">
                {{ formatPrice(item.price * item.quantity) }} €
              </p>
            </div>
          </div>
        </div>

        <!-- Totaux -->
        <div class="border-t border-gray-200 pt-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Sous-total</span>
            <span class="text-gray-900">{{ formatPrice(cartData.totalAmount) }} €</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Livraison</span>
            <span class="text-green-600">Gratuite</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">TVA (20%)</span>
            <span class="text-gray-900">{{ formatPrice(cartData.totalAmount * 0.2) }} €</span>
          </div>
          <div class="border-t border-gray-200 pt-2">
            <div class="flex justify-between text-lg font-bold">
              <span class="text-gray-900">Total</span>
              <span class="text-gray-900">{{ formatPrice(cartData.totalAmount * 1.2) }} €</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Conditions générales et newsletter -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Finalisation</h3>
        
        <div class="space-y-4">
          <!-- Conditions générales -->
          <div class="flex items-start">
            <input
              id="termsAccepted"
              v-model="localFormData.termsAccepted"
              type="checkbox"
              class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              :class="{ 'border-red-500': errors.terms }"
              @change="updateData"
            />
            <label for="termsAccepted" class="ml-2 text-sm text-gray-700">
              J'accepte les 
              <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">conditions générales de vente</a>
              et la 
              <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">politique de confidentialité</a>
              *
            </label>
          </div>
          <p v-if="errors.terms" class="text-red-500 text-sm">{{ errors.terms }}</p>

          <!-- Newsletter -->
          <div class="flex items-start">
            <input
              id="newsletterSubscription"
              v-model="localFormData.newsletterSubscription"
              type="checkbox"
              class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              @change="updateData"
            />
            <label for="newsletterSubscription" class="ml-2 text-sm text-gray-700">
              Je souhaite recevoir les offres promotionnelles et actualités par email
            </label>
          </div>
        </div>
      </div>

      <!-- Estimation de livraison -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center">
          <i class="fas fa-calendar-check text-blue-600 mr-3"></i>
          <div>
            <h4 class="text-sm font-medium text-blue-900">Livraison estimée</h4>
            <p class="text-sm text-blue-700">
              {{ getEstimatedDeliveryDate() }}
            </p>
          </div>
        </div>
      </div>

      <!-- Bouton de soumission -->
      <div class="pt-4">
        <button
          @click="handleSubmit"
          :disabled="!localFormData.termsAccepted || isSubmitting"
          class="w-full flex items-center justify-center px-6 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <i 
            :class="isSubmitting ? 'fas fa-spinner fa-spin' : 'fas fa-credit-card'"
            class="mr-3"
          ></i>
          {{ isSubmitting ? 'Traitement en cours...' : `Payer ${formatPrice(cartData.totalAmount * 1.2)} €` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, watch } from 'vue'

export default {
  name: 'OrderSummaryStep',
  props: {
    formData: {
      type: Object,
      required: true
    },
    cartData: {
      type: Object,
      required: true
    },
    errors: {
      type: Object,
      default: () => ({})
    },
    orderSummary: {
      type: Object,
      required: true
    },
    isSubmitting: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:form-data', 'validate', 'submit', 'go-to-step'],
  setup(props, { emit }) {
    // Copie locale des données de résumé
    const localFormData = reactive({
      termsAccepted: props.formData.summary?.termsAccepted || false,
      newsletterSubscription: props.formData.summary?.newsletterSubscription || false
    })

    // Watcher pour synchroniser les changements
    watch(
      () => props.formData.summary,
      (newData) => {
        if (newData) {
          localFormData.termsAccepted = newData.termsAccepted
          localFormData.newsletterSubscription = newData.newsletterSubscription
        }
      },
      { deep: true }
    )

    // Mettre à jour les données parentes
    const updateData = () => {
      emit('update:form-data', { ...localFormData })
    }

    // Déclencher la validation
    const validate = () => {
      emit('validate')
    }

    // Gérer la soumission
    const handleSubmit = () => {
      if (localFormData.termsAccepted) {
        emit('submit')
      }
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

    // Obtenir le nom de la carte
    const getCardName = (cardType) => {
      const names = {
        visa: 'Visa',
        mastercard: 'Mastercard',
        amex: 'American Express',
        paypal: 'PayPal'
      }
      return names[cardType] || 'Carte bancaire'
    }

    // Calculer la date de livraison estimée
    const getEstimatedDeliveryDate = () => {
      const deliveryDate = new Date()
      deliveryDate.setDate(deliveryDate.getDate() + 3) // 3 jours ouvrés
      
      // Éviter les weekends
      while (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
        deliveryDate.setDate(deliveryDate.getDate() + 1)
      }
      
      return deliveryDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Formater le prix
    const formatPrice = (price) => {
      const numericPrice = parseFloat(price)
      return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2)
    }

    return {
      localFormData,
      updateData,
      validate,
      handleSubmit,
      getCardIcon,
      getCardName,
      getEstimatedDeliveryDate,
      formatPrice
    }
  }
}
</script>

<style scoped>
/* Styles personnalisés pour les champs d'erreur */
.border-red-500:focus {
  outline: none;
  ring: 2px;
  ring-color: #ef4444;
  border-color: transparent;
}
</style>
