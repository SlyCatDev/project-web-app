<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Footer Links Section -->
      <div class="footer-links-section">
        <!-- <div class="footer-column">
          <h3 class="footer-title">Liens utiles</h3>
          <ul class="footer-menu">
            <li v-for="link in usefulLinks" :key="link.text">
              <router-link :to="link.path" class="footer-link">{{ link.text }}</router-link>
            </li>
          </ul>
        </div> -->
        
        <div class="footer-column">
          <h3 class="footer-title">Mock&Shop</h3>
          <ul class="footer-menu">
            <li v-for="link in shopLinks" :key="link.text">
              <router-link :to="link.path" class="footer-link">{{ link.text }}</router-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-logo">
        <!-- Logo -->
        <router-link to="/">
          <img src="@/assets/logo.svg" alt="logo" class="w-32 h-auto" />
        </router-link>
      </div>

      <!-- Customer Service Section -->
      <div class="customer-service">
        <h3 class="footer-title">Besoin d'aide ? Ne nous appelez pas</h3>
        <p class="service-phone">{{ contactInfo.phone }}</p>
        <p class="service-hours">Lundi - Vendredi: {{ contactInfo.weekdayHours }}</p>
        <p class="service-hours">Samedi: {{ contactInfo.weekendHours }}</p>
        
        <div class="social-links">
          <a v-for="social in socialLinks" 
             :key="social.icon" 
             :href="social.url" 
             class="social-link" 
             target="_blank" 
             rel="noopener noreferrer">
            <span class="social-icon" v-html="social.svg"></span>
          </a>
        </div>
      </div>

      <!-- Footer Bottom - Copyright & Payment -->
      <div class="footer-bottom">
        <p class="copyright">
          Copyright © {{ currentYear }} Mock&Shop. All Rights Reserved.
        </p>
        
        <div class="payment-methods">
          <span class="payment-title">Méthodes de paiement :</span>
          <p>Rien</p>
          <!-- <div class="payment-icons">
            <span v-for="method in paymentMethods" :key="method.name" class="payment-icon">
              <span v-html="method.svg"></span>
            </span>
          </div> -->
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterSection',
  data() {
    return {
      // usefulLinks: [
      //   { text: 'Contact', path: '/contact' },
      //   { text: 'Mon Compte', path: '/account' }
      // ],
      shopLinks: [
        { text: 'Produits', path: '/products' },
        { text: 'Panier', path: '/cart' }
      ],
      // companyLinks: [
      //   { text: 'À propos', path: '/about' },
      //   { text: 'Contact', path: '/contact' }
      // ],
      contactInfo: {
        phone: '02 41 42 42 42',
        weekdayHours: '10:00 - 11:00',
        weekendHours: '09:00 - 10:00'
      },
      socialLinks: [
        { 
          icon: 'facebook', 
          url: 'https://facebook.com',
          svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
        },
        { 
          icon: 'twitter', 
          url: 'https://x.com',
          svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>'
        },
        { 
          icon: 'instagram', 
          url: 'https://instagram.com',
          svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>'
        },
        { 
          icon: 'linkedin', 
          url: 'https://linkedin.com',
          svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
        }
      ],
      paymentMethods: [
        {
          name: 'paypal',
          svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.26-.93 4.778-4.005 7.201-9.138 7.201h-2.838a.646.646 0 0 0-.636.747l-.84 5.338c-.065.416.263.78.68.78h4.180c.408 0 .756-.298.822-.706l.328-2.106h2.175c3.678 0 6.553-1.496 7.388-5.828.362-1.873.234-3.441-.493-4.545z"/></svg>'
        },
        {
          name: 'visa',
          svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.539 9.186a4.155 4.155 0 0 0-1.451-.251c-1.6 0-2.73.806-2.738 1.963-.01.85.803 1.329 1.418 1.613.631.292 0.842.48.840.742-.004.397-.504.577-.969.577-.65 0-.998-.094-1.533-.32l-.21-.099-.227 1.332c.389.162 1.09.301 1.814.313 1.701 0 2.813-.801 2.826-2.032.014-.679-.426-1.192-1.352-1.616-.563-.275-.912-.459-.912-.738 0-.247.299-.511.943-.511a2.95 2.95 0 0 1 1.196.248l.144.068.227-1.287-.039-.019zm2.663 2.853c.148-.399.718-1.888.718-1.888-.010.018.148-.399.239-.658l.122.58s.344 1.607.415 1.966h-1.494zm2.157-2.85h-1.146c-.355 0-.619.098-.775.458L17.564 14.4h1.701l.337-.9h2.089l.197.9h1.503L21.359 9.189l-.068.019zm-13.735.05L9.564 14.4h1.615L9.801 9.239H8.187l-.058.02zm-3.159 3.75c.068-.358.435-1.804.435-1.804L7.361 9.24a.42.42 0 0 0-.473-.24H4.592l-.026.179c1.302.34 2.379.904 3.04 1.622-.01-.001.426 2.084.426 2.084h1.737z"/></svg>'
        },
        {
          name: 'mastercard',
          svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.343 18.031c.058.049.12.098.181.146-1.177.783-2.59 1.238-4.107 1.238C4.333 19.415 1.5 16.582 1.5 13.5s2.833-5.915 6.417-5.915c1.518 0 2.931.455 4.107 1.238-.061.048-.123.097-.181.146C10.635 9.839 9.75 11.574 9.75 13.5s.885 3.661 2.093 4.531zm.125-8.531c.058-.049.12-.098.181-.146C10.472 8.571 9.059 8.116 7.541 8.116 4.333 8.116 1.5 10.949 1.5 14.03s2.833 5.915 6.041 5.915c1.518 0 2.931-.455 4.107-1.238-.061-.048-.123-.097-.181-.146C10.159 17.691 9.274 15.956 9.274 14.03s.885-3.661 2.194-4.531zM22.5 13.5c0 3.083-2.833 5.915-6.417 5.915-1.518 0-2.931-.455-4.107-1.238.061-.048.123-.097.181-.146 1.208-.87 2.093-2.605 2.093-4.531s-.885-3.661-2.093-4.531c-.058-.049-.12-.098-.181-.146 1.176-.783 2.589-1.238 4.107-1.238C19.667 7.585 22.5 10.417 22.5 13.5z"/></svg>'
        }
      ]
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
};
</script>

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
  width: 40px;
  height: 40px;
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

.social-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-icon svg {
  width: 100%;
  height: 100%;
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 24px;
  padding: 4px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  color: #374151;
  transition: all 0.2s ease;
}

.payment-icon:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.payment-icon span {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-icon svg {
  width: 100%;
  height: 100%;
  max-width: 32px;
  max-height: 20px;
}

@media (max-width: 768px) {
  .footer-links-section {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
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