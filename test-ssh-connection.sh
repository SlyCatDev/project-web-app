#!/bin/bash

# Script de test SSH pour GitHub Actions
# Usage: ./test-ssh-connection.sh username@server-ip

set -e

echo "🔍 Test de connexion SSH pour GitHub Actions"
echo "============================================"

# Vérification des paramètres
if [ -z "$1" ]; then
    echo "❌ Usage: $0 username@server-ip"
    echo "   Exemple: $0 deploy@195.110.35.76"
    exit 1
fi

SERVER="$1"
KEY_FILE="$HOME/.ssh/github-actions/deploy_key"

# Vérifier que la clé existe
if [ ! -f "$KEY_FILE" ]; then
    echo "❌ Clé privée non trouvée: $KEY_FILE"
    echo "   Exécutez d'abord: ./setup-ssh-keys.sh $SERVER"
    exit 1
fi

echo "✅ Clé privée trouvée: $KEY_FILE"

# Test de connexion basique
echo "🔄 Test de connexion SSH..."
if ssh -i "$KEY_FILE" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$SERVER" "echo 'Connexion SSH réussie !'" 2>/dev/null; then
    echo "✅ Connexion SSH réussie"
else
    echo "❌ Échec de la connexion SSH"
    echo "   Vérifiez:"
    echo "   1. L'adresse IP/nom d'hôte du serveur"
    echo "   2. Le nom d'utilisateur"
    echo "   3. Que la clé publique est installée sur le serveur"
    exit 1
fi

# Test des commandes de déploiement
echo "🧪 Test des commandes de déploiement..."

# Vérifier que git est installé
echo "  📋 Vérification de git..."
if ssh -i "$KEY_FILE" -o ConnectTimeout=10 "$SERVER" "command -v git" >/dev/null 2>&1; then
    echo "  ✅ git installé"
else
    echo "  ❌ git non installé sur le serveur"
fi

# Vérifier que node/npm est installé
echo "  📋 Vérification de Node.js..."
if ssh -i "$KEY_FILE" -o ConnectTimeout=10 "$SERVER" "command -v node" >/dev/null 2>&1; then
    NODE_VERSION=$(ssh -i "$KEY_FILE" -o ConnectTimeout=10 "$SERVER" "node --version" 2>/dev/null)
    echo "  ✅ Node.js installé: $NODE_VERSION"
else
    echo "  ❌ Node.js non installé sur le serveur"
fi

# Vérifier que npm est installé
echo "  📋 Vérification de npm..."
if ssh -i "$KEY_FILE" -o ConnectTimeout=10 "$SERVER" "command -v npm" >/dev/null 2>&1; then
    NPM_VERSION=$(ssh -i "$KEY_FILE" -o ConnectTimeout=10 "$SERVER" "npm --version" 2>/dev/null)
    echo "  ✅ npm installé: $NPM_VERSION"
else
    echo "  ❌ npm non installé sur le serveur"
fi

# Vérifier les permissions sudo
echo "  📋 Vérification des permissions sudo..."
if ssh -i "$KEY_FILE" -o ConnectTimeout=10 "$SERVER" "sudo -n true" >/dev/null 2>&1; then
    echo "  ✅ Permissions sudo configurées"
else
    echo "  ⚠️  Permissions sudo nécessaires pour le rechargement de nginx"
fi

# Vérifier nginx
echo "  📋 Vérification de nginx..."
if ssh -i "$KEY_FILE" -o ConnectTimeout=10 "$SERVER" "command -v nginx" >/dev/null 2>&1; then
    echo "  ✅ nginx installé"
    if ssh -i "$KEY_FILE" -o ConnectTimeout=10 "$SERVER" "sudo systemctl is-active nginx" >/dev/null 2>&1; then
        echo "  ✅ nginx en cours d'exécution"
    else
        echo "  ⚠️  nginx non démarré"
    fi
else
    echo "  ❌ nginx non installé sur le serveur"
fi

# Test de création du répertoire de déploiement
echo "  📋 Vérification du répertoire de déploiement..."
if ssh -i "$KEY_FILE" -o ConnectTimeout=10 "$SERVER" "ls -la /var/www/" >/dev/null 2>&1; then
    echo "  ✅ Répertoire /var/www accessible"
    if ssh -i "$KEY_FILE" -o ConnectTimeout=10 "$SERVER" "ls -la /var/www/project-web-app" >/dev/null 2>&1; then
        echo "  ✅ Répertoire de projet existant"
    else
        echo "  ℹ️  Répertoire de projet sera créé lors du déploiement"
    fi
else
    echo "  ❌ Répertoire /var/www non accessible"
fi

echo ""
echo "🎯 RÉSUMÉ DU TEST"
echo "=================="

# Extraire les informations
SERVER_IP=$(echo "$SERVER" | cut -d'@' -f2)
SERVER_USER=$(echo "$SERVER" | cut -d'@' -f1)

echo "📍 Serveur: $SERVER_IP"
echo "👤 Utilisateur: $SERVER_USER"
echo "🔑 Clé SSH: $KEY_FILE"

echo ""
echo "📝 CONFIGURATION GITHUB ACTIONS"
echo "Ajoutez ces secrets dans votre repository:"
echo ""
echo "SERVER_IP: $SERVER_IP"
echo "SERVER_USERNAME: $SERVER_USER"
echo "SERVER_PORT: 22"
echo "PRIVATE_KEY: [contenu de $KEY_FILE]"

echo ""
echo "🚀 Pour obtenir la clé privée:"
echo "   cat $KEY_FILE"

echo ""
echo "✅ Test terminé ! Votre serveur semble prêt pour le déploiement."
