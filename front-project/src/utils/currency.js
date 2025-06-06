/**
 * Utilitaires pour le formatage des prix et devises
 */

/**
 * Formate un prix en euros avec deux décimales
 * @param {number|string} price - Le prix à formater
 * @param {string} currency - Le symbole de la devise (par défaut '€')
 * @returns {string} Le prix formaté (ex: "19.99 €")
 */
export function formatPrice(price, currency = '€') {
  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice)) {
    return `0.00 ${currency}`;
  }
  return `${numericPrice.toFixed(2)} ${currency}`;
}

/**
 * Formate un prix en euros sans espace avant le symbole
 * @param {number|string} price - Le prix à formater
 * @returns {string} Le prix formaté (ex: "19.99€")
 */
export function formatPriceCompact(price) {
  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice)) {
    return '0.00€';
  }
  return `${numericPrice.toFixed(2)}€`;
}
