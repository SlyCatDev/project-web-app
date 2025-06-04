# 🚀 Guide de déploiement CI/CD - Application Vue.js

## Vue d'ensemble

Ce guide explique comment déployer automatiquement votre application Vue.js sur un VPS Debian à chaque push sur la branche `main`.

## 🔧 Prérequis

### Sur votre VPS Debian :'

- Accès root ou sudo
- Git installé
- Node.js 20 et npm
- Nginx
- SSH configuré

### Sur GitHub :'

- Repository avec accès aux GitHub Actions
- Secrets configurés (voir SECRETS.md)

## 🎯 Architecture du déploiement

``` bash
GitHub Repository (push main)
     ↓
GitHub Actions (CI/CD)
     ↓
Tests + Build
     ↓
Déploiement SSH vers VPS
     ↓
Nginx → Application Vue.js
```

## 📋 Instructions pas à pas

### 1. Configuration initiale du VPS

```bash
# Se connecter au VPS
ssh root@votre-serveur.com

# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer les dépendances
sudo apt install nginx git curl -y

# Installer Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier les installations
node --version
npm --version
nginx -v
```

### 2. Configuration de l'utilisateur de déploiement

```bash
# Créer un utilisateur pour le déploiement
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo usermod -aG www-data deploy

# Passer à l'utilisateur deploy
su - deploy

# Configurer SSH pour l'utilisateur deploy
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

### 3. Cloner le repository sur le VPS

```bash
# Aller dans le répertoire web
sudo mkdir -p /var/www
sudo chown deploy:www-data /var/www

# Cloner le repository
cd /var/www
git clone https://github.com/votre-username/votre-repo.git votre-app
cd votre-app

# Faire un premier build
cd front-project
npm install
npm run build
```

### 4. Configuration Nginx

```bash
# Copier la configuration Nginx
sudo cp nginx.conf /etc/nginx/sites-available/votre-app

# Éditer la configuration si nécessaire
sudo nano /etc/nginx/sites-available/votre-app

# Activer le site
sudo ln -s /etc/nginx/sites-available/votre-app /etc/nginx/sites-enabled/

# Désactiver le site par défaut
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 5. Configurer les permissions du script de déploiement

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Permettre à l'utilisateur deploy d'exécuter certaines commandes sudo sans mot de passe
sudo visudo

# Ajouter cette ligne :
# deploy ALL=(ALL) NOPASSWD: /usr/sbin/nginx, /bin/systemctl reload nginx, /bin/systemctl restart nginx, /bin/chown, /bin/chmod, /bin/mkdir, /bin/cp, /bin/rm, /usr/bin/find
```

### 6. Test du déploiement manuel

```bash
# Tester le script de déploiement
./deploy.sh
```

### 7. Configuration GitHub

1. **Configurer les secrets** (voir SECRETS.md)
2. **Push votre code** :
   ```bash
   git add .
   git commit -m "feat: setup CI/CD deployment"
   git push origin main
   ```

### 8. Vérification

- Allez dans l'onglet "Actions" de votre repository GitHub
- Vérifiez que le workflow s'exécute correctement
- Visitez votre site web pour confirmer le déploiement

## 🔍 Dépannage

### Problèmes courants :

1. **Erreur de permissions SSH** :
   ```bash
   # Vérifier les permissions de la clé SSH
   chmod 600 ~/.ssh/id_rsa
   chmod 644 ~/.ssh/id_rsa.pub
   ```

2. **Erreur Nginx** :
   ```bash
   # Vérifier les logs Nginx
   sudo tail -f /var/log/nginx/error.log
   
   # Tester la configuration
   sudo nginx -t
   ```

3. **Erreur de build** :
   ```bash
   # Vérifier les logs du build
   cd /var/www/votre-app/front-project
   npm run build
   ```

### Logs utiles :

```bash
# Logs GitHub Actions : dans l'interface GitHub
# Logs Nginx :
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs système :
sudo journalctl -u nginx -f
```

## 🔄 Workflow de développement

1. **Développement local** → Créer une branche feature
2. **Tests** → Valider localement
3. **Pull Request** → Révision de code
4. **Merge vers main** → Déploiement automatique
5. **Vérification** → Tester en production

## 🛡️ Sécurité

- ✅ Configuration HTTPS recommandée (Let's Encrypt)
- ✅ Firewall configuré (UFW)
- ✅ Clés SSH sécurisées
- ✅ Utilisateur de déploiement avec permissions limitées

## 📊 Monitoring

Pour monitorer vos déploiements :

```bash
# Installer PM2 pour le monitoring (optionnel)
sudo npm install -g pm2

# Créer un script de monitoring
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

## 🎉 Félicitations !

Votre application Vue.js est maintenant configurée pour un déploiement automatique !

Chaque push sur la branche `main` déclenchera automatiquement :
1. Tests unitaires
2. Linting
3. Build de production
4. Déploiement sur votre VPS
5. Rechargement de Nginx
