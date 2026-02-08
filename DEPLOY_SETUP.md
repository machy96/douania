# 🚀 Déploiement Douania - Configuration Automatique

## 🔐 Accès Reçus
- ✅ GitHub: machy96
- ✅ Railway Token: e17625aa-637e-450c-8ee5-f02bb1b24b33

---

## ÉTAPE 1: Créer le Repository GitHub

### Commandes à exécuter:

```bash
cd /data/.openclaw/workspace/hsboss-project

# Initialiser git
git init
git add .
git commit -m "Initial commit - Douania MVP"

# Connecter à GitHub
git remote add origin https://github.com/machy96/douania.git

# Push
git branch -M main
git push -u origin main
```

---

## ÉTAPE 2: Configurer Railway (Backend)

### Option A - CLI (Terminal)
```bash
cd src/backend

# Installer Railway CLI
npm install -g @railway/cli

# Login avec token
railway login --token e17625aa-637e-450c-8ee5-f02bb1b24b33

# Créer projet
railway init --name douania-backend

# Déployer
railway up

# Obtenir l'URL
railway domain
```

### Option B - Dashboard Web (Plus Simple)
1. Aller sur https://railway.app
2. Login avec GitHub
3. New Project → Deploy from GitHub repo
4. Sélectionner "machy96/douania"
5. Configurer:
   - Root Directory: `src/backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

---

## ÉTAPE 3: Configurer Vercel (Frontend)

### Via CLI:
```bash
cd src/frontend

# Installer Vercel
npm install -g vercel

# Login
vercel login

# Déployer
vercel --prod
```

### Variables d'environnement:
```
NEXT_PUBLIC_API_URL=https://douania-backend.up.railway.app
```

---

## 🔧 FICHIERS DE CONFIGURATION

### `railway.json` (à créer dans src/backend/)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### `vercel.json` (à créer dans src/frontend/)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@douania-api-url"
  }
}
```

---

## 📋 CHECKLIST DÉPLOIEMENT

- [ ] Créer repo GitHub `douania`
- [ ] Pusher le code
- [ ] Déployer backend sur Railway
- [ ] Noter l'URL backend
- [ ] Mettre à jour NEXT_PUBLIC_API_URL dans frontend
- [ ] Déployer frontend sur Vercel
- [ ] Tester l'application

---

## 🌐 URLS FINALES ATTENDUES

- **Backend**: https://douania-backend-production.up.railway.app
- **Frontend**: https://douania.vercel.app

---

*Configuration générée le 2026-02-08*
