/**
 * Service de paiement (simulation)
 * Simule le traitement des paiements et la gestion des commandes
 */

const API_DELAY = 2000; // Simule la latence du réseau

// Simulation d'une base de données locale des commandes
const ORDERS_STORAGE_KEY = 'ecommerce_orders';

// Récupérer les commandes depuis le localStorage
const getStoredOrders = () => {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return [];
  }
};

// Sauvegarder une commande dans le localStorage
const saveOrder = (order) => {
  try {
    const orders = getStoredOrders();
    orders.push(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la commande:', error);
    return false;
  }
};

// Générer un numéro de commande unique
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `CMD${timestamp}${random}`.toUpperCase();
};

// Simuler la validation d'une carte bancaire
const validateCreditCard = (cardData) => {
  const { cardNumber, cvv, expiryMonth, expiryYear } = cardData;
  
  // Simulation de validation basique
  const cleanCardNumber = cardNumber.replace(/\s/g, '');
  
  // Vérifier la longueur
  if (cleanCardNumber.length < 16) {
    return { isValid: false, error: 'Numéro de carte invalide' };
  }
  
  // Vérifier le CVV
  if (!cvv || cvv.length < 3) {
    return { isValid: false, error: 'Code CVV invalide' };
  }
  
  // Vérifier la date d'expiration
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const expYear = parseInt(expiryYear);
  const expMonth = parseInt(expiryMonth);
  
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return { isValid: false, error: 'Carte expirée' };
  }
  
  // Simulation d'échec de paiement (5% de chance)
  if (Math.random() < 0.05) {
    return { isValid: false, error: 'Paiement refusé par la banque' };
  }
  
  return { isValid: true };
};

export const paymentService = {
  
  /**
   * Traiter une commande
   * @param {Object} orderData - Données de la commande
   * @returns {Promise<Object>} - Résultat du traitement
   */
  async processOrder(orderData) {
    try {
      // Simuler le délai de traitement
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      // Valider les données de la carte
      const cardValidation = validateCreditCard(orderData.payment);
      if (!cardValidation.isValid) {
        throw new Error(cardValidation.error);
      }
      
      // Créer la commande
      const order = {
        id: generateOrderNumber(),
        orderNumber: generateOrderNumber(),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        customer: {
          firstName: orderData.shipping.firstName,
          lastName: orderData.shipping.lastName,
          email: orderData.shipping.email,
          phone: orderData.shipping.phone
        },
        shipping: {
          address: orderData.shipping.address,
          city: orderData.shipping.city,
          postalCode: orderData.shipping.postalCode,
          country: orderData.shipping.country,
          instructions: orderData.shipping.deliveryInstructions
        },
        payment: {
          method: 'credit_card',
          cardType: orderData.payment.cardType,
          lastFourDigits: orderData.payment.cardNumber.slice(-4),
          amount: orderData.cart.totalAmount,
          currency: 'EUR'
        },
        items: orderData.cart.items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        })),
        totals: {
          subtotal: orderData.cart.totalAmount,
          shipping: 0, // Livraison gratuite
          tax: orderData.cart.totalAmount * 0.2, // TVA 20%
          total: orderData.cart.totalAmount * 1.2
        },
        estimatedDelivery: this.calculateDeliveryDate()
      };
      
      // Sauvegarder la commande
      const saved = saveOrder(order);
      if (!saved) {
        throw new Error('Erreur lors de la sauvegarde de la commande');
      }
      
      return {
        success: true,
        order: order,
        message: 'Commande traitée avec succès'
      };
      
    } catch (error) {
      console.error('Erreur lors du traitement de la commande:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors du traitement du paiement'
      };
    }
  },
  
  /**
   * Calculer la date de livraison estimée
   * @returns {string} Date de livraison au format ISO
   */
  calculateDeliveryDate() {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3); // Livraison en 3 jours
    return deliveryDate.toISOString();
  },
  
  /**
   * Récupérer les commandes d'un utilisateur
   * @param {string} email - Email du client
   * @returns {Array} Liste des commandes
   */
  getOrdersByEmail(email) {
    const orders = getStoredOrders();
    return orders.filter(order => order.customer.email === email);
  },
  
  /**
   * Récupérer une commande par son numéro
   * @param {string} orderNumber - Numéro de commande
   * @returns {Object|null} Commande trouvée ou null
   */
  getOrderByNumber(orderNumber) {
    const orders = getStoredOrders();
    return orders.find(order => order.orderNumber === orderNumber) || null;
  },
  
  /**
   * Récupérer toutes les commandes (pour administration)
   * @returns {Array} Liste de toutes les commandes
   */
  getAllOrders() {
    return getStoredOrders();
  },
  
  /**
   * Vider l'historique des commandes
   * @returns {boolean} Succès de l'opération
   */
  clearOrderHistory() {
    try {
      localStorage.removeItem(ORDERS_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Erreur lors du vidage de l\'historique:', error);
      return false;
    }
  },
  
  /**
   * Simuler l'envoi d'un email de confirmation
   * @param {Object} order - Données de la commande
   * @returns {Promise<boolean>} Succès de l'envoi
   */
  async sendConfirmationEmail(order) {
    try {
      // Simuler l'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Email de confirmation envoyé à ${order.customer.email}`);
      console.log(`Numéro de commande: ${order.orderNumber}`);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  }
};
