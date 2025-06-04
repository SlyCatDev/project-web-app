# Guide d'Inscription - RegisterForm

## Vue d'ensemble

Le formulaire d'inscription (`RegisterForm.vue`) permet aux nouveaux utilisateurs de créer un compte sur l'application. Il reprend le design et la structure du formulaire de connexion tout en ajoutant les champs nécessaires pour l'inscription.

## Fonctionnalités

### 🎨 Design
- Interface moderne et responsive avec Tailwind CSS
- Design cohérent avec le formulaire de connexion
- Bouton d'inscription en vert pour le différencier de la connexion
- Animations et transitions fluides
- Éléments décoratifs identiques au SignInForm

### 📝 Champs du formulaire
- **Email** : Adresse email de l'utilisateur (validation format email)
- **Nom d'utilisateur** : Identifiant unique (minimum 3 caractères)
- **Prénom** : Prénom de l'utilisateur
- **Nom** : Nom de famille de l'utilisateur
- **Mot de passe** : Mot de passe sécurisé (minimum 6 caractères avec validation)
- **Confirmation** : Confirmation du mot de passe

### ✅ Validation
- Validation en temps réel des champs
- Messages d'erreur spécifiques pour chaque champ
- Validation du format email
- Validation de la complexité du mot de passe (majuscule, minuscule, chiffre)
- Vérification de la correspondance des mots de passe

### 🔧 Mode développement
- Section d'aide avec des données de test pré-remplies
- Bouton pour remplir automatiquement le formulaire
- Logs console pour le debugging
- Fonction globale `fillTestRegisterData()` accessible dans la console

### 🔄 Intégration
- Utilise le composable `useAuth` pour l'inscription
- Gestion des notifications avec `useNotificationStore`
- Redirection automatique vers la page de connexion après inscription réussie
- Gestion des erreurs avec messages utilisateur-friendly

## Structure technique

### Fichiers créés/modifiés
```
src/
├── components/user/
│   └── RegisterForm.vue           # Nouveau formulaire d'inscription
├── views/auth/
│   └── RegisterView.vue           # Nouvelle vue d'inscription
├── composables/
│   └── useAuth.js                 # Ajout méthode register()
├── services/
│   └── authService.js             # Ajout méthode register()
├── router/
│   └── index.js                   # Nouvelle route /register
└── components/layout/
    └── NavBar.vue                 # Ajout bouton inscription
```

### Routes
- `/register` - Page d'inscription
- Lien depuis `/signIn` vers l'inscription
- Bouton inscription dans la barre de navigation

### Service API
Le service d'inscription utilise l'endpoint `/users` avec la méthode POST et envoie :
```javascript
{
  email: "user@example.com",
  username: "username",
  password: "password",
  name: {
    firstname: "Prénom",
    lastname: "Nom"
  }
}
```

### Validation des mots de passe
- Minimum 6 caractères
- Au moins une minuscule
- Au moins une majuscule  
- Au moins un chiffre
- Confirmation identique au mot de passe

## Utilisation

### Pour les utilisateurs
1. Accéder via le bouton "Inscription" dans la navbar
2. Ou via le lien depuis la page de connexion
3. Remplir tous les champs requis
4. Le formulaire valide automatiquement les entrées
5. Après inscription réussie, redirection vers la connexion

### Pour les développeurs
1. En mode développement, utiliser le bouton "Remplir automatiquement"
2. Ou utiliser `fillTestRegisterData()` dans la console
3. Les erreurs sont loggées dans la console
4. Les notifications d'erreur/succès sont affichées

## Messages d'erreur
- **409** : Nom d'utilisateur ou email déjà utilisé
- **400** : Données invalides
- **500** : Erreur serveur
- **Réseau** : Erreur de connexion internet

## Tests
Pour tester l'inscription en mode développement :
```javascript
// Dans la console du navigateur
fillTestRegisterData()
```

Cela remplit le formulaire avec :
- Email: test@example.com
- Username: testuser123  
- Prénom: Test
- Nom: User
- Password: Test123!
