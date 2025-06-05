import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    message: null,
    type: 'success', // 'success', 'error', 'warning', 'info'
    isVisible: false,
    timeout: null
  }),

  actions: {
    showNotification(message, type = 'success', duration = 3000) {
      // Effacer le timeout précédent s'il existe
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      
      // Afficher la nouvelle notification
      this.message = message
      this.type = type
      this.isVisible = true
      this.timeout = null
      
      // Masquer automatiquement après la durée spécifiée
      if (duration > 0) {
        this.timeout = setTimeout(() => {
          this.hideNotification()
        }, duration)
      }
    },
    
    hideNotification() {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      
      this.message = null
      this.type = 'success'
      this.isVisible = false
      this.timeout = null
    },
    
    showSuccess(message, duration = 3000) {
      this.showNotification(message, 'success', duration)
    },
    
    showError(message, duration = 5000) {
      this.showNotification(message, 'error', duration)
    },
    
    showWarning(message, duration = 4000) {
      this.showNotification(message, 'warning', duration)
    },
    
    showInfo(message, duration = 3000) {
      this.showNotification(message, 'info', duration)
    }
  }
})

// Composable pour une utilisation facile
export const useNotifications = () => {
  const store = useNotificationStore()
  
  return {
    notification: store,
    showNotification: store.showNotification,
    hideNotification: store.hideNotification,
    showSuccess: store.showSuccess,
    showError: store.showError,
    showWarning: store.showWarning,
    showInfo: store.showInfo
  }
}
