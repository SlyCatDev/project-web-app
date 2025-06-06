<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Informations de livraison</h2>
      <p class="text-gray-600">Où souhaitez-vous recevoir votre commande ?</p>
    </div>

    <form @submit.prevent="validate" class="space-y-6">
      <!-- Nom et prénom -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
            Prénom *
          </label>
          <input
            id="firstName"
            v-model="localFormData.firstName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.firstName }"
            @input="updateData"
            @blur="validate"
          />
          <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">{{ errors.firstName }}</p>
        </div>

        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <input
            id="lastName"
            v-model="localFormData.lastName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.lastName }"
            @input="updateData"
            @blur="validate"
          />
          <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">{{ errors.lastName }}</p>
        </div>
      </div>

      <!-- Email et téléphone -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id="email"
            v-model="localFormData.email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.email }"
            @input="updateData"
            @blur="validate"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
            Téléphone *
          </label>
          <input
            id="phone"
            v-model="localFormData.phone"
            type="tel"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.phone }"
            @input="updateData"
            @blur="validate"
          />
          <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
        </div>
      </div>

      <!-- Adresse -->
      <div>
        <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
          Adresse complète *
        </label>
        <input
          id="address"
          v-model="localFormData.address"
          type="text"
          placeholder="Numéro et nom de rue"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.address }"
          @input="updateData"
          @blur="validate"
        />
        <p v-if="errors.address" class="text-red-500 text-sm mt-1">{{ errors.address }}</p>
      </div>

      <!-- Ville, code postal et pays -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
            Ville *
          </label>
          <input
            id="city"
            v-model="localFormData.city"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.city }"
            @input="updateData"
            @blur="validate"
          />
          <p v-if="errors.city" class="text-red-500 text-sm mt-1">{{ errors.city }}</p>
        </div>

        <div>
          <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-1">
            Code postal *
          </label>
          <input
            id="postalCode"
            v-model="localFormData.postalCode"
            type="text"
            placeholder="75001"
            maxlength="5"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.postalCode }"
            @input="updateData"
            @blur="validate"
          />
          <p v-if="errors.postalCode" class="text-red-500 text-sm mt-1">{{ errors.postalCode }}</p>
        </div>

        <div>
          <label for="country" class="block text-sm font-medium text-gray-700 mb-1">
            Pays *
          </label>
          <select
            id="country"
            v-model="localFormData.country"
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

      <!-- Instructions de livraison -->
      <div>
        <label for="deliveryInstructions" class="block text-sm font-medium text-gray-700 mb-1">
          Instructions de livraison (optionnel)
        </label>
        <textarea
          id="deliveryInstructions"
          v-model="localFormData.deliveryInstructions"
          rows="3"
          placeholder="Code de l'immeuble, étage, informations complémentaires..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          @input="updateData"
        ></textarea>
      </div>

      <!-- Informations de livraison -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <i class="fas fa-truck text-blue-600 mt-1 mr-3"></i>
          <div>
            <h4 class="text-sm font-medium text-blue-900 mb-1">Livraison gratuite</h4>
            <p class="text-sm text-blue-700">
              Livraison estimée sous 3 jours ouvrés pour la France métropolitaine.
            </p>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'

export default {
  name: 'ShippingInfoStep',
  props: {
    formData: {
      type: Object,
      required: true
    },
    errors: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:form-data', 'validate'],
  setup(props, { emit }) {
    // Copie locale des données pour éviter la mutation directe des props
    const localFormData = reactive({ ...props.formData })

    // Watcher pour synchroniser les changements
    watch(
      () => props.formData,
      (newData) => {
        Object.assign(localFormData, newData)
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

    return {
      localFormData,
      updateData,
      validate
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
