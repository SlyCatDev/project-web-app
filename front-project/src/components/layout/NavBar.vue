<script>
export default {
  name: 'NavBar',
  data() {
    return {
      menuItems: [
        { text: 'Accueil', path: '/' },
        { text: 'Produits', path: '/products' },
        { text: 'Accessoires', path: '/accessories' },
        { text: 'new', path: '/new', isHighlighted: true }
      ],
      cartItemsCount: 0,
      isMobileMenuOpen: false
    };
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }
  }
};
</script>

<template>
  <header class="navbar">
    <div class="container navbar-container">
      <!-- Logo -->
      <div class="navbar-logo">
        <router-link to="/" class="logo-link">
          <span class="logo-text">Boutique</span>
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

      <!-- Actions (Search & Cart) -->
      <div class="navbar-actions">
        <button class="action-button search-button" aria-label="Search">
          <span class="search-icon">🔍</span>
        </button>
        <router-link to="/cart" class="action-button cart-button">
          <span class="cart-icon">🛒</span>
          <span v-if="cartItemsCount > 0" class="cart-badge">{{ cartItemsCount }}</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

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