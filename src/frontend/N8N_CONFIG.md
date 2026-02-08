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

## Sécurité

- Pas de clé API exposée dans le frontend
- Appels server-side uniquement (route API Next.js)
- Validation des entrées
