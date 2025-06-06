<template>
  <section class="hero-banner">
    <div class="container hero-container">
      <div class="hero-content">
        <div class="hero-text">
          <span class="hero-subtitle">{{ subtitle }}</span>
          <h1 class="hero-title">{{ title }}</h1>
          <p class="hero-description">{{ description }}</p>
          <BaseButton 
            :to="buttonLink" 
            variant="primary" 
            size="large"
            @click="onButtonClick"
            class="hero-button"
          >
            {{ buttonText }}
          </BaseButton>
        </div>
        
        <div class="hero-image-container">
          <img :src="image" alt="Hero image" class="hero-image" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseButton from '@/components/ui/BaseButton.vue';

export default {
  name: 'HeroBanner',
  components: {
    BaseButton
  },
  props: {
    title: {
      type: String,
      default: 'Nouvelle collection'
    },
    subtitle: {
      type: String,
      default: 'Trending Products'
    },
    description: {
      type: String,
      default: 'Des supers belles chemises pour assurer au CDA'
    },
    buttonText: {
      type: String,
      default: 'Ajouter au panier'
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
    },
    buttonLink: {
      type: String,
      default: '/products'
    }
  },
  methods: {
    onButtonClick() {
      this.$emit('button-click');
    }
  }
};
</script>

<style scoped>
.hero-banner {
  background-color: #f9fafb;
  padding: 2rem 0;
  margin-bottom: 4rem;
}

.hero-container {
  position: relative;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero-text {
  flex: 1;
  order: 2;
  text-align: center;
}

.hero-subtitle {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-color);
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.hero-description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-light);
  margin-bottom: 2rem;
}

.hero-button {
  min-width: 180px;
}

.hero-image-container {
  flex: 1;
  height: 300px;
  order: 1;
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Styles pour tablette */
@media (min-width: 768px) {
  .hero-content {
    flex-direction: row;
    align-items: center;
  }
  
  .hero-text {
    order: 1;
    text-align: left;
    padding-right: 2rem;
  }
  
  .hero-image-container {
    order: 2;
    height: 400px;
  }
}

/* Styles pour desktop */
@media (min-width: 1024px) {
  .hero-banner {
    padding: 4rem 0;
  }
  
  .hero-title {
    font-size: 3rem;
  }
  
  .hero-description {
    font-size: 1.125rem;
    max-width: 90%;
  }
  
  .hero-image-container {
    height: 500px;
  }
}

/* Styles pour grand écran */
@media (min-width: 1440px) {
  .hero-content {
    gap: 4rem;
  }
  
  .hero-title {
    font-size: 3.5rem;
  }
  
  .hero-description {
    max-width: 80%;
  }
  
  .hero-image-container {
    height: 600px;
  }
}
</style>