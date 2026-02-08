# 🚀 Déploiement Douania MVP avec ngrok

## Étapes rapides (5 minutes)

### 1. Démarrer le Backend (Terminal 1)
```bash
cd /data/.openclaw/workspace/hsboss-project/src/backend
npm run dev
```
Le backend démarre sur http://localhost:3001

### 2. Exposer avec ngrok (Terminal 2)
```bash
# Si ngrok est installé
cd /data/.openclaw/workspace/hsboss-project/src/backend
npx ngrok http 3001

# Ou avec npx (pas besoin d'installation)
npx ngrok http 3001
```

Tu verras une URL comme : `https://abcd1234.ngrok.io`

### 3. Mettre à jour le Frontend
Remplace l'URL dans `frontend/app/page.tsx` :
```typescript
const response = await fetch('https://abcd1234.ngrok.io/api/classify', {
```

### 4. Démarrer le Frontend (Terminal 3)
```bash
cd /data/.openclaw/workspace/hsboss-project/src/frontend
npm run dev
```

### 5. Accéder à l'app
Ouvre : http://localhost:3000

---

## Alternative - Exposer aussi le Frontend

Si tu veux une URL publique complète :

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - ngrok backend
npx ngrok http 3001
# → Récupère URL: https://backend-xxx.ngrok.io

# Terminal 3 - Mettre à jour frontend/.env.local
echo "NEXT_PUBLIC_API_URL=https://backend-xxx.ngrok.io" > frontend/.env.local

# Terminal 4 - Build et start frontend
npm run build
npx serve@latest out -p 3000

# Terminal 5 - ngrok frontend
npx ngrok http 3000
# → URL finale: https://douania-xxx.ngrok.io
```

---

## Notes

- ngrok gratuit = URL temporaire (change à chaque redémarrage)
- Pour URL fixe : ngrok pro ($5/mois) ou déployer sur Railway/Vercel

## Test API
```bash
curl -X POST https://abcd1234.ngrok.io/api/classify \
  -H "Content-Type: application/json" \
  -d '{"query": "iPhone 15 Pro"}'
```
