# N8N Skill pour Douania

## 🎯 Objectif
Intégrer n8n comme backend IA pour Douania avec workflows automatisés de classification HS Code.

## 📚 Ressources Maîtrisées

### 1. n8n MCP Server
- **GitHub:** https://github.com/leonardsellem/n8n-mcp-server
- **Package:** `@leonardsellem/n8n-mcp-server`
- **Fonction:** Permet aux IA de créer/gérer des workflows n8n via protocole MCP

### 2. Architecture Workflow
Voir: `/docs/N8N_WORKFLOW_ARCHITECTURE.md`

### 3. Workflow Prêt à l'emploi
Fichier: `/workflows/n8n-douania-classify.json`

## 🚀 Installation Rapide

### Option A - n8n Cloud (Recommandé pour tests)
1. Créer compte sur https://n8n.io/cloud
2. Importer le workflow: `n8n-douania-classify.json`
3. Configurer credentials OpenAI
4. Copier l'URL webhook
5. Mettre à jour `NEXT_PUBLIC_N8N_WEBHOOK_URL` dans le frontend

### Option B - Self-Hosted (Production)
```bash
# Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Accès: http://localhost:5678
```

## 🔧 Configuration Workflow

### 1. Credentials Requis
- **OpenAI API Key** (obligatoire)
- Pinecone API Key (optionnel - pour recherche vectorielle)
- Google Sheets (optionnel - pour logs)

### 2. Variables d'Environnement
```bash
# Frontend (.env.local)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n.app/webhook/douania-classify
N8N_WEBHOOK_SECRET=your-secret-key

# n8n (dans n8n UI: Settings > Credentials)
OPENAI_API_KEY=sk-...
```

## 📋 Workflows Disponibles

### Workflow 1: Classification Simple
**Fichier:** `n8n-douania-classify.json`

**Inputs:**
```json
{
  "description": "Chevaux reproducteurs de race pure",
  "userId": "user_123"
}
```

**Outputs:**
```json
{
  "success": true,
  "code_hs": "0101.21.00.00",
  "designation": "Chevaux reproducteurs de race pure",
  "taux_douane": "2.5%",
  "taux_tva": "20%",
  "unite": "nombre",
  "confiance": 95,
  "neCitation": "Les chevaux de race pure sont ceux reconnus...",
  "explication": "Ce code correspond à des chevaux..."
}
```

**Coût estimé:** $0.01-0.02 par classification

## 🔄 Intégration Frontend

### API Route Modifiée
```typescript
// app/api/classify/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Appeler n8n webhook au lieu de la logique locale
  const response = await fetch(process.env.N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-Webhook-Secret': process.env.N8N_WEBHOOK_SECRET
    },
    body: JSON.stringify(body)
  });
  
  return NextResponse.json(await response.json());
}
```

## 🎓 Commandes MCP n8n

Si tu installes le MCP Server n8n:

```json
// claude_desktop_config.json ou settings.json
{
  "mcpServers": {
    "n8n": {
      "command": "npx",
      "args": ["-y", "@leonardsellem/n8n-mcp-server"],
      "env": {
        "N8N_API_URL": "http://localhost:5678/api/v1",
        "N8N_API_KEY": "n8n_api_..."
      }
    }
  }
}
```

**Commandes disponibles:**
- `workflow_list` - Lister tous les workflows
- `workflow_create` - Créer un nouveau workflow
- `workflow_update` - Modifier un workflow existant
- `execution_run` - Exécuter un workflow
- `run_webhook` - Appeler un webhook

## 💡 Prochaines Étapes Recommandées

1. **Tester le workflow n8n** avec un compte n8n cloud
2. **Connecter Pinecone** pour recherche vectorielle des NE
3. **Ajouter n8n-nodes-mcp** pour interagir avec d'autres MCP servers
4. **Monitoring** avec Sentry pour les erreurs de workflow

## 📊 Benchmarks

| Approche | Latence | Coût/mois | Maintenance |
|----------|---------|-----------|-------------|
| Code Custom (actuel) | ~500ms | ~$0 | Élevée |
| n8n + OpenAI | ~2-3s | ~$50-100 | Moyenne |
| n8n + Pinecone + OpenAI | ~1-2s | ~$100-200 | Faible |

## 🔗 Liens Utiles

- n8n Documentation: https://docs.n8n.io
- n8n MCP Server: https://github.com/leonardsellem/n8n-mcp-server
- n8n Community Nodes: https://n8n.io/integrations
- OpenAI Pricing: https://openai.com/pricing
