<template>
  <div class="max-w-6xl mx-auto p-6 bg-white">
    <!-- Header avec progression -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Finaliser votre commande
      </h1>
      <p class="text-gray-600 mb-6">
        Suivez les étapes pour finaliser votre achat
      </p>
      
      <!-- Indicateurs d'étapes -->
      <div class="flex justify-center items-center mb-6">
        <div 
          v-for="(step, index) in steps" 
          :key="step.id"
          class="flex items-center"
          :class="{ 'opacity-50': index > currentStep }"
        >
          <!-- Cercle d'étape -->
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200"
            :class="{
              'bg-blue-600 border-blue-600 text-white': index <= currentStep,
              'bg-white border-gray-300 text-gray-500': index > currentStep,
              'bg-green-500 border-green-500': step.completed
            }"
          >
            <i 
              v-if="step.completed" 
              class="fas fa-check text-sm"
            ></i>
            <span v-else class="text-sm font-medium">{{ step.id }}</span>
          </div>
          
          <!-- Titre de l'étape -->
          <div class="ml-3">
            <div 
              class="text-sm font-medium"
              :class="{
                'text-blue-600': index === currentStep,
                'text-green-600': step.completed,
                'text-gray-500': index > currentStep
              }"
            >
              {{ step.title }}
            </div>
            <!-- <div class="text-xs text-gray-400">{{ step.description }}</div> -->
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Contenu principal du formulaire -->
      <div class="lg:col-span-2">
        <div class="bg-gray-50 rounded-lg p-6 min-h-[600px]">

          <!-- Étape 1: Informations de livraison -->
          <ShippingInfoStep
            v-if="currentStep === 0"
            :form-data="formData.shipping"
            :errors="errors.step1"
            @update:form-data="updateShippingData"
            @validate="validateStep1"
          />
          
          <!-- Étape 2: Informations de paiement -->
          <PaymentInfoStep
            v-if="currentStep === 1"
            :form-data="formData.payment"
            :shipping-data="formData.shipping"
            :errors="errors.step2"
            @update:form-data="updatePaymentData"
            @validate="validateStep2"
          />
          
          <!-- Étape 3: Récapitulatif et confirmation -->
          <OrderSummaryStep
            v-if="currentStep === 2"
            :form-data="formData"
            :cart-data="cartData"
            :errors="errors.step3"
            :order-summary="getOrderSummary()"
            @update:form-data="updateSummaryData"
            @validate="validateStep3"
            @submit="handleSubmit"
            :is-submitting="isSubmitting"
          />
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center mt-6">

          <!-- Bouton Précédent -->
          <button
            v-if="!isFirstStep"
            @click="previousStep"
            class="flex items-center px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            :disabled="isSubmitting"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Précédent
          </button>
          <div v-else></div>

          <!-- Bouton Suivant/Finaliser -->
          <button
            v-if="!isLastStep"
            @click="nextStep"
            class="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            :disabled="!canGoNext || isSubmitting"
          >
            Suivant
            <i class="fas fa-arrow-right ml-2"></i>
          </button>
          
          <button
            v-else
            @click="handleSubmit"
            class="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            :disabled="!stepValidation.step3 || isSubmitting"
          >
            <i 
              :class="isSubmitting ? 'fas fa-spinner fa-spin' : 'fas fa-credit-card'"
              class="mr-2"
            ></i>
            {{ isSubmitting ? 'Traitement...' : 'Finaliser la commande' }}
          </button>
        </div>
      </div>

      <!-- Sidebar avec résumé du panier -->
      <div class="lg:col-span-1">
        <div class="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Résumé de la commande</h3>
          
          <!-- Articles du panier -->
          <div class="space-y-4 mb-6">
            <div 
              v-for="item in cartData.items" 
              :key="item.id"
              class="flex items-center space-x-3"
            >
              <div class="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  :src="item.image" 
                  :alt="item.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.title }}</h4>
                <p class="text-sm text-gray-500">Qté: {{ item.quantity }}</p>
              </div>
              <div class="text-sm font-medium text-gray-900">
                {{ formatPrice(item.price * item.quantity) }} €
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
              <div class="flex justify-between text-lg font-semibold">
                <span class="text-gray-900">Total</span>
                <span class="text-gray-900">{{ formatPrice(cartData.totalAmount * 1.2) }} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCheckoutForm } from '@/composables/useCheckoutForm.js'
import { paymentService } from '@/services/paymentService.js'
import { useNotificationStore } from '@/composables/useNotifications.js'
import { useCartStore } from '@/stores/cart.js'

import ShippingInfoStep from './ShippingInfoStep.vue'
import PaymentInfoStep from './PaymentInfoStep.vue'
import OrderSummaryStep from './OrderSummaryStep.vue'

export default {
  name: 'CheckoutForm',
  components: {
    ShippingInfoStep,
    PaymentInfoStep,
    OrderSummaryStep
  },
  props: {
    cartData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const notificationStore = useNotificationStore()
    const cartStore = useCartStore()
    
    // État du formulaire de checkout
    const {
      currentStep,
      totalSteps,
      formData,
      errors,
      stepValidation,
      isFirstStep,
      isLastStep,
      canGoNext,
      progressPercentage,      steps,
      nextStep,
      previousStep,
      goToStep,
      validateStep1,
      validateStep2,
      validateStep3,
      getOrderSummary
    } = useCheckoutForm(props.cartData)

    // États locaux
    const isSubmitting = ref(false)

    // Mettre à jour les données de livraison
    const updateShippingData = (updates) => {
      Object.assign(formData.shipping, updates)
    }

    // Mettre à jour les données de paiement
    const updatePaymentData = (updates) => {
      Object.assign(formData.payment, updates)
    }

    // Mettre à jour les données de résumé
    const updateSummaryData = (updates) => {
      Object.assign(formData.summary, updates)
    }

    // Gérer la soumission de la commande
    const handleSubmit = async () => {
      try {
        isSubmitting.value = true

        // Validation finale
        if (!validateStep3()) {
          notificationStore.showError('Veuillez accepter les conditions générales')
          return
        }

        // Préparer les données pour le service de paiement
        const orderData = {
          shipping: formData.shipping,
          payment: formData.payment,
          cart: props.cartData,
          summary: formData.summary
        }

        // Traiter la commande
        const result = await paymentService.processOrder(orderData)

        if (result.success) {
          // Vider le panier
          cartStore.clearCart()
          
          // Afficher le succès
          notificationStore.showSuccess(`Commande ${result.order.orderNumber} confirmée !`)
          
          // Envoyer l'email de confirmation (simulation)
          await paymentService.sendConfirmationEmail(result.order)
            // Rediriger vers une page de confirmation
          setTimeout(() => {
            router.push({
              name: 'order-confirmation',
              params: { orderNumber: result.order.orderNumber }
            })
          }, 2000)
          
        } else {
          throw new Error(result.error)
        }

      } catch (error) {
        console.error('Erreur lors du traitement de la commande:', error)
        notificationStore.showError(error.message || 'Erreur lors du traitement de la commande')
      } finally {
        isSubmitting.value = false
      }
    }

    // Formater le prix
    const formatPrice = (price) => {
      const numericPrice = parseFloat(price)
      return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2)
    }

    return {
      // État du formulaire
      currentStep,
      totalSteps,
      formData,
      errors,
      stepValidation,
      isSubmitting,
      
      // Computed
      isFirstStep,
      isLastStep,
      canGoNext,
      progressPercentage,
      steps,
      
      // Méthodes de navigation
      nextStep,
      previousStep,
      goToStep,
      
      // Méthodes de validation
      validateStep1,
      validateStep2,
      validateStep3,
      
      // Méthodes de gestion des données
      updateShippingData,
      updatePaymentData,
      updateSummaryData,
      getOrderSummary,
      
      // Actions
      handleSubmit,
      formatPrice
    }
  }
}
</script>

<style scoped>
/* Animations personnalisées */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Styles pour le focus des boutons */
button:focus {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}
</style>
