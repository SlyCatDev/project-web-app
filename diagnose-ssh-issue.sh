#!/bin/bash

# Script de diagnostic SSH détaillé
# Usage: ./diagnose-ssh-issue.sh

echo "🔍 DIAGNOSTIC SSH APPROFONDI"
echo "============================"
echo ""

# Vérifier si les clés existent
echo "1. 🔑 Vérification des clés SSH existantes..."
if [ -d "$HOME/.ssh/github-actions" ]; then
    echo "   ✅ Dossier github-actions trouvé"
    if [ -f "$HOME/.ssh/github-actions/deploy_key" ]; then
        echo "   ✅ Clé privée trouvée"
        echo "   📋 Fingerprint de la clé :"
        ssh-keygen -l -f "$HOME/.ssh/github-actions/deploy_key" 2>/dev/null || echo "   ❌ Erreur lors de la lecture de la clé"
    else
        echo "   ❌ Clé privée manquante"
    fi
    
    if [ -f "$HOME/.ssh/github-actions/deploy_key.pub" ]; then
        echo "   ✅ Clé publique trouvée"
        echo "   📋 Contenu de la clé publique :"
        cat "$HOME/.ssh/github-actions/deploy_key.pub" 2>/dev/null
    else
        echo "   ❌ Clé publique manquante"
    fi
else
    echo "   ❌ Aucune clé GitHub Actions trouvée"
fi

echo ""
echo "2. 🔧 Génération d'une nouvelle paire de clés pour test..."

# Créer un dossier temporaire pour le test
TEST_DIR="$HOME/.ssh/test-github-actions"
mkdir -p "$TEST_DIR"

# Générer une nouvelle paire de clés pour le test
ssh-keygen -t ed25519 -C "test-github-deploy-$(date +%s)" -f "$TEST_DIR/test_key" -N "" >/dev/null 2>&1

if [ -f "$TEST_DIR/test_key" ]; then
    echo "   ✅ Nouvelle clé de test générée"
    echo ""
    echo "3. 📋 CLÉS PRÊTES POUR GITHUB ACTIONS"
    echo "====================================="
    echo ""
    echo "🔑 CLÉ PRIVÉE À COPIER DANS LE SECRET 'PRIVATE_KEY' :"
    echo ""
    echo "--- DÉBUT CLÉ PRIVÉE ---"
    cat "$TEST_DIR/test_key"
    echo "--- FIN CLÉ PRIVÉE ---"
    echo ""
    
    echo "🔑 CLÉ PUBLIQUE À INSTALLER SUR LE SERVEUR :"
    echo ""
    cat "$TEST_DIR/test_key.pub"
    echo ""
    echo ""
    
    echo "4. 📋 INSTRUCTIONS D'INSTALLATION"
    echo "=================================="
    echo ""
    echo "ÉTAPE A - Sur votre serveur :"
    echo "-----------------------------"
    echo "Connectez-vous à votre serveur et exécutez :"
    echo ""
    echo "mkdir -p ~/.ssh"
    echo "chmod 700 ~/.ssh"
    echo "echo '$(cat "$TEST_DIR/test_key.pub")' >> ~/.ssh/authorized_keys"
    echo "chmod 600 ~/.ssh/authorized_keys"
    echo ""
    
    echo "ÉTAPE B - Dans GitHub :"
    echo "----------------------"
    echo "1. Allez dans Settings → Secrets and variables → Actions"
    echo "2. Supprimez l'ancien secret PRIVATE_KEY s'il existe"
    echo "3. Créez un nouveau secret PRIVATE_KEY avec le contenu affiché ci-dessus"
    echo "4. Vérifiez que vous avez aussi :"
    echo "   - SERVER_IP (IP de votre serveur)"
    echo "   - SERVER_USERNAME (nom d'utilisateur SSH)"
    echo "   - SERVER_PORT (22 par défaut)"
    echo ""
    
    echo "ÉTAPE C - Test manuel :"
    echo "----------------------"
    echo "Pour tester depuis votre machine :"
    echo "ssh -i $TEST_DIR/test_key VOTRE_UTILISATEUR@VOTRE_IP"
    echo ""
    
    # Sauvegarder les clés
    cp "$TEST_DIR/test_key" "$HOME/.ssh/github-actions/deploy_key" 2>/dev/null || {
        mkdir -p "$HOME/.ssh/github-actions"
        cp "$TEST_DIR/test_key" "$HOME/.ssh/github-actions/deploy_key"
        cp "$TEST_DIR/test_key.pub" "$HOME/.ssh/github-actions/deploy_key.pub"
    }
    
else
    echo "   ❌ Erreur lors de la génération de la clé de test"
fi

echo "5. 🎯 DIAGNOSTIC TERMINÉ"
echo "========================"
echo ""
echo "✅ Actions à effectuer :"
echo "1. Copier la clé privée affichée ci-dessus dans GitHub"
echo "2. Installer la clé publique sur votre serveur"
echo "3. Relancer le déploiement"
echo ""
echo "📝 Fichiers de diagnostic sauvegardés dans :"
echo "   - $HOME/.ssh/github-actions/"
echo "   - $TEST_DIR/"

# Nettoyer le répertoire de test
# rm -rf "$TEST_DIR"
