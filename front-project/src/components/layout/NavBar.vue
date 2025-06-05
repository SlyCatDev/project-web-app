<template>
  <header class="navbar">
    <div class="container navbar-container">
      <!-- Logo -->
      <div class="navbar-logo">
        <router-link to="/" class="logo-link">
          <img src="@/assets/logo.svg" alt="logo" class="w-14 h-auto" />
        </router-link>
      </div>

      <!-- Mobile Menu Toggle -->
      <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
        <span class="mobile-menu-icon">☰</span>
      </button>

      <!-- Navigation Links -->
      <nav class="navbar-menu" :class="{ 'is-open': isMobileMenuOpen }">
        <ul class="menu-items">
          <li v-for="item in menuItems" :key="item.text" class="menu-item">
            <router-link :to="item.path" class="menu-link" :class="{ 'is-highlighted': item.isHighlighted }">
              {{ item.text }}
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Actions (Search, Auth & Cart) -->
      <div class="navbar-actions">
        <button class="action-button search-button" aria-label="Search">
          <span class="search-icon">🔍</span>
        </button>
        
        <!-- Boutons d'authentification -->
        <div class="auth-actions">
          <div v-if="isAuthenticated" class="user-menu">
            <router-link to="/account" class="action-button account-button">
              Mon compte
            </router-link>
            <button @click="handleLogout" class="action-button logout-button">
              Déconnexion
            </button>
          </div>
          <div v-else class="auth-buttons">
            <router-link to="/signIn" class="action-button login-button">
              Connexion
            </router-link>
            <router-link to="/register" class="action-button register-button">
              Inscription
            </router-link>
          </div>
        </div>
        
        <router-link to="/cart" class="action-button cart-button">
          <span class="cart-icon">🛒</span>
          <span v-if="cartItemsCount > 0" class="cart-badge">{{ cartItemsCount }}</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
import { useCartStore } from '@/stores/cart.js';
import { useAuth } from '@/composables/useAuth.js';
import { useNotificationStore } from '@/composables/useNotifications.js';

export default {
  name: 'NavBar',
  setup() {
    const cartStore = useCartStore();
    const { isAuthenticated, user, logout } = useAuth();
    const notificationStore = useNotificationStore();
    
    const handleLogout = () => {
      logout();
      notificationStore.showSuccess('Déconnexion réussie !');
    };
    
    return {
      cartStore,
      isAuthenticated,
      user,
      handleLogout
    };
  },
  data() {
    return {
      menuItems: [
        { text: 'Accueil', path: '/' },
        { text: 'Produits', path: '/products' },
        // { text: 'Accessoires', path: '/accessories' },
      ],
      isMobileMenuOpen: false
    };
  },
  computed: {
    cartItemsCount() {
      return this.cartStore.itemCount;
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }
  }
};
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.navbar-logo {
  flex-shrink: 0;
}

.logo-link {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-text {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 700;
}

.mobile-menu-toggle {
  display: block;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--text-color);
  padding: 0.5rem;
}

.navbar-menu {
  width: 100%;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.navbar-menu.is-open {
  max-height: 300px;
}

.menu-items {
  list-style-type: none;
  margin: 1rem 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.menu-item {
  margin: 0.5rem 0;
}

.menu-link {
  color: var(--text-light);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.2s ease;
  display: block;
  padding: 0.5rem 0;
}

.menu-link:hover {
  color: var(--primary-color);
}

.menu-link.is-highlighted {
  color: #ef4444;
}

.navbar-actions {
  display: flex;
  align-items: center;
}

.action-button {
  background-color: transparent;
  border: none;
  padding: 0.5rem;
  margin-left: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: var(--text-light);
  text-decoration: none;
}

.action-button:hover {
  color: var(--primary-color);
}

.search-icon, .cart-icon {
  font-size: 1.25rem;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Styles pour l'authentification */
.auth-actions {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-welcome {
  font-size: 0.9rem;
  color: var(--text-light);
  font-weight: 500;
}

.login-button {
  background-color: var(--primary-color);
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.login-button:hover {
  background-color: var(--primary-color-dark, #1d4ed8);
}

.register-button {
  background-color: #10b981;
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.register-button:hover {
  background-color: #059669;
}

.logout-button {
  background-color: #ef4444;
  color: white !important;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.logout-button:hover {
  background-color: #dc2626;
}

.account-button {
  background-color: #6366f1;
  color: white !important;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.account-button:hover {
  background-color: #4f46e5;
}

/* Styles pour desktop */
@media (min-width: 768px) {
  .mobile-menu-toggle {
    display: none;
  }
  
  .navbar-menu {
    width: auto;
    max-height: none;
    overflow: visible;
    margin-left: 2rem;
  }
  
  .menu-items {
    flex-direction: row;
    margin: 0;
  }
  
  .menu-item {
    margin: 0 1rem;
  }
  
  .menu-link {
    padding: 0;
  }
}

@media (min-width: 1024px) {
  .navbar-container {
    padding: 0 2rem;
  }
  
  .menu-link {
    font-size: 1.1rem;
  }
  
  .logo-text {
    font-size: 1.75rem;
  }
}
</style>