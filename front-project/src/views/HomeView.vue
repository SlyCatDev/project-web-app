<template>
  <div class="home">
    <HeroBanner 
      :title="heroBannerContent.title"
      :subtitle="heroBannerContent.subtitle"
      :description="heroBannerContent.description"
      :button-text="heroBannerContent.buttonText"
      :image="heroBannerContent.image"
    />
    
    <TrendingProducts 
      title="Produits tendance" 
      :limit="4"
      @add-to-cart="handleAddToCart"
    />
    
    <!-- Composant de test API (uniquement en développement) -->
    <div v-if="isDev" class="container mx-auto px-4 py-8">
      <ApiHealthCheck />
    </div>
  </div>
</template>

<script>
import HeroBanner from '@/components/layout/HeroBanner.vue';
import TrendingProducts from '@/components/products/TrendingProducts.vue';
import ApiHealthCheck from '@/components/ApiHealthCheck.vue';
import { useCartStore } from '@/stores/cart.js';
import { useNotifications } from '@/composables/useNotifications.js';

export default {
  name: 'HomeView',
  components: {
    HeroBanner,
    TrendingProducts,
    ApiHealthCheck
  },
  setup() {
    const cartStore = useCartStore();
    const { showSuccess, showError } = useNotifications();
    
    return {
      cartStore,
      showSuccess,
      showError
    };
  },
  data() {
    return {
      heroBannerContent: {
        title: 'Nouvelle collection',
        subtitle: 'Chemises passage CDA',
        description: 'De belle chemise pour assurer votre style pour une soutenance CDA',
        buttonText: 'Voir les produits',
        image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
      }
    };
  },
  methods: {
    handleAddToCart(product) {
      const success = this.cartStore.addToCart(product, 1);
      
      if (success) {
        // Afficher une notification de succès
        this.showSuccess(`${product.title} ajouté au panier !`);
      } else {
        // Afficher une notification d'erreur
        this.showError('Erreur lors de l\'ajout au panier');
        console.error('Erreur lors de l\'ajout au panier');
      }
    }
  },
  computed: {
    isDev() {
      return import.meta.env.DEV;
    }
  }
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
}
</style>
