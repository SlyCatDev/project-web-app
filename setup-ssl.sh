#!/bin/bash

# Script d'installation SSL avec Let's Encrypt
# Usage: sudo ./setup-ssl.sh votre-domaine.com

set -e

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "❌ Usage: sudo ./setup-ssl.sh votre-domaine.com"
    exit 1
fi

echo "🔒 Configuration SSL pour $DOMAIN"

# Installer Certbot
apt update
apt install snapd -y
snap install core; snap refresh core
snap install --classic certbot

# Créer un lien symbolique
ln -sf /snap/bin/certbot /usr/bin/certbot

# Obtenir le certificat SSL
certbot --nginx -d $DOMAIN -d www.$DOMAIN

# Configuration du renouvellement automatique
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

echo "✅ SSL configuré avec succès pour $DOMAIN"
echo "🔄 Le certificat sera renouvelé automatiquement"
