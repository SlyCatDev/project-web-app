# Services API - Organisation

Cette structure sépare logiquement les différents services API selon les bonnes pratiques de développement.

## Structure des fichiers

### `apiConfig.js`
- Configuration globale de l'API
- Utilitaires communs (gestion des erreurs, headers)
- Point central pour la configuration

### `productService.js`
- Gestion des produits
- Récupération des catégories
- Opérations CRUD sur les produits

### `cartService.js`
- Gestion du panier
- Ajout/suppression/modification d'articles
- Opérations CRUD sur les paniers

### `authService.js`
- Service d'authentification
- Gestion des utilisateurs
- Login/logout et vérification des sessions

### `index.js`
- Point d'entrée unifié moderne
- Facilite les imports groupés

## Utilisation

### Import moderne (recommandé)
```javascript
import { productService, cartService, authService } from '@/services';
```

### Import spécifique
```javascript
import { productService } from '@/services/productService.js';
import { cartService } from '@/services/cartService.js';
```

### Import rétrocompatible
```javascript
import { productService, cartService, authService } from '@/services/api.js';
```

## Bonnes pratiques respectées

1. **Séparation des responsabilités** : Chaque service a une responsabilité claire
2. **DRY (Don't Repeat Yourself)** : Configuration commune partagée
3. **Modularité** : Services indépendants et réutilisables
4. **Maintenabilité** : Structure claire et documentée
5. **Évolutivité** : Facilité d'ajout de nouveaux services
