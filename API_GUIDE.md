# 🛒 Application E-commerce - Intégration API FakeStore

## 🌐 Configuration API en Production

Cette application utilise l'API FakeStore (https:/fakestoreapi.com/) pour récupérer les données des produits. Voici comment elle est configurée pour fonctionner en production.

## 🔧 Configuration actuelle

### Variables d'environnement

- **VITE_API_URL**: URL de l'API (par défaut: https:/fakestoreapi.com)
- **NODE_ENV**: Environnement d'exécution

### Endpoints utilisés

- `GET /products` - Liste des produits
- `GET /products/{id}` - Détail d'un produit
- `GET /products/categories` - Liste des catégories
- `GET /products/category/{category}` - Produits par catégorie
- `POST /auth/login` - Authentification

## 🚀 Fonctionnalités

### ✅ Gestion d'erreurs robuste

- Retry automatique en cas d'échec
- Messages d'erreur utilisateur-friendly
- Fallback en cas d'indisponibilité de l'API

### ✅ Performance optimisée

- Mise en cache des réponses
- Compression gzip activée
- Headers de cache optimisés

### ✅ Sécurité

- Headers CORS configurés
- Validation des réponses
- Gestion des timeouts

## 🛠️ Utilisation en développement

```bash
# Démarrer en mode développement
npm run dev

# Build pour la production
npm run build

# Tester l'API
# Utiliser le composant ApiHealthCheck ou ApiExample
```

## 🔍 Test de connectivité

L'application inclut un composant `ApiHealthCheck` qui permet de :

- Tester la connectivité à l'API
- Vérifier les performances
- Diagnostiquer les problèmes

## 📦 Structure des services

``` bash
src/services/
├── api.js           # Services API principaux
src/composables/
├── useApi.js        # Composable pour la gestion d'état
src/components/
├── ApiHealthCheck.vue  # Test de connectivité
├── ApiExample.vue      # Exemple d'utilisation
```

## 🌍 Déploiement

### Pré-requis serveur

- Nginx configuré avec les headers CORS
- Node.js 18+
- Connexion internet pour accéder à l'API

### Variables de production

Les variables suivantes sont automatiquement configurées lors du déploiement :

- `NODE_ENV=production`
- `VITE_API_URL=https://fakestoreapi.com`

### Vérification post-déploiement

1. Accéder à l'application en production
2. Vérifier le composant ApiHealthCheck
3. Confirmer que les produits se chargent correctement

## 🐛 Dépannage

### Erreurs courantes

#### 1. CORS Error

**Problème** : Erreur CORS lors des requêtes API
**Solution** : Vérifier la configuration Nginx (headers CORS)

#### 2. Network Error

**Problème** : Impossible de contacter l'API
**Solution** :

- Vérifier la connectivité internet du serveur
- Tester manuellement : `curl https://fakestoreapi.com/products`

#### 3. Build Error

**Problème** : Erreur lors du build
**Solution** : Vérifier les variables d'environnement

### Logs utiles

```bash
# Logs Nginx
sudo tail -f /var/log/nginx/error.log

# Test API depuis le serveur
curl -I https://fakestoreapi.com/products

# Vérifier le build
cd /var/www/project-web-app/front-project
npm run build
```

## 📊 Monitoring

### Métriques importantes

- Temps de réponse API (< 2s)
- Taux de succès des requêtes (> 95%)
- Disponibilité de l'API FakeStore

### Alertes recommandées

- API indisponible > 5 minutes
- Temps de réponse > 5 secondes
- Taux d'erreur > 10%

## 🔄 Alternatives de secours

En cas d'indisponibilité prolongée de l'API FakeStore :

1. **Cache local** : Données mises en cache par le navigateur
2. **Données statiques** : Fichier JSON de secours
3. **API alternative** : Migration vers une autre API

## 📞 Support

Pour les problèmes liés à l'API :

1. Vérifier le statut de FakeStore API
2. Consulter les logs de l'application
3. Utiliser le composant ApiHealthCheck pour diagnostiquer
