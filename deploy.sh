#!/bin/bash

# Script de déploiement automatisé
# Usage: ./deploy.sh

set -e

echo "🚀 Début du déploiement..."

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/project-web-app"
FRONTEND_DIR="$APP_DIR/front-project"
NGINX_SITE="/etc/nginx/sites-available/default"
BACKUP_DIR="/backup/$(date +%Y%m%d_%H%M%S)"

# Fonction pour logger
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Vérifier si on est root ou si on a les permissions sudo
if [[ $EUID -ne 0 ]] && ! sudo -n true 2>/dev/null; then
    error "Ce script nécessite les permissions sudo"
fi

# Créer une sauvegarde
log "Création d'une sauvegarde..."
sudo mkdir -p "$BACKUP_DIR"
if [ -d "$FRONTEND_DIR/dist" ]; then
    sudo cp -r "$FRONTEND_DIR/dist" "$BACKUP_DIR/"
    log "Sauvegarde créée dans $BACKUP_DIR"
fi

# Aller dans le répertoire de l'application
cd "$APP_DIR" || error "Impossible d'accéder au répertoire $APP_DIR"

# Récupérer les dernières modifications
log "Récupération du code source..."
git fetch --all
git reset --hard origin/main

# Aller dans le répertoire frontend
cd "$FRONTEND_DIR" || error "Impossible d'accéder au répertoire $FRONTEND_DIR"

# Installer les dépendances
log "Installation des dépendances..."
npm ci --production=false

# Exécuter les tests (optionnel)
log "Exécution des tests..."
npm run test:unit || warning "Certains tests ont échoué, mais le déploiement continue..."

# Construire l'application
log "Construction de l'application..."
NODE_ENV=production VITE_API_URL=https://fakestoreapi.com npm run build

# Vérifier que le build s'est bien passé
if [ ! -d "dist" ]; then
    error "Le build a échoué - le répertoire dist n'existe pas"
fi

# Test de connectivité API
log "Vérification de la connectivité à l'API FakeStore..."
if curl -s --head https://fakestoreapi.com/products | head -n 1 | grep -q "200 OK"; then
    log "✅ API FakeStore accessible"
else
    warning "⚠️  API FakeStore non accessible, mais le déploiement continue"
fi

# Définir les bonnes permissions
log "Configuration des permissions..."
sudo chown -R www-data:www-data dist/
sudo chmod -R 755 dist/

# Recharger Nginx
log "Rechargement de Nginx..."
sudo nginx -t || error "Configuration Nginx invalide"
sudo systemctl reload nginx

# Vérifier que Nginx fonctionne
if ! sudo systemctl is-active --quiet nginx; then
    error "Nginx ne fonctionne pas correctement"
fi

log "✅ Déploiement terminé avec succès !"
log "🌐 L'application est maintenant disponible et peut accéder à l'API FakeStore"

# Test final de l'application
log "Test final de l'application web..."
if curl -s --head "http://localhost" | head -n 1 | grep -q "200 OK"; then
    log "✅ Application web accessible"
else
    warning "⚠️  Application web non accessible localement"
fi

# Nettoyage des anciennes sauvegardes (garder seulement les 5 dernières)
log "Nettoyage des anciennes sauvegardes..."
sudo find /backup -maxdepth 1 -type d -name "20*" | sort -r | tail -n +6 | sudo xargs rm -rf

echo ""
echo "📊 Statistiques du déploiement :"
echo "- Taille du build: $(du -sh dist/ | cut -f1)"
echo "- Nombre de fichiers: $(find dist/ -type f | wc -l)"
echo "- Dernière sauvegarde: $BACKUP_DIR"
