import { nextTick } from 'vue'

/**
 * Composable pour gérer les animations et transitions
 */
export function useAnimations() {
  
  /**
   * Anime l'apparition d'une image avec transition
   * @param {Event} event - L'événement de chargement de l'image
   * @param {string} className - Classe CSS optionnelle à ajouter
   */
  const handleImageLoad = (event, className = 'loaded') => {
    if (event && event.target) {
      event.target.classList.add(className)
    }
  }

  /**
   * Gère les erreurs d'image avec animation
   * @param {Event} event - L'événement d'erreur
   * @param {string} fallbackUrl - URL de l'image de remplacement
   */
  const handleImageError = (event, fallbackUrl = 'https://placehold.co/300') => {
    if (event && event.target) {
      event.target.src = fallbackUrl
      event.target.classList.add('loaded')
    }
  }

  /**
   * Anime une liste d'éléments avec un délai progressif
   * @param {Array} elements - Liste des éléments à animer
   * @param {string} animationClass - Classe d'animation à appliquer
   * @param {number} delay - Délai entre chaque élément (ms)
   */
  const animateList = async (elements, animationClass = 'animate-fade-in-up', delay = 100) => {
    await nextTick()
    
    elements.forEach((element, index) => {
      setTimeout(() => {
        if (element) {
          element.classList.add(animationClass)
        }
      }, index * delay)
    })
  }

  /**
   * Anime l'entrée d'un élément
   * @param {HTMLElement} element - Élément à animer
   * @param {string} animationClass - Classe d'animation
   * @param {number} delay - Délai avant animation
   */
  const animateElement = (element, animationClass = 'animate-fade-in-up', delay = 0) => {
    if (!element) return

    setTimeout(() => {
      element.classList.add(animationClass)
    }, delay)
  }

  /**
   * Réinitialise les animations d'un élément
   * @param {HTMLElement} element - Élément à réinitialiser
   */
  const resetAnimations = (element) => {
    if (!element) return

    const animationClasses = [
      'animate-fade-in-up',
      'animate-fade-in-scale',
      'animate-slide-in-right',
      'animate-slide-in-left',
      'loaded'
    ]

    animationClasses.forEach(className => {
      element.classList.remove(className)
    })
  }

  /**
   * Transition pour les changements de route
   */
  const pageTransitionConfig = {
    name: 'page',
    mode: 'out-in',
    duration: 400
  }

  /**
   * Configuration pour les transitions de liste
   */
  const listTransitionConfig = {
    name: 'list',
    tag: 'div',
    duration: 400
  }

  return {
    handleImageLoad,
    handleImageError,
    animateList,
    animateElement,
    resetAnimations,
    pageTransitionConfig,
    listTransitionConfig
  }
}