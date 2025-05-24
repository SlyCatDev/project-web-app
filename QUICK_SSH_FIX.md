# 🚨 SOLUTION RAPIDE - Erreur SSH GitHub Actions

## Votre erreur actuelle :

``` bash
ssh.ParsePrivateKey: ssh: no key found
ssh: handshake failed: ssh: unable to authenticate
```

## ✅ Solution en 5 étapes

### 1. Générer et configurer les clés SSH

Exécutez le script automatisé (remplacez par vos informations) :

```bash
# Depuis votre machine locale
./setup-ssh-keys.sh deploy@195.110.35.76
```

Ou **manuellement** :

```bash
# Générer la clé
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy

# Copier sur le serveur
ssh-copy-id -i ~/.ssh/github_deploy.pub deploy@195.110.35.76

# Tester
ssh -i ~/.ssh/github_deploy deploy@195.110.35.76
```

### 2. Récupérer la clé privée

```bash
cat ~/.ssh/github_deploy
```

**Copiez TOUT le contenu**, y compris :
``` bash
-----BEGIN OPENSSH PRIVATE KEY-----
[contenu de la clé]
-----END OPENSSH PRIVATE KEY-----
```

### 3. Configurer les secrets GitHub

Dans votre repository GitHub :
- Settings → Secrets and variables → Actions
- Ajoutez ces 4 secrets :

| Secret | Valeur |
|--------|--------|
| `SERVER_IP` | `195.110.35.76` (votre IP) |
| `SERVER_USERNAME` | `deploy` (votre utilisateur) |
| `SERVER_PORT` | `22` |
| `PRIVATE_KEY` | [la clé complète copiée] |

### 4. Vérifier votre serveur

Assurez-vous que votre serveur a :

- ✅ SSH activé
- ✅ Node.js installé
- ✅ git installé
- ✅ nginx installé et configuré
- ✅ Répertoire `/var/www` accessible

### 5. Re-déclencher le déploiement

```bash
# Pousser un commit pour déclencher le pipeline
git commit --allow-empty -m "🔄 Trigger deployment with fixed SSH"
git push origin main
```

## 🔍 Diagnostic rapide

Testez votre configuration avant de relancer :

```bash
# Test la connexion SSH
./test-ssh-connection.sh deploy@195.110.35.76
```

## ⚡ Alternative temporaire

Si vous continuez à avoir des problèmes, utilisez temporairement un mot de passe :

1. **Modifiez le workflow** `.github/workflows/deploy.yml` :

```yaml
- name: Deploy to server
  uses: appleboy/ssh-action@v1.2.0
  with:
    host: ${{ secrets.SERVER_IP }}
    username: ${{ secrets.SERVER_USERNAME }}
    password: ${{ secrets.SERVER_PASSWORD }}  # Au lieu de 'key'
    port: ${{ secrets.SERVER_PORT }}
```

1. **Ajoutez le secret** `SERVER_PASSWORD` dans GitHub

## 📞 Support

Si le problème persiste :

1. Consultez `SSH_TROUBLESHOOTING.md` pour un guide détaillé
2. Vérifiez les logs GitHub Actions pour plus de détails
