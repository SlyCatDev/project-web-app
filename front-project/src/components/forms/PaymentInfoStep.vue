<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Informations de paiement</h2>
      <p class="text-gray-600">Saisissez vos informations de paiement de manière sécurisée</p>
    </div>    <form @submit.prevent="validate" class="space-y-6">
      <!-- Nom sur la carte -->
      <div>
        <label for="cardHolderName" class="block text-sm font-medium text-gray-700 mb-1">
          Nom sur la carte *
        </label>
        <input
          id="cardHolderName"
          v-model="localFormData.cardHolderName"
          type="text"
          placeholder="Nom tel qu'il apparaît sur la carte"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.cardHolderName }"
          @input="updateData"
          @blur="validate"
        />
        <p v-if="errors.cardHolderName" class="text-red-500 text-sm mt-1">{{ errors.cardHolderName }}</p>
      </div>

      <!-- Numéro de carte -->
      <div>
        <label for="cardNumber" class="block text-sm font-medium text-gray-700 mb-1">
          Numéro de carte *
        </label>
        <input
          id="cardNumber"
          v-model="formattedCardNumber"
          type="text"
          placeholder="1234 5678 9012 3456"
          maxlength="19"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.cardNumber }"
          @input="handleCardNumberInput"
          @blur="validate"
        />
        <p v-if="errors.cardNumber" class="text-red-500 text-sm mt-1">{{ errors.cardNumber }}</p>
      </div>

      <!-- Date d'expiration et CVV -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="expiryMonth" class="block text-sm font-medium text-gray-700 mb-1">
            Mois d'expiration *
          </label>
          <select
            id="expiryMonth"
            v-model="localFormData.expiryMonth"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.expiry }"
            @change="updateData"
          >
            <option value="">Mois</option>
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>

        <div>
          <label for="expiryYear" class="block text-sm font-medium text-gray-700 mb-1">
            Année d'expiration *
          </label>
          <select
            id="expiryYear"
            v-model="localFormData.expiryYear"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.expiry }"
            @change="updateData"
          >
            <option value="">Année</option>
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <div>
          <label for="cvv" class="block text-sm font-medium text-gray-700 mb-1">
            Code CVV *
          </label>
          <input
            id="cvv"
            v-model="localFormData.cvv"
            type="text"
            placeholder="123"
            maxlength="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.cvv }"
            @input="handleCvvInput"
            @blur="validate"
          />
          <p v-if="errors.cvv" class="text-red-500 text-sm mt-1">{{ errors.cvv }}</p>
        </div>
      </div>
      
      <p v-if="errors.expiry" class="text-red-500 text-sm">{{ errors.expiry }}</p>

      <!-- Adresse de facturation -->
      <div class="border-t border-gray-200 pt-6">
        <div class="flex items-center mb-4">
          <input
            id="sameAsShipping"
            v-model="localFormData.sameAsShipping"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            @change="updateData"
          />
          <label for="sameAsShipping" class="ml-2 text-sm text-gray-700">
            L'adresse de facturation est identique à l'adresse de livraison
          </label>
        </div>

        <!-- Adresse de facturation différente -->
        <div v-if="!localFormData.sameAsShipping" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Adresse de facturation</h3>
          
          <div>
            <label for="billingAddress" class="block text-sm font-medium text-gray-700 mb-1">
              Adresse *
            </label>
            <input
              id="billingAddress"
              v-model="localFormData.billingAddress.address"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.billing_address }"
              @input="updateData"
              @blur="validate"
            />
            <p v-if="errors.billing_address" class="text-red-500 text-sm mt-1">{{ errors.billing_address }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="billingCity" class="block text-sm font-medium text-gray-700 mb-1">
                Ville *
              </label>
              <input
                id="billingCity"
                v-model="localFormData.billingAddress.city"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.billing_city }"
                @input="updateData"
                @blur="validate"
              />
              <p v-if="errors.billing_city" class="text-red-500 text-sm mt-1">{{ errors.billing_city }}</p>
            </div>

            <div>
              <label for="billingPostalCode" class="block text-sm font-medium text-gray-700 mb-1">
                Code postal *
              </label>
              <input
                id="billingPostalCode"
                v-model="localFormData.billingAddress.postalCode"
                type="text"
                maxlength="5"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.billing_postalCode }"
                @input="updateData"
                @blur="validate"
              />
              <p v-if="errors.billing_postalCode" class="text-red-500 text-sm mt-1">{{ errors.billing_postalCode }}</p>
            </div>

            <div>
              <label for="billingCountry" class="block text-sm font-medium text-gray-700 mb-1">
                Pays *
              </label>
              <select
                id="billingCountry"
                v-model="localFormData.billingAddress.country"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @change="updateData"
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Luxembourg">Luxembourg</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations de sécurité -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div class="flex items-start">
          <i class="fas fa-shield-alt text-green-600 mt-1 mr-3"></i>
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-1">Paiement sécurisé</h4>
            <p class="text-sm text-gray-600">
              Vos informations de paiement sont cryptées et sécurisées. Nous ne stockons aucune donnée bancaire.
            </p>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, computed, watch } from 'vue'

export default {
  name: 'PaymentInfoStep',
  props: {
    formData: {
      type: Object,
      required: true
    },
    shippingData: {
      type: Object,
      required: true
    },
    errors: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:form-data', 'validate'],
  setup(props, { emit }) {    // Copie locale des données
    const localFormData = reactive({ ...props.formData })

    // Mois pour la date d'expiration
    const months = [
      { value: '01', label: '01 - Janvier' },
      { value: '02', label: '02 - Février' },
      { value: '03', label: '03 - Mars' },
      { value: '04', label: '04 - Avril' },
      { value: '05', label: '05 - Mai' },
      { value: '06', label: '06 - Juin' },
      { value: '07', label: '07 - Juillet' },
      { value: '08', label: '08 - Août' },
      { value: '09', label: '09 - Septembre' },
      { value: '10', label: '10 - Octobre' },
      { value: '11', label: '11 - Novembre' },
      { value: '12', label: '12 - Décembre' }
    ]

    // Années pour la date d'expiration (10 années à partir de maintenant)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 10 }, (_, i) => currentYear + i)

    // Formater le numéro de carte avec des espaces
    const formattedCardNumber = computed({
      get() {
        return localFormData.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
      },
      set(value) {
        localFormData.cardNumber = value.replace(/\s/g, '')
      }
    })

    // Watcher pour synchroniser les changements
    watch(
      () => props.formData,
      (newData) => {
        Object.assign(localFormData, newData)
      },
      { deep: true }
    )

    // Gérer la saisie du numéro de carte
    const handleCardNumberInput = (event) => {
      let value = event.target.value.replace(/\s/g, '')
      // Limiter à 16 chiffres
      value = value.replace(/\D/g, '').slice(0, 16)
      localFormData.cardNumber = value
      updateData()
    }

    // Gérer la saisie du CVV
    const handleCvvInput = (event) => {
      let value = event.target.value.replace(/\D/g, '').slice(0, 3)
      localFormData.cvv = value
      updateData()
    }

    // Mettre à jour les données parentes
    const updateData = () => {
      emit('update:form-data', { ...localFormData })
    }    // Déclencher la validation
    const validate = () => {
      emit('validate')
    }

    return {
      localFormData,
      months,
      years,
      formattedCardNumber,
      handleCardNumberInput,
      handleCvvInput,
      updateData,
      validate
    }
  }
}
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
