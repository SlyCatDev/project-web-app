import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ProductCard from '../ProductCard.vue'

describe('ProductCard.vue', () => {
  const mockProduct = {
    id: 1,
    title: 'Super produit avec un nom très très long pour tester la troncature',
    price: 19.99,
    image: 'https://placehold.co/150',
    category: 'electronics'
  };

  it('affiche le titre tronqué si trop long', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    });

    const displayedTitle = wrapper.find('.product-title span').text();
    expect(displayedTitle.endsWith('...')).toBe(true);
    expect(displayedTitle.length).toBeLessThanOrEqual(50);
  });

  it('émet un événement "add-to-cart" quand on clique sur le bouton', async () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    });

    const button = wrapper.find('.cart-button');
    await button.trigger('click');

    expect(wrapper.emitted()['add-to-cart']).toBeTruthy();
    expect(wrapper.emitted()['add-to-cart'][0]).toEqual([mockProduct]);
  });

  it('affiche un placeholder si loading est true', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
        loading: true
      }
    });

    expect(wrapper.find('.product-image').exists()).toBe(false);
    expect(wrapper.find('.product-image-placeholder').exists()).toBe(true);
  });

  it('formate correctement le prix', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    });

    const priceText = wrapper.find('.product-price').text();
    expect(priceText).toBe('$19.99');
  });
});
