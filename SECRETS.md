# Configuration des secrets GitHub Actions

Pour configurer le déploiement automatique, vous devez ajouter les secrets suivants dans votre repository GitHub :

## Comment ajouter les secrets :

1. Allez dans votre repository GitHub
2. Cliquez sur "Settings"
3. Dans le menu de gauche, cliquez sur "Secrets and variables" > "Actions"
4. Cliquez sur "New repository secret"
5. Ajoutez les secrets suivants :

## Secrets requis :

### HOST

- **Nom** : `SERVER_IP`
- **Valeur** : L'adresse IP ou le nom de domaine de votre VPS
- **Exemple** : `195.110.35.76` ou `sylvain.raveneau.angers`

### USERNAME

- **Nom** : `deploy`
- **Valeur** : Le nom d'utilisateur pour se connecter au VPS
- **Exemple** : `deploy` ou `root`

### PRIVATE_KEY

- **Nom** : `PRIVATE_KEY`
- **Valeur** : La clé privée SSH pour se connecter au VPS
- **Comment l'obtenir** :
  
  ```bash
  # Sur votre machine locale, générer une paire de clés SSH
  ssh-keygen -t rsa -b 4096 -C "github-actions"
  
  # Copier la clé publique sur le serveur
  ssh-copy-id -i ~/.ssh/id_rsa.pub username@votre-serveur.com
  
  # Copier le contenu de la clé privée
  cat ~/.ssh/id_rsa
  ```

### PORT (optionnel)

- **Nom** : `PORT`
- **Valeur** : Le port SSH (par défaut 22)
- **Exemple** : `22`

## Variables d'environnement (optionnel) :

Si votre application utilise des variables d'environnement, ajoutez-les aussi :

### NODE_ENV

- **Nom** : `NODE_ENV`
- **Valeur** : `production`

### API_URL

- **Nom** : `API_URL`
- **Valeur** : L'URL de votre API backend
- **Exemple** : `https://api.votre-domaine.com`
