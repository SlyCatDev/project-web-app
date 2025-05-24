#!/bin/bash

# Script de configuration SSH pour GitHub Actions
# Usage: ./setup-ssh-keys.sh username@server-ip

set -e

echo "🔐 Configuration SSH pour GitHub Actions"
echo "========================================"

# Vérification des paramètres
if [ -z "$1" ]; then
    echo "❌ Usage: $0 username@server-ip"
    echo "   Exemple: $0 deploy@195.110.35.76"
    exit 1
fi

SERVER="$1"
KEY_DIR="$HOME/.ssh/github-actions"
KEY_FILE="$KEY_DIR/deploy_key"

# Créer le dossier pour les clés
echo "📁 Création du dossier pour les clés..."
mkdir -p "$KEY_DIR"

# Générer la paire de clés
echo "🔑 Génération de la paire de clés SSH..."
if [ ! -f "$KEY_FILE" ]; then
    ssh-keygen -t ed25519 -C "github-actions-deploy-$(date +%Y%m%d)" -f "$KEY_FILE" -N ""
    echo "✅ Nouvelle paire de clés générée"
else
    echo "ℹ️  Clés existantes trouvées"
fi

# Installer la clé publique sur le serveur
echo "📤 Installation de la clé publique sur le serveur..."
if ssh-copy-id -i "$KEY_FILE.pub" "$SERVER"; then
    echo "✅ Clé publique installée avec succès"
else
    echo "❌ Échec de l'installation de la clé publique"
    echo "   Essayez manuellement:"
    echo "   cat $KEY_FILE.pub | ssh $SERVER \"mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys\""
    exit 1
fi

# Test de connexion
echo "🔄 Test de la connexion SSH..."
if ssh -i "$KEY_FILE" -o ConnectTimeout=10 "$SERVER" "echo 'Connexion SSH réussie !'"; then
    echo "✅ Test de connexion réussi"
else
    echo "❌ Test de connexion échoué"
    exit 1
fi

# Afficher la clé privée pour GitHub
echo ""
echo "🔐 CLÉS POUR GITHUB ACTIONS"
echo "=========================="
echo ""
echo "📋 Copiez la clé privée suivante dans le secret GitHub 'PRIVATE_KEY':"
echo ""
echo "--- DÉBUT DE LA CLÉ PRIVÉE ---"
cat "$KEY_FILE"
echo "--- FIN DE LA CLÉ PRIVÉE ---"
echo ""

# Extraire les informations du serveur
SERVER_IP=$(echo "$SERVER" | cut -d'@' -f2)
SERVER_USER=$(echo "$SERVER" | cut -d'@' -f1)

echo "📝 CONFIGURATION DES SECRETS GITHUB"
echo "==================================="
echo ""
echo "Ajoutez ces secrets dans votre repository GitHub:"
echo ""
echo "SERVER_IP: $SERVER_IP"
echo "SERVER_USERNAME: $SERVER_USER"
echo "SERVER_PORT: 22"
echo "PRIVATE_KEY: [la clé affichée ci-dessus]"
echo ""

# Sauvegarder les informations
cat > "$KEY_DIR/github-secrets.txt" << EOF
# Secrets GitHub Actions générés le $(date)
SERVER_IP=$SERVER_IP
SERVER_USERNAME=$SERVER_USER
SERVER_PORT=22

# Clé privée (copier le contenu de deploy_key)
PRIVATE_KEY=[voir le fichier deploy_key]
EOF

echo "💾 Informations sauvegardées dans: $KEY_DIR/github-secrets.txt"
echo ""
echo "🎉 Configuration terminée !"
echo ""
echo "📌 PROCHAINES ÉTAPES:"
echo "1. Copiez la clé privée affichée ci-dessus"
echo "2. Allez dans votre repository GitHub → Settings → Secrets and variables → Actions"
echo "3. Ajoutez les 4 secrets listés ci-dessus"
echo "4. Poussez votre code vers la branche main pour déclencher le déploiement"
