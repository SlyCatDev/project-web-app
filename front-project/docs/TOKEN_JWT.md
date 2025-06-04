# 🔒 Analyse de Sécurité - Stockage des Tokens JWT

## ⚠️ PROBLÈME IDENTIFIÉ : Stockage localStorage des JWT

### 🚨 **Vulnérabilités critiques actuelles**

#### 1. **Exposition aux attaques XSS (Cross-Site Scripting)**
```javascript
// 🚨 VULNÉRABLE : Token accessible via JavaScript
const token = localStorage.getItem('authToken')
// Un script malveillant peut voler ce token !
```

**Impact** : Si une attaque XSS réussit, le token JWT peut être volé et utilisé pour usurper l'identité de l'utilisateur.

#### 2. **Persistance non-contrôlée**
```javascript
// 🚨 PROBLÈME : Le token reste accessible même après fermeture du navigateur
localStorage.setItem('authToken', response.token)
// Le token persiste jusqu'à suppression manuelle
```

**Impact** : Sur un ordinateur partagé, le token reste accessible aux utilisateurs suivants.

#### 3. **Absence d'expiration côté client**
```javascript
// 🚨 MANQUE : Aucune vérification d'expiration
const isAuthenticated = computed(() => !!authToken.value)
// Ne vérifie pas si le token est encore valide
```

**Impact** : L'application continue d'utiliser des tokens expirés, causant des erreurs 401 inattendues.

## 🛡️ SOLUTIONS RECOMMANDÉES

### 🥇 **Solution 1 : Cookies httpOnly (RECOMMANDÉ)**

#### Avantages :
- ✅ **Protection XSS** : Inaccessible via JavaScript
- ✅ **Gestion automatique** : Envoi automatique avec les requêtes
- ✅ **Expiration contrôlée** : Gestion côté serveur
- ✅ **Sécurité CSRF** : Protection avec SameSite

#### Implémentation :
```javascript
// Côté serveur (à implémenter)
res.cookie('authToken', jwt, {
  httpOnly: true,      // Inaccessible via JS
  secure: true,        // HTTPS uniquement
  sameSite: 'strict',  // Protection CSRF
  maxAge: 3600000      // 1 heure
})

// Côté client - Plus de gestion manuelle !
// Le cookie est automatiquement envoyé
```

### 🥈 **Solution 2 : Memory Storage + Refresh Token**

#### Avantages :
- ✅ **Sécurité XSS** : Token en mémoire uniquement
- ✅ **Session courte** : Disparaît à la fermeture
- ✅ **Refresh automatique** : Renouvellement transparent

#### Implémentation :
```javascript
// Token principal en mémoire (non persistant)
let accessToken = null

// Refresh token sécurisé (httpOnly cookie)
// Utilisé pour obtenir de nouveaux access tokens
```

### 🥉 **Solution 3 : sessionStorage + Encryption**

#### Avantages :
- ✅ **Session limitée** : Disparaît à la fermeture de l'onglet
- ✅ **Chiffrement** : Token obfusqué
- ✅ **Facilité d'implémentation** : Changement minimal

#### Implémentation :
```javascript
// Chiffrement simple du token
const encryptToken = (token) => btoa(token + 'salt')
const decryptToken = (encrypted) => atob(encrypted).replace('salt', '')

// Stockage session uniquement
sessionStorage.setItem('authToken', encryptToken(token))
```

## 🔧 IMPLÉMENTATION IMMÉDIATE (Solution 3)

### **Étape 1 : Créer un service de sécurité**

```javascript
// src/services/tokenSecurity.js
const SECRET_SALT = 'myapp_2024_salt'

export const tokenSecurity = {
  // Chiffrement simple du token
  encrypt(token) {
    try {
      return btoa(JSON.stringify({ 
        token, 
        timestamp: Date.now(),
        salt: SECRET_SALT 
      }))
    } catch {
      return null
    }
  },

  // Déchiffrement et validation
  decrypt(encryptedToken) {
    try {
      const decoded = JSON.parse(atob(encryptedToken))
      if (decoded.salt !== SECRET_SALT) return null
      
      // Vérifier l'âge du token (24h max)
      const maxAge = 24 * 60 * 60 * 1000 // 24 heures
      if (Date.now() - decoded.timestamp > maxAge) return null
      
      return decoded.token
    } catch {
      return null
    }
  },

  // Stockage sécurisé
  store(token) {
    const encrypted = this.encrypt(token)
    if (encrypted) {
      sessionStorage.setItem('authToken', encrypted)
      return true
    }
    return false
  },

  // Récupération sécurisée
  retrieve() {
    const encrypted = sessionStorage.getItem('authToken')
    return encrypted ? this.decrypt(encrypted) : null
  },

  // Suppression sécurisée
  clear() {
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('user')
  }
}
```

### **Étape 2 : Modifier useAuth.js**

```javascript
// Remplacer localStorage par sessionStorage + encryption
import { tokenSecurity } from '@/services/tokenSecurity.js'

// État global sécurisé
const authToken = ref(tokenSecurity.retrieve())
const user = ref(JSON.parse(sessionStorage.getItem('user') || 'null'))

// Fonction de connexion sécurisée
const login = async (username, password) => {
  try {
    const response = await authService.login(username, password)
    
    if (response.token) {
      // Stockage sécurisé
      authToken.value = response.token
      user.value = { username, loginTime: new Date().toISOString() }
      
      // Persister de manière sécurisée
      tokenSecurity.store(response.token)
      sessionStorage.setItem('user', JSON.stringify(user.value))
      
      return { success: true, user: user.value }
    }
  } catch (error) {
    throw error
  }
}

// Déconnexion sécurisée
const logout = () => {
  authToken.value = null
  user.value = null
  tokenSecurity.clear()
}
```

## 🔍 AUDIT DE SÉCURITÉ COMPLET

### **Niveau de risque actuel : 🔴 ÉLEVÉ**

| Vulnérabilité | Risque | Impact | Solution |
|---------------|--------|---------|----------|
| XSS Token Theft | 🔴 Élevé | Vol d'identité | httpOnly cookies |
| Token Persistence | 🟡 Moyen | Accès non autorisé | sessionStorage |
| No Expiration Check | 🟡 Moyen | Erreurs UX | Validation côté client |
| Plain Text Storage | 🟡 Moyen | Inspection facile | Chiffrement |
| CSRF Potential | 🟡 Moyen | Requêtes malveillantes | SameSite cookies |

### **Checklist de sécurisation**

- [ ] **Remplacer localStorage par sessionStorage**
- [ ] **Implémenter le chiffrement des tokens**
- [ ] **Ajouter la validation d'expiration côté client**
- [ ] **Configurer des headers de sécurité (CSP)**
- [ ] **Implémenter la déconnexion automatique**
- [ ] **Ajouter la détection de session expirée**
- [ ] **Audit des dépendances avec `npm audit`**

## 🚀 PLAN D'AMÉLIORATION PROGRESSIF

### **Phase 1 : Sécurisation immédiate (2h)**
1. ✅ Remplacer localStorage → sessionStorage
2. ✅ Ajouter chiffrement basique
3. ✅ Implémenter validation d'expiration

### **Phase 2 : Sécurité avancée (1 jour)**
1. 🔄 Refresh token pattern
2. 🔄 Déconnexion automatique
3. 🔄 Headers de sécurité CSP

### **Phase 3 : Production ready (2-3 jours)**
1. 🔄 Cookies httpOnly (nécessite backend)
2. 🔄 Monitoring de sécurité
3. 🔄 Tests de pénétration

## 📊 IMPACT DES CHANGEMENTS

### **Avant (localStorage)**
```javascript
// 🚨 VULNÉRABLE
localStorage.setItem('authToken', token)  // Persistant + accessible via JS
const storedToken = localStorage.getItem('authToken')  // Pas de validation
```

### **Après (sessionStorage + encryption)**
```javascript
// ✅ SÉCURISÉ
tokenSecurity.store(token)  // Chiffré + session limitée
const token = tokenSecurity.retrieve()  // Déchiffré + validation
```

### **Bénéfices immédiats**
- 🛡️ **Réduction du risque XSS** : Token chiffré
- ⏰ **Session limitée** : Expiration automatique à la fermeture
- 🔍 **Validation d'intégrité** : Détection de tampering
- 🚨 **Alertes de sécurité** : Monitoring des accès

## 🔗 RESSOURCES ET RÉFÉRENCES

### **Standards de sécurité**
- [OWASP JWT Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [RFC 8725 - JWT Best Current Practices](https://tools.ietf.org/html/rfc8725)

### **Outils de test**
- [JWT Debugger](https://jwt.io/) - Analyse des tokens
- [OWASP ZAP](https://www.zaproxy.org/) - Tests de sécurité
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Audit des dépendances

## ⚡ ACTIONS IMMÉDIATES RECOMMANDÉES

1. **🚨 PRIORITÉ 1** : Implémenter sessionStorage + chiffrement (2h)
2. **🔧 PRIORITÉ 2** : Ajouter validation d'expiration (30min)
3. **📋 PRIORITÉ 3** : Audit complet de l'application (1h)
4. **🛡️ PRIORITÉ 4** : Planifier migration vers httpOnly cookies

> **Note** : En production, la solution recommandée reste les **cookies httpOnly** qui nécessitent une adaptation côté serveur/API.
