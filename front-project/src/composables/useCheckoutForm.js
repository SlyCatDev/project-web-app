/**
 * Composable pour gérer le processus de paiement multi-étapes
 * Gère la navigation, la validation et les données de commande
 */

import { ref, reactive, computed } from 'vue'
import { useNotificationStore } from './useNotifications.js'

export function useCheckoutForm(cartData = {}) {
  const notificationStore = useNotificationStore()

  // État actuel de l'étape (0-indexé)
  const currentStep = ref(0)
  
  // Nombre total d'étapes
  const totalSteps = ref(3)
  
  // Données du formulaire de paiement
  const formData = reactive({
    // Étape 1: Informations de livraison
    shipping: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France',
      deliveryInstructions: ''
    },
    
    // Étape 2: Informations de paiement
    payment: {
      cardType: 'visa',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardHolderName: '',
      sameAsShipping: true,
      billingAddress: {
        address: '',
        city: '',
        postalCode: '',
        country: 'France'
      }
    },
    
    // Étape 3: Récapitulatif
    summary: {
      termsAccepted: false,
      newsletterSubscription: false
    },
    
    // Données du panier
    cart: cartData
  })

  // Erreurs de validation par étape
  const errors = reactive({
    step1: {},
    step2: {},
    step3: {}
  })

  // État de validation de chaque étape
  const stepValidation = reactive({
    step1: false,
    step2: false,
    step3: false
  })

  // Configuration des étapes
  const steps = computed(() => [
    {
      id: 1,
      title: 'Livraison',
      description: 'Informations de livraison',
      completed: stepValidation.step1
    },
    {
      id: 2,
      title: 'Paiement',
      description: 'Informations de paiement',
      completed: stepValidation.step2
    },
    {
      id: 3,
      title: 'Confirmation',
      description: 'Récapitulatif et validation',
      completed: stepValidation.step3
    }
  ])

  // Computed properties pour la navigation
  const isFirstStep = computed(() => currentStep.value === 0)
  const isLastStep = computed(() => currentStep.value === totalSteps.value - 1)
  const canGoNext = computed(() => {
    switch (currentStep.value) {
      case 0:
        return stepValidation.step1
      case 1:
        return stepValidation.step2
      case 2:
        return stepValidation.step3
      default:
        return false
    }
  })

  const progressPercentage = computed(() => {
    return Math.round(((currentStep.value + 1) / totalSteps.value) * 100)
  })

  // Fonctions de validation
  const validateStep1 = () => {
    errors.step1 = {}
    let isValid = true

    // Validation des champs obligatoires
    const requiredFields = {
      firstName: 'Le prénom est requis',
      lastName: 'Le nom est requis',
      email: 'L\'email est requis',
      phone: 'Le téléphone est requis',
      address: 'L\'adresse est requise',
      city: 'La ville est requise',
      postalCode: 'Le code postal est requis'
    }

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!formData.shipping[field] || formData.shipping[field].trim() === '') {
        errors.step1[field] = message
        isValid = false
      }
    }

    // Validation email
    if (formData.shipping.email && !/\S+@\S+\.\S+/.test(formData.shipping.email)) {
      errors.step1.email = 'Format d\'email invalide'
      isValid = false
    }

    // Validation code postal français
    if (formData.shipping.postalCode && !/^\d{5}$/.test(formData.shipping.postalCode)) {
      errors.step1.postalCode = 'Le code postal doit contenir 5 chiffres'
      isValid = false
    }

    stepValidation.step1 = isValid
    return isValid
  }

  const validateStep2 = () => {
    errors.step2 = {}
    let isValid = true

    // Validation des champs de paiement
    if (!formData.payment.cardHolderName || formData.payment.cardHolderName.trim() === '') {
      errors.step2.cardHolderName = 'Le nom sur la carte est requis'
      isValid = false
    }

    if (!formData.payment.cardNumber || formData.payment.cardNumber.replace(/\s/g, '').length < 16) {
      errors.step2.cardNumber = 'Numéro de carte invalide'
      isValid = false
    }

    if (!formData.payment.expiryMonth || !formData.payment.expiryYear) {
      errors.step2.expiry = 'Date d\'expiration requise'
      isValid = false
    }

    if (!formData.payment.cvv || formData.payment.cvv.length < 3) {
      errors.step2.cvv = 'Code CVV invalide'
      isValid = false
    }

    // Validation de l'adresse de facturation si différente
    if (!formData.payment.sameAsShipping) {
      const billingFields = {
        address: 'L\'adresse de facturation est requise',
        city: 'La ville de facturation est requise',
        postalCode: 'Le code postal de facturation est requis'
      }

      for (const [field, message] of Object.entries(billingFields)) {
        if (!formData.payment.billingAddress[field] || formData.payment.billingAddress[field].trim() === '') {
          errors.step2[`billing_${field}`] = message
          isValid = false
        }
      }
    }

    stepValidation.step2 = isValid
    return isValid
  }

  const validateStep3 = () => {
    errors.step3 = {}
    let isValid = true

    if (!formData.summary.termsAccepted) {
      errors.step3.terms = 'Vous devez accepter les conditions générales'
      isValid = false
    }

    stepValidation.step3 = isValid
    return isValid
  }

  // Fonctions de navigation
  const nextStep = () => {
    let canProceed = false

    switch (currentStep.value) {
      case 0:
        canProceed = validateStep1()
        break
      case 1:
        canProceed = validateStep2()
        break
      case 2:
        canProceed = validateStep3()
        break
    }

    if (canProceed && currentStep.value < totalSteps.value - 1) {
      currentStep.value++
    } else if (!canProceed) {
      notificationStore.showError('Veuillez corriger les erreurs avant de continuer')
    }
  }

  const previousStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < totalSteps.value) {
      currentStep.value = stepIndex
    }
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    currentStep.value = 0
    
    // Réinitialiser les données
    formData.shipping = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France',
      deliveryInstructions: ''
    }
    
    formData.payment = {
      cardType: 'visa',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardHolderName: '',
      sameAsShipping: true,
      billingAddress: {
        address: '',
        city: '',
        postalCode: '',
        country: 'France'
      }
    }
    
    formData.summary = {
      termsAccepted: false,
      newsletterSubscription: false
    }

    // Réinitialiser les erreurs et validations
    Object.keys(errors).forEach(key => {
      errors[key] = {}
    })
    
    Object.keys(stepValidation).forEach(key => {
      stepValidation[key] = false
    })
  }

  // Fonction pour obtenir un résumé de la commande
  const getOrderSummary = () => {
    return {
      shipping: formData.shipping,
      payment: {
        cardType: formData.payment.cardType,
        cardNumber: `**** **** **** ${formData.payment.cardNumber.slice(-4)}`,
        cardHolderName: formData.payment.cardHolderName
      },
      cart: formData.cart,
      total: formData.cart.totalAmount || 0
    }
  }

  return {
    // État
    currentStep,
    totalSteps,
    formData,
    errors,
    stepValidation,
    
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
    
    // Autres méthodes
    resetForm,
    getOrderSummary
  }
}
