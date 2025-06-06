import { describe, it, expect } from 'vitest';
import { formatPrice, formatPriceCompact } from '@/utils/currency.js';

describe('Currency Utils', () => {
  describe('formatPrice', () => {
    it('formate correctement un prix avec devise par défaut', () => {
      expect(formatPrice(19.99)).toBe('19.99 €');
      expect(formatPrice('29.5')).toBe('29.50 €');
      expect(formatPrice(0)).toBe('0.00 €');
    });

    it('formate correctement un prix avec devise personnalisée', () => {
      expect(formatPrice(19.99, '$')).toBe('19.99 $');
      expect(formatPrice(29.5, 'USD')).toBe('29.50 USD');
    });

    it('gère les valeurs invalides', () => {
      expect(formatPrice('invalid')).toBe('0.00 €');
      expect(formatPrice(null)).toBe('0.00 €');
      expect(formatPrice(undefined)).toBe('0.00 €');
    });
  });

  describe('formatPriceCompact', () => {
    it('formate correctement un prix sans espace', () => {
      expect(formatPriceCompact(19.99)).toBe('19.99€');
      expect(formatPriceCompact('29.5')).toBe('29.50€');
      expect(formatPriceCompact(0)).toBe('0.00€');
    });

    it('gère les valeurs invalides', () => {
      expect(formatPriceCompact('invalid')).toBe('0.00€');
      expect(formatPriceCompact(null)).toBe('0.00€');
      expect(formatPriceCompact(undefined)).toBe('0.00€');
    });
  });
});
