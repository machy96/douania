# Configuration n8n pour Douania Frontend

## Variables d'environnement

Créer un fichier `.env.local` à la racine du frontend :

```bash
# URL du webhook n8n (obligatoire)
N8N_WEBHOOK_URL=http://147.93.52.143:32771/webhook/hsboss-classify

# Activer/désactiver n8n (optionnel, défaut: true)
USE_N8N=true
```

## Workflows n8n disponibles

| Workflow | URL Webhook | Description |
|----------|-------------|-------------|
| **Douania Basic** | `/webhook/douania-classify` | GPT-4o simple |
| **HSBoss Agent** | `/webhook/hsboss-classify` | Agent avec règles HSBoss |
| **HSBoss RAG** | `/webhook/hsboss-rag` | Agent + Pinecone RAG |

## Configuration Vercel

Dans les variables d'environnement Vercel :

```
N8N_WEBHOOK_URL = http://147.93.52.143:32771/webhook/hsboss-classify
USE_N8N = true
```

## Test local

```bash
cd src/frontend
npm install
# Créer .env.local avec N8N_WEBHOOK_URL
npm run dev
```

## Architecture

```
Frontend (Next.js)
       │
       ▼
/api/classify (route.ts)
       │
       ▼
HSBoss Agent n8n
       │
       ▼
GPT-4o + RAG (optionnel)
```

## Fallback

Si n8n est indisponible :
- Timeout après 30 secondes
- Message d'erreur user-friendly
- Suggestion de réessayer

## Déploiement Vercel

### Option 1 : Git Integration (Recommandé)
1. Connecte ton repo GitHub à Vercel
2. Les pushes déclenchent automatiquement le déploiement
3. Configure les variables d'environnement dans Vercel Dashboard

### Option 2 : CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Vérification post-déploiement
Teste la classification :
```bash
curl -X POST https://TON-URL.vercel.app/api/classify \
  -H "Content-Type: application/json" \
  -d '{"description": "Chevaux reproducteurs"}'
```

## Troubleshooting

| Erreur | Solution |
|--------|----------|
| `n8n_unavailable` | Vérifier que le workflow est actif dans n8n |
| `Timeout` | Augmenter le timeout ou vérifier la latence serveur |
| `Invalid JSON` | Vérifier le format de la réponse n8n |

## Sécurité

- Pas de clé API exposée dans le frontend
- Appels server-side uniquement (route API Next.js)
- Validation des entrées
- Timeout pour éviter les blocages
