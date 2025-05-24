#!/bin/bash

# Script de correction des permissions Git pour le déploiement
# À exécuter sur le serveur VPS pour corriger les permissions

echo "🔧 Correction des permissions Git pour le déploiement"
echo "===================================================="

# Vérifier si on est sur le bon serveur
if [ ! -d "/var/www" ]; then
    echo "❌ Répertoire /var/www non trouvé. Êtes-vous sur le bon serveur ?"
    exit 1
fi

# Utilisateur actuel
USER=$(whoami)
echo "👤 Utilisateur actuel: $USER"

# Corriger les permissions du répertoire principal
echo "🔧 Correction des permissions /var/www/project-web-app..."
if [ -d "/var/www/project-web-app" ]; then
    sudo chown -R $USER:$USER /var/www/project-web-app
    sudo chmod -R u+rwX /var/www/project-web-app
    echo "✅ Permissions du répertoire corrigées"
else
    echo "ℹ️ Répertoire /var/www/project-web-app n'existe pas encore"
fi

# Corriger spécifiquement les permissions git
if [ -d "/var/www/project-web-app/.git" ]; then
    echo "🔧 Correction des permissions git..."
    sudo chown -R $USER:$USER /var/www/project-web-app/.git
    sudo chmod -R u+rwX /var/www/project-web-app/.git
    echo "✅ Permissions git corrigées"
fi

# Configurer git safe directory
echo "🔧 Configuration git safe directory..."
git config --global --add safe.directory /var/www/project-web-app
echo "✅ Safe directory configuré"

# Test des permissions
echo "🧪 Test des permissions..."
cd /var/www/project-web-app 2>/dev/null && {
    if [ -w ".git/FETCH_HEAD" ] 2>/dev/null || [ ! -f ".git/FETCH_HEAD" ]; then
        echo "✅ Permissions git OK"
    else
        echo "⚠️ Problème de permissions git détecté"
        sudo chmod 644 .git/FETCH_HEAD 2>/dev/null || true
    fi
    
    # Test git status
    if git status >/dev/null 2>&1; then
        echo "✅ Git fonctionne correctement"
    else
        echo "❌ Git ne fonctionne pas encore"
    fi
} || {
    echo "ℹ️ Répertoire git pas encore créé"
}

# Vérifier les dépendances
echo "🔍 Vérification des dépendances..."

# Node.js
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js non installé"
fi

# npm
if command -v npm >/dev/null 2>&1; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm non installé"
fi

# pnpm
if command -v pnpm >/dev/null 2>&1; then
    echo "✅ pnpm: $(pnpm --version)"
else
    echo "ℹ️ pnpm sera installé automatiquement"
fi

# git
if command -v git >/dev/null 2>&1; then
    echo "✅ git: $(git --version)"
else
    echo "❌ git non installé"
fi

# nginx
if command -v nginx >/dev/null 2>&1; then
    echo "✅ nginx installé"
    if systemctl is-active --quiet nginx; then
        echo "✅ nginx en cours d'exécution"
    else
        echo "⚠️ nginx non démarré"
    fi
else
    echo "❌ nginx non installé"
fi

echo ""
echo "🎯 Résumé"
echo "========="
echo "Les permissions ont été corrigées."
echo "Vous pouvez maintenant relancer le déploiement GitHub Actions."

echo ""
echo "🚀 Pour tester manuellement:"
echo "cd /var/www/project-web-app"
echo "git pull origin main"
