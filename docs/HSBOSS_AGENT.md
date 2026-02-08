# 🤖 HSBoss Agent - Documentation

## Architecture de l'Agent IA

```
┌─────────────────────────────────────────────────────────────┐
│                    HSBoss Agent v1.0                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Webhook    │───▶│    Agent     │───▶│   Response   │  │
│  │   Trigger    │    │   GPT-4o     │    │   Formatter  │  │
│  └──────────────┘    └──────┬───────┘    └──────────────┘  │
│                             │                               │
│                    ┌────────▼────────┐                      │
│                    │  RAG System     │                      │
│                    │  (Future:       │                      │
│                    │   Pinecone)     │                      │
│                    └─────────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Capacités de l'Agent HSBoss

### 1. 🧠 Mémoire de Session
- Garde l'historique de la conversation
- Contextualise les questions suivantes
- Apprend des précédentes classifications

### 2. 📚 Système RAG (Phase 2)
**Actuellement :** Prompt système avec règles HSBoss  
**Phase 2 :** Intégration Pinecone avec :
- Indexation des 97 Notes Explicatives Suisses
- Recherche vectorielle par similarité
- Retrieval des passages pertinents

### 3. 🎯 Règles HSBoss Intégrées

#### Arbre Décisionnel Automatisé
```
Produit
├── Type : Matière / Produit fini ?
├── Fonction : Usage principal ?
├── Matériau : Base constituante ?
├── Destination : Consommation / Reproduction / Industrie ?
└── Origine : Pays (règles préférentielles)
```

#### Validation Automatique
- ✅ Format code HS : XXXX.XX.XX.XX
- ✅ Citation NE exacte (pas de paraphrase)
- ✅ Taux de douane vérifié
- ✅ Score de confiance calculé

### 4. 🚨 Alertes Intelligentes
- Contingents tarifaires
- Restrictions RGI
- Accords commerciaux (Turquie, UE...)
- Exigences documentaires

## Utilisation

### Requête Simple
```bash
POST /webhook/hsboss-classify
{
  "description": "Chevaux reproducteurs de race pure",
  "userId": "user_123"
}
```

### Requête avec Contexte
```bash
POST /webhook/hsboss-classify
{
  "description": "Non, je parle des autres chevaux",
  "userId": "user_123",
  "sessionId": "sess_456",
  "history": [
    {"role": "user", "content": "Chevaux"},
    {"role": "assistant", "content": "0101.21 - Reproducteurs"}
  ]
}
```

## Réponse Structurée

```json
{
  "success": true,
  "code_hs": "0101.29.10.00",
  "designation": "Chevaux destinés à la boucherie",
  "taux_douane": "10%",
  "taux_tva": "20%",
  "unite": "nombre",
  "confiance": 92,
  "neCitation": "Cette position comprend les chevaux...",
  "chapitre": "01",
  "section": "Animaux vivants",
  "analyse": "Classification basée sur la destination...",
  "alertes": ["Contingent tarifaire annuel de 20 têtes"],
  "recommandations": "Attestation sanitaire requise...",
  "sources_verifiees": true,
  "sessionId": "sess_456"
}
```

## Évolution vers RAG Complet

### Phase 1 (Actuelle) : Agent avec Prompt
- ✅ Agent GPT-4o avec règles HSBoss
- ✅ Validation automatique
- ✅ Format JSON structuré
- ⚠️ Pas de retrieval vectoriel

### Phase 2 : RAG avec Pinecone
```
Description Produit
        │
        ▼
┌───────────────┐
│  Embedding    │───▶ Pinecone
│  (OpenAI)     │      Vector DB
└───────────────┘           │
                            ▼
                    Top 5 NE similaires
                            │
                            ▼
┌───────────────┐
│  Context      │───▶ Agent GPT-4o
│  Retrieval    │      + RAG
└───────────────┘
```

### Configuration Pinecone

```javascript
// Index Pinecone recommandé
{
  "index_name": "douania-ne",
  "dimension": 1536,  // OpenAI embeddings
  "metric": "cosine",
  "namespace": "notes-explicatives",
  "metadata": {
    "chapitre": "01",
    "code_hs": "0101.21",
    "page": 12,
    "text": "Contenu NE..."
  }
}
```

## Coûts Estimés

| Composant | Coût/Requête |
|-----------|--------------|
| GPT-4o (Agent) | ~$0.01-0.02 |
| Embeddings (Phase 2) | ~$0.001 |
| Pinecone (Phase 2) | ~$0.0001 |
| **Total** | **~$0.015** |

## Sécurité

- Clé API OpenAI stockée dans Credentials n8n
- Pas de logs des données sensibles
- Rate limiting configurable
- Validation des entrées

## Prochaines Améliorations

1. **Multi-modal** : Analyse d'images produits
2. **Bulk processing** : Classifier 100+ produits
3. **API publique** : Accès pour clients ERP
4. **Feedback loop** : Apprentissage des corrections
