# 🚀 Déploiement Railway - URL Publique Permanente

## ÉTAPES (5 minutes)

### 1. Créer compte Railway
- Aller sur https://railway.app
- S'inscrire avec GitHub ou email

### 2. Installer Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### 3. Déployer le Backend
```bash
cd hsboss-project/src/backend

# Utiliser le package.json pour Railway
cp railway-package.json package.json

# Initialiser projet Railway
railway init --name douania-backend

# Déployer
railway up

# Récupérer l'URL publique
railway domain
# → https://douania-backend.up.railway.app
```

### 4. Déployer le Frontend
```bash
cd hsboss-project/src/frontend

# Créer fichier .env.local
echo "NEXT_PUBLIC_API_URL=https://douania-backend.up.railway.app" > .env.local

# Build statique
npm run build

# Déployer sur Railway (ou Vercel)
railway init --name douania-frontend
railway up

# OU déployer sur Vercel (plus rapide pour frontend)
npx vercel --prod
```

### 5. URL Finale
- **Backend**: https://douania-backend.up.railway.app
- **Frontend**: https://douania-frontend.up.railway.app (ou Vercel)

---

## Accès depuis n'importe où
Une fois déployé, tu peux accéder à l'app depuis :
- 📱 Ton téléphone
- 💻 N'importe quel PC
- 🌍 Partager l'URL à Nasser

---

## Alternative - Render (Gratuit aussi)
Si Railway demande carte bancaire :
1. Aller sur https://render.com
2. New Web Service → Connecter GitHub
3. Build command: `npm install && npm run build`
4. Start command: `npm start`

---

## Alternative - Mon Serveur (si tu en as un)
Si tu as un VPS/serveur avec IP publique :
```bash
# Sur ton serveur
git clone [repo]
cd douania/src/backend
npm install
npm start

# URL: http://TON_IP:3001
```

---

**Quelle option tu choisis ?** Je prépare la config en fonction. 🚀
