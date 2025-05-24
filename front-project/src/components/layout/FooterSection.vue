<script>
export default {
  name: 'FooterSection',
  data() {
    return {
      usefulLinks: [
        { text: 'Legal & Privacy', path: '/legal' },
        { text: 'Contact', path: '/contact' },
        { text: 'Gift Card', path: '/gift-card' },
        { text: 'Customer Service', path: '/customer-service' },
        { text: 'My Account', path: '/account' }
      ],
      shopLinks: [
        { text: 'Télévisions', path: '/products/tv' },
        { text: 'Washing Machines', path: '/products/washing-machines' },
        { text: 'Air Conditioning', path: '/products/air-conditioning' },
        { text: 'Laptops', path: '/products/laptops' },
        { text: 'Accessoires', path: '/products/accessories' }
      ],
      accountLinks: [
        { text: 'My Profile', path: '/account/profile' },
        { text: 'My Order History', path: '/account/orders' },
        { text: 'My Wish List', path: '/account/wishlist' },
        { text: 'Order Tracking', path: '/account/track' },
        { text: 'Shopping Cart', path: '/cart' }
      ],
      companyLinks: [
        { text: 'About Us', path: '/about' },
        { text: 'Careers', path: '/careers' },
        { text: 'Our Blog', path: '/blog' },
        { text: 'Affiliate', path: '/affiliate' },
        { text: 'Contact Us', path: '/contact' }
      ],
      contactInfo: {
        phone: '0241123123',
        weekdayHours: '09:00-19:00',
        weekendHours: '09:00 - 19:00'
      },
      socialLinks: [
        { icon: 'facebook', url: 'https://facebook.com' },
        { icon: 'twitter', url: 'https://twitter.com' },
        { icon: 'instagram', url: 'https://instagram.com' },
        { icon: 'linkedin', url: 'https://linkedin.com' }
      ],
      paymentMethods: ['paypal', 'visa', 'mastercard']
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
};
</script>

<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Footer Links Section -->
      <div class="footer-links-section">
        <div class="footer-column">
          <h3 class="footer-title">Useful Links</h3>
          <ul class="footer-menu">
            <li v-for="link in usefulLinks" :key="link.text">
              <router-link :to="link.path" class="footer-link">{{ link.text }}</router-link>
            </li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h3 class="footer-title">Shop</h3>
          <ul class="footer-menu">
            <li v-for="link in shopLinks" :key="link.text">
              <router-link :to="link.path" class="footer-link">{{ link.text }}</router-link>
            </li>
          </ul>
        </div>

        <div class="footer-column">
          <h3 class="footer-title">My Account</h3>
          <ul class="footer-menu">
            <li v-for="link in accountLinks" :key="link.text">
              <router-link :to="link.path" class="footer-link">{{ link.text }}</router-link>
            </li>
          </ul>
        </div>

        <div class="footer-column">
          <h3 class="footer-title">Company</h3>
          <ul class="footer-menu">
            <li v-for="link in companyLinks" :key="link.text">
              <router-link :to="link.path" class="footer-link">{{ link.text }}</router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Customer Service Section -->
      <div class="customer-service">
        <h3 class="footer-title">Need Help? Call Us Now</h3>
        <p class="service-phone">{{ contactInfo.phone }}</p>
        <p class="service-hours">Monday - Friday: {{ contactInfo.weekdayHours }}</p>
        <p class="service-hours">Saturday: {{ contactInfo.weekendHours }}</p>
        
        <div class="social-links">
          <a v-for="social in socialLinks" 
             :key="social.icon" 
             :href="social.url" 
             class="social-link" 
             target="_blank" 
             rel="noopener noreferrer">
            <span class="social-icon">{{ social.icon }}</span>
          </a>
        </div>
      </div>

      <!-- Footer Bottom - Copyright & Payment -->
      <div class="footer-bottom">
        <p class="copyright">
          Copyright © {{ currentYear }} Boutique. All Rights Reserved.
        </p>
        
        <div class="payment-methods">
          <span class="payment-title">Nous acceptons:</span>
          <div class="payment-icons">
            <span v-for="method in paymentMethods" :key="method" class="payment-icon">
              {{ method }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #ffffff;
  border-top: 1px solid #f3f4f6;
  padding: 4rem 0 2rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-links-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.footer-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
}

.footer-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-menu li {
  margin-bottom: 0.75rem;
}

.footer-link {
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #3b82f6;
}

.customer-service {
  margin-bottom: 3rem;
}

.service-phone {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.service-hours {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f3f4f6;
  color: #4b5563;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.social-link:hover {
  background-color: #3b82f6;
  color: #ffffff;
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid #f3f4f6;
}

.copyright {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.payment-methods {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.payment-title {
  color: #6b7280;
  font-size: 0.875rem;
}

.payment-icons {
  display: flex;
  gap: 0.5rem;
}

.payment-icon {
  font-size: 1.5rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .footer-links-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
  }
  
  .payment-methods {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .footer-links-section {
    grid-template-columns: 1fr;
  }
}
</style>