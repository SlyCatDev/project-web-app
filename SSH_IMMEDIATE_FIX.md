# 🚨 DIAGNOSTIC SSH - Votre problème actuel

## Erreur constatée :
```
2025/05/24 14:45:43 ssh.ParsePrivateKey: ssh: no key found
2025/05/24 14:45:44 ssh: handshake failed: ssh: unable to authenticate
```

## 🔍 Diagnostic en cours...

Cette erreur indique que :
1. ❌ La clé privée n'est pas trouvée ou mal formatée
2. ❌ L'authentification SSH échoue complètement

## ✅ SOLUTION IMMÉDIATE

### Étape 1 : Vérifiez vos secrets GitHub actuels

Allez dans votre repository GitHub :
- Settings → Secrets and variables → Actions
- Vérifiez que vous avez bien ces 4 secrets :
  - `SERVER_IP`
  - `SERVER_USERNAME` 
  - `PRIVATE_KEY`
  - `SERVER_PORT`

### Étape 2 : Régénérez complètement les clés SSH

```bash
# Supprimer les anciennes clés si elles existent
rm -rf ~/.ssh/github-actions

# Utiliser notre script automatisé
./setup-ssh-keys.sh VOTRE_UTILISATEUR@VOTRE_IP_SERVEUR
```

**Remplacez par vos vraies informations**, par exemple :
```bash
./setup-ssh-keys.sh deploy@195.110.35.76
```

### Étape 3 : Copiez la nouvelle clé privée EXACTEMENT

Le script va afficher quelque chose comme :
```
--- DÉBUT DE LA CLÉ PRIVÉE ---
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACBK4+Xl1+H...
[... plusieurs lignes ...]
-----END OPENSSH PRIVATE KEY-----
--- FIN DE LA CLÉ PRIVÉE ---
```

**IMPORTANT** : Copiez TOUT, y compris les lignes `-----BEGIN` et `-----END`

### Étape 4 : Remplacez le secret PRIVATE_KEY

1. Supprimez l'ancien secret `PRIVATE_KEY` dans GitHub
2. Créez un nouveau secret `PRIVATE_KEY`
3. Collez la clé complète (avec BEGIN et END)

### Étape 5 : Testez la connexion

```bash
./test-ssh-connection.sh VOTRE_UTILISATEUR@VOTRE_IP_SERVEUR
```

Si ça fonctionne, vous devriez voir :
```
✅ Connexion SSH réussie
✅ Test terminé ! Votre serveur semble prêt pour le déploiement.
```

### Étape 6 : Relancez le déploiement

```bash
git commit --allow-empty -m "🔄 Test SSH configuration"
git push origin main
```

## 🔧 Alternative rapide si SSH ne fonctionne toujours pas

Si vous continuez à avoir des problèmes, utilisez temporairement un mot de passe :

1. **Modifiez le workflow** (remplacez la section Deploy) :

```yaml
- name: Deploy to server
  uses: appleboy/ssh-action@v1.2.0
  with:
    host: ${{ secrets.SERVER_IP }}
    username: ${{ secrets.SERVER_USERNAME }}
    password: ${{ secrets.SERVER_PASSWORD }}
    port: ${{ secrets.SERVER_PORT || 22 }}
    timeout: 60s
    command_timeout: 5m
    script: |
      # ... votre script de déploiement ...
```

2. **Ajoutez le secret** `SERVER_PASSWORD` dans GitHub avec le mot de passe de votre utilisateur

## 📋 Checklist de vérification

- [ ] Script `setup-ssh-keys.sh` exécuté avec les bonnes informations
- [ ] Clé privée copiée COMPLÈTEMENT (avec BEGIN/END)
- [ ] Ancien secret PRIVATE_KEY supprimé et recréé
- [ ] Test de connexion réussi
- [ ] Tous les 4 secrets configurés dans GitHub

## 🆘 Informations nécessaires

Pour vous aider davantage, j'ai besoin de savoir :
1. **Avez-vous accès à un serveur VPS ?** (IP, utilisateur, mot de passe)
2. **Quel est votre hébergeur ?** (OVH, DigitalOcean, AWS, etc.)
3. **Pouvez-vous vous connecter en SSH depuis votre machine ?**

## 📞 Support immédiat

Si vous voulez une solution rapide, donnez-moi :
- L'IP de votre serveur
- Le nom d'utilisateur SSH
- Et on règle ça ensemble !
