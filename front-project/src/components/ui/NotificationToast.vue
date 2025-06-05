<template>
  <transition name="notification" appear>
    <div
      v-if="notificationStore.isVisible"
      class="notification"
      :class="notificationClasses"
      @click="notificationStore.hideNotification"
    >
      <div class="notification-content">
        <div class="notification-icon">
          <span v-if="notificationStore.type === 'success'">✅</span>
          <span v-else-if="notificationStore.type === 'error'">❌</span>
          <span v-else-if="notificationStore.type === 'warning'">⚠️</span>
          <span v-else-if="notificationStore.type === 'info'">ℹ️</span>
        </div>
        <div class="notification-message">
          {{ notificationStore.message }}
        </div>
        <button
          class="notification-close"
          @click="notificationStore.hideNotification"
          aria-label="Fermer la notification"
        >
          ×
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { useNotificationStore } from '@/composables/useNotifications.js';

export default {
  name: 'NotificationToast',
  setup() {
    const notificationStore = useNotificationStore();
    
    return {
      notificationStore
    };
  },
  computed: {
    notificationClasses() {
      return [
        'notification',
        `notification--${this.notificationStore.type}`
      ];
    }
  }
};
</script>

<style scoped>
.notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  min-width: 300px;
  max-width: 400px;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border-left: 4px solid;
}

.notification--success {
  border-left-color: #10b981;
}

.notification--error {
  border-left-color: #ef4444;
}

.notification--warning {
  border-left-color: #f59e0b;
}

.notification--info {
  border-left-color: #3b82f6;
}

.notification-content {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 0.75rem;
}

.notification-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
}

.notification-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.notification-close:hover {
  background-color: #f3f4f6;
  color: #374151;
}

/* Animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Responsive */
@media (max-width: 640px) {
  .notification {
    left: 1rem;
    right: 1rem;
    min-width: auto;
    max-width: none;
  }
}
</style>
