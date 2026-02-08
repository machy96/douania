# 🚀 CI/CD - Push Auto vers Serveur

## Solution Proposée : GitHub + GitHub Actions

### Architecture
```
[Tu demandes une modif]
    ↓
[Je code sur workspace]
    ↓
[Git Push vers GitHub]
    ↓
[GitHub Actions déclenché]
    ↓
[Déploiement auto Railway/Render/Vercel]
    ↓
[URL publique accessible]
```

---

## ÉTAPES À CONFIGURER

### 1. Créer repo GitHub
```bash
# Sur GitHub.com, créer repo "douania"
# Puis donner-moi accès (username GitHub) ou clé SSH
```

### 2. Je configure le push
```bash
cd /data/.openclaw/workspace/hsboss-project
git init
git remote add origin https://github.com/[TON_USER]/douania.git
git add .
git commit -m "Initial commit MVP"
git push -u origin main
```

### 3. GitHub Actions (déploiement auto)
Fichier `.github/workflows/deploy.yml` :
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railway/cli@v2
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
      - run: railway up --service douania-backend
  
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action-deploy@v1
        with:
          vercel_token: ${{ secrets.VERCEL_TOKEN }}
```

### 4. Workflow
```
1. Tu demandes une modif (ex: "ajouter bouton export")
2. Je code la modif
3. Je fais: git add . && git commit -m "feat: bouton export" && git push
4. GitHub Actions déploie automatiquement
5. Tu vois la modif sur l'URL en ~2 minutes
```

---

## ALTERNATIVE - Ton Serveur

Si tu as un VPS/serveur dédié :

### Sur ton serveur
```bash
# Créer webhook
mkdir -p /var/www/douania
cd /var/www/douania && git init --bare

# Hook post-receive
cat > hooks/post-receive << 'EOF'
#!/bin/bash
cd /var/www/douania-live
git pull origin main
npm install
npm run build
pm2 restart douania
EOF
chmod +x hooks/post-receive
```

### Depuis mon workspace
```bash
git remote add production ssh://user@TON_IP/var/www/douania
git push production main
```

---

## CE QUE TU DOIS ME FOURNIR

Option A (GitHub) :
- Ton username GitHub
- Je te demande de créer repo et de m'ajouter

Option B (Ton serveur) :
- IP du serveur
- User SSH
- Clé SSH ou mot de passe (chiffré)

Option C (Railway direct) :
- Ton compte Railway
- Token API (je gère le déploiement)

---

**Quelle option tu préfères ?** Je prépare la config. 🚀
