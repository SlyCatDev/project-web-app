# 🔧 Guide de Dépannage SSH pour GitHub Actions

## ❌ Erreurs courantes rencontrées

### 1. `ssh: no key found`
```
ssh.ParsePrivateKey: ssh: no key found
```

### 2. `ssh: handshake failed: ssh: unable to authenticate`
```
ssh: handshake failed: ssh: unable to authenticate, attempted methods [none], no supported methods remain
```

## 🔍 Causes possibles

1. **Clé privée manquante ou mal formatée** dans les secrets GitHub
2. **Clé publique non installée** sur le serveur cible
3. **Mauvais format de clé** (doit être au format OpenSSH)
4. **Permissions incorrectes** sur le serveur

## ✅ Solutions étape par étape

### Étape 1 : Générer une nouvelle paire de clés SSH

```bash
# Créer un dossier pour les clés dédiées au déploiement
mkdir -p ~/.ssh/github-actions

# Générer une nouvelle paire de clés spécifiquement pour GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github-actions/deploy_key

# Ou avec RSA si ed25519 n'est pas supporté
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github-actions/deploy_key
```

### Étape 2 : Installer la clé publique sur le serveur

```bash
# Copier la clé publique sur le serveur
ssh-copy-id -i ~/.ssh/github-actions/deploy_key.pub username@votre-serveur

# Ou manuellement :
cat ~/.ssh/github-actions/deploy_key.pub | ssh username@votre-serveur "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Étape 3 : Vérifier les permissions sur le serveur

```bash
# Se connecter au serveur et vérifier les permissions
ssh username@votre-serveur

# Corriger les permissions si nécessaire
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chown -R $USER:$USER ~/.ssh
```

### Étape 4 : Configurer les secrets GitHub

1. **Obtenir la clé privée** :
```bash
cat ~/.ssh/github-actions/deploy_key
```

2. **Copier TOUT le contenu** incluant :
```
-----BEGIN OPENSSH PRIVATE KEY-----
[contenu de la clé]
-----END OPENSSH PRIVATE KEY-----
```

3. **Ajouter dans GitHub** :
   - Repository → Settings → Secrets and variables → Actions
   - New repository secret : `PRIVATE_KEY`
   - Coller le contenu complet de la clé privée

### Étape 5 : Tester la connexion

```bash
# Tester depuis votre machine locale
ssh -i ~/.ssh/github-actions/deploy_key username@votre-serveur

# Si ça fonctionne, GitHub Actions devrait aussi fonctionner
```

## 🛠️ Script de diagnostic

Créons un script pour diagnostiquer les problèmes SSH :

```bash
#!/bin/bash
echo "=== Diagnostic SSH pour GitHub Actions ==="
echo "1. Vérification de la clé privée..."
if [ -f ~/.ssh/github-actions/deploy_key ]; then
    echo "✅ Clé privée trouvée"
    ssh-keygen -l -f ~/.ssh/github-actions/deploy_key
else
    echo "❌ Clé privée manquante"
fi

echo "2. Vérification de la clé publique..."
if [ -f ~/.ssh/github-actions/deploy_key.pub ]; then
    echo "✅ Clé publique trouvée"
    cat ~/.ssh/github-actions/deploy_key.pub
else
    echo "❌ Clé publique manquante"
fi

echo "3. Test de connexion..."
ssh -i ~/.ssh/github-actions/deploy_key -o ConnectTimeout=5 username@votre-serveur "echo 'Connexion SSH réussie !'"
```

## 🔄 Alternative : Utilisation d'un mot de passe

Si SSH par clé pose problème, vous pouvez temporairement utiliser un mot de passe :

```yaml
- name: Deploy to server
  uses: appleboy/ssh-action@v1.2.0
  with:
    host: ${{ secrets.SERVER_IP }}
    username: ${{ secrets.SERVER_USERNAME }}
    password: ${{ secrets.SERVER_PASSWORD }}  # Au lieu de 'key'
    port: ${{ secrets.SERVER_PORT }}
    script: |
      # Vos commandes de déploiement
```

⚠️ **Note** : L'utilisation de mots de passe est moins sécurisée que les clés SSH.

## 📝 Checklist de vérification

- [ ] Clé SSH générée spécifiquement pour GitHub Actions
- [ ] Clé publique installée sur le serveur cible
- [ ] Permissions correctes sur le serveur (700 pour ~/.ssh, 600 pour authorized_keys)
- [ ] Clé privée complète copiée dans les secrets GitHub
- [ ] Test de connexion SSH réussi depuis la machine locale
- [ ] Nom d'utilisateur et adresse serveur corrects dans les secrets
- [ ] Port SSH correct (généralement 22)

## 🆘 Si rien ne fonctionne

1. **Vérifiez les logs** GitHub Actions pour plus de détails
2. **Contactez votre hébergeur** pour vérifier les restrictions SSH
3. **Utilisez temporairement un mot de passe** le temps de résoudre le problème de clés
4. **Vérifiez les pare-feu** qui pourraient bloquer les connexions SSH depuis GitHub
