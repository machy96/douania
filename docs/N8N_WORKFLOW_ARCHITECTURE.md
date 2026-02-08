# 🤖 Douania - Workflow n8n IA Backend

## Architecture Proposée

### Composants

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   API Next.js   │────▶│   n8n Webhook   │
│   Next.js       │     │   /api/classify │     │   Trigger       │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                              ┌──────────────────────────┼──────────┐
                              │                          │          │
                              ▼                          ▼          ▼
                       ┌─────────────┐          ┌─────────────┐ ┌──────────┐
                       │  OpenAI     │          │  Pinecone   │ │  Google  │
                       │  GPT-4o     │          │  Vector DB  │ │  Sheets  │
                       │  + Vision   │          │             │ │  (Logs)  │
                       └─────────────┘          └─────────────┘ └──────────┘
```

## Workflow n8n - Classification HS Code

### Trigger: Webhook HTTP
```
POST /webhook/douania-classify
{
  "description": "Chevaux reproducteurs",
  "imageBase64": "...", (optionnel)
  "userId": "user_123",
  "sessionId": "sess_456"
}
```

### Étapes du Workflow

#### 1. **Vérification Quota** (Function Node)
```javascript
// Vérifier si l'utilisateur a encore des requêtes disponibles
const userId = $input.first().json.userId;
// Appel à la base de données pour vérifier le quota
return { continue: true, userId };
```

#### 2. **Recherche Vectorielle** (Pinecone Node)
- Recherche sémantique dans les Notes Explicatives Suisses
- Top 5 résultats les plus pertinents
- Métadonnées: code HS, chapitre, page NE

#### 3. **Classification IA** (OpenAI Node)
**Modèle:** GPT-4o (ou GPT-4o-mini pour plus rapide)

**Prompt System:**
```
Tu es un expert en classification douanière HS Code pour le Maroc (ADII).
Base-toi sur les Notes Explicatives Suisses fournies en contexte.

RÈGLES:
1. Retourne UNIQUEMENT un JSON valide
2. Code HS au format: XXXX.XX.XX.XX (10 chiffres)
3. Taux de douane en %
4. Citation exacte de la NE (pas de paraphrase)
5. Niveau de confiance: 0-100

FORMAT DE RÉPONSE:
{
  "code_hs": "0101.21.00.00",
  "designation": "Chevaux reproducteurs de race pure",
  "taux_douane": 2.5,
  "unite": "nombre",
  "confiance": 95,
  "citation_ne": "Les chevaux de race pure sont ceux reconnus...",
  "chapitre": "01",
  "page_ne": 12,
  "explications": "Classification basée sur..."
}
```

**Contexte injecté:**
- Résultats Pinecone (top 5 NE pertinentes)
- Description du produit
- Historique utilisateur (optionnel)

#### 4. **Vérification Résultat** (Function Node)
```javascript
const result = $input.first().json;

// Vérifier que le JSON est valide
// Vérifier que le code existe dans notre base
// Vérifier le niveau de confiance

if (result.confiance < 70) {
  return { 
    status: 'low_confidence',
    result,
    message: 'Confiance faible - vérification humaine recommandée'
  };
}

return { status: 'success', result };
```

#### 5. **Enregistrement** (Google Sheets ou PostgreSQL)
- Log de la classification
- Analytics: temps de réponse, confiance, tokens utilisés
- Historique utilisateur

#### 6. **Réponse Webhook** (Respond to Webhook Node)
```json
{
  "success": true,
  "code_hs": "0101.21.00.00",
  "designation": "Chevaux reproducteurs de race pure",
  "taux_douane": "2.5%",
  "taux_tva": "20%",
  "unite": "nombre",
  "confiance": 95,
  "citation_ne": "...",
  "sources": [
    {
      "type": "note_explicative_suisse",
      "chapitre": "01",
      "page": 12,
      "citation": "..."
    }
  ],
  "execution_time_ms": 2450,
  "workflow_id": "12345"
}
```

## Nodes n8n Requis

### Core Nodes
- [x] Webhook
- [x] Function
- [x] HTTP Request
- [x] Respond to Webhook

### AI Nodes
- [x] OpenAI Chat Model
- [ ] Pinecone Vector Store
- [x] Window Buffer Memory (pour contexte conversation)

### Database Nodes
- [x] Google Sheets
- [ ] PostgreSQL
- [x] Redis (cache)

### Utility Nodes
- [x] If (conditions)
- [x] Wait (rate limiting)
- [x] Merge (context aggregation)
- [x] Code (custom logic)

## Configuration Environment Variables

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Pinecone
PINECONE_API_KEY=...
PINECONE_INDEX=douania-ne
PINECONE_NAMESPACE=chapitres-01-97

# n8n Webhook
N8N_WEBHOOK_URL=https://n8n.yourdomain.com/webhook/douania-classify
N8N_WEBHOOK_SECRET=your-secret-key

# Google Sheets (Logs)
GOOGLE_SHEETS_CREDENTIALS={...}
GOOGLE_SHEETS_ID=...
```

## Workflow File JSON

Voir: `workflows/douania-classify.json`

## Installation

1. **Importer le workflow dans n8n:**
   - Copier le JSON du workflow
   - n8n → Workflows → Import

2. **Configurer les credentials:**
   - OpenAI API Key
   - Pinecone API Key
   - Google Sheets (optionnel)

3. **Activer le webhook:**
   - Obtenir l'URL webhook
   - Configurer dans le frontend

4. **Tester:**
   ```bash
   curl -X POST https://n8n.yourdomain.com/webhook/douania-classify \
     -H "Content-Type: application/json" \
     -d '{"description": "Chevaux reproducteurs", "userId": "test"}'
   ```

## Coûts Estimés (par classification)

| Service | Coût |
|---------|------|
| Pinecone (recherche) | ~$0.001 |
| OpenAI GPT-4o | ~$0.01-0.02 |
| n8n (self-hosted) | $0 |
| **Total** | **~$0.015** |

## Avantages n8n vs Code Custom

| Aspect | n8n | Code Custom |
|--------|-----|-------------|
| **Visibilité** | ✅ Visual workflow | ❌ Code only |
| **Maintenance** | ✅ Drag & drop | ❌ Dev required |
| **Monitoring** | ✅ Built-in logs | ❌ Custom setup |
| **Scalability** | ✅ Auto-scaling | ❌ Manual config |
| **Flexibility** | ✅ Easy changes | ❌ Deployment needed |
| **Cost** | ⚠️ n8n license | ✅ Free |
