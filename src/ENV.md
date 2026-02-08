# 🔧 Configuration Environnement Douania

## Variables d'environnement Frontend (.env.local)

```
# URL du backend (à remplacer après déploiement)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Pour production (Railway/Render):
# NEXT_PUBLIC_API_URL=https://douania-backend.up.railway.app
```

## Variables Backend (.env)

```
# Port (Railway définit automatiquement PORT)
PORT=3001

# Mode
NODE_ENV=production
```

## URLs par environnement

### Développement local
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Production (Railway)
- Frontend: https://douania-frontend.up.railway.app
- Backend: https://douania-backend.up.railway.app

### Production (Vercel + Railway)
- Frontend: https://douania.vercel.app
- Backend: https://douania-backend.up.railway.app

## Commandes utiles

```bash
# Développement
cd backend && npm run dev      # http://localhost:3001
cd frontend && npm run dev     # http://localhost:3000

# Production local
cd backend && npm run build && npm start
cd frontend && npm run build && npx serve out

# Déploiement
bash deploy-railway.sh         # Déploie tout
```
