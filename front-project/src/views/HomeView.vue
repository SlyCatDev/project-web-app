<template>
  <div class="home">
    <NavBar />
    
    <main>
      <HeroBanner 
        :title="heroBannerContent.title"
        :subtitle="heroBannerContent.subtitle"
        :description="heroBannerContent.description"
        :button-text="heroBannerContent.buttonText"
        :image="heroBannerContent.image"
        @button-click="handleAddToCart"
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
    </main>
    
    <FooterSection />
  </div>
</template>

<script>
import NavBar from '@/components/layout/NavBar.vue';
import HeroBanner from '@/components/layout/HeroBanner.vue';
import TrendingProducts from '@/components/products/TrendingProducts.vue';
import FooterSection from '@/components/layout/FooterSection.vue';
import ApiHealthCheck from '@/components/ApiHealthCheck.vue';

export default {
  name: 'HomeView',
  components: {
    NavBar,
    HeroBanner,
    TrendingProducts,
    FooterSection,
    ApiHealthCheck
  },
  data() {
    return {
      heroBannerContent: {
        title: 'Nouvelle collection',
        subtitle: 'Trending Products',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut magna, quis diam et, cursus placerat ipsum. In nibh lacus eleifend tristique quam et, consequat semper.',
        buttonText: 'Ajouter au panier',
        image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
      }
    };
  },
  methods: {
    handleAddToCart(product) {
      console.log('Product added to cart:', product);
      // TO-DO : implémenter la logique d'ajout au panier
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
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>
