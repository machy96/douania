# 🏗️ Architecture Decisions - Douania

## Résumé Exécutif

Ce document présente les décisions d'architecture technique pour Douania, avec comparaison des options et recommandations.

---

## 1. Frontend

### Option A: Next.js 14 (RECOMMANDÉ)
**Avantages:**
- SSR natif (SEO, performance)
- App Router moderne
- Vercel hosting optimisé
- React Server Components
- API Routes intégrées

**Inconvénients:**
- Complexité plus élevée que CRA
- Lock-in Vercel (optionnel)

**Coût:** Gratuit (Vercel Hobby) → $20/mois (Pro)

### Option B: React + Vite
**Avantages:**
- Plus léger
- Build rapide
- Flexibilité totale

**Inconvénients:**
- Pas de SSR natif
- Nécessite configuration SEO

**Verdict:** Next.js 14 pour SSR et DX optimale.

---

## 2. Backend

### Option A: Node.js + Fastify (RECOMMANDÉ)
**Avantages:**
- Ultra-performant (plus rapide qu'Express)
- Async/await natif
- Écosystème npm riche
- Même langage que frontend

**Inconvénients:**
- Callbacks si mal géré

**Coût:** Railway ~$5-20/mois

### Option B: Python + FastAPI
**Avantages:**
- Excellent pour ML/AI
- Typage moderne
- Documentation auto

**Inconvénients:**
- Context switch frontend/backend
- Moins performant async

**Verdict:** Node.js + Fastify pour cohérence stack.

---

## 3. Base de Données

### Option A: PostgreSQL (RECOMMANDÉ)
**Avantages:**
- Open source, mature
- Full-text search (tsvector)
- JSONB pour flexibilité
- Extensions (PostGIS si besoin)

**Coût:** Supabase/Railway ~$0-25/mois

### Option B: MongoDB
**Avantages:**
- Schema flexible
- Bon pour documents

**Inconvénients:**
- Moins adapté relations
- Consistency éventuelle

**Verdict:** PostgreSQL pour structure tarifaire rigide.

---

## 4. Vector DB (RAG)

### Option A: Pinecone (RECOMMANDÉ pour démarrer)
**Avantages:**
- Fully managed
- Scale automatique
- Métadonnées riches

**Coût:** ~$70/mois (production)

### Option B: Weaviate (Self-hosted)
**Avantages:**
- Open source
- Controle total

**Inconvénients:**
- Ops overhead

**Verdict:** Pinecone pour démarrer rapide, migrer vers Weaviate si volume important.

---

## 5. AI/LLM

### Option A: OpenAI GPT-4o (RECOMMANDÉ)
**Avantages:**
- Meilleure qualité RAG
- Réponse structurée (JSON mode)
- Vision (future feature image)

**Coût:** ~$0.01-0.03/requête

### Option B: Claude (Anthropic)
**Avantages:**
- Context window 200K
- Excellente compréhension

**Inconvénients:**
- Plus cher
- Moins bon pour JSON structuré

**Verdict:** GPT-4o pour coût/performance.

---

## 6. Authentification

### Option A: Clerk (RECOMMANDÉ)
**Avantages:**
- Moderne, React-optimisé
- MFA, SSO
- Webhooks
- UI components

**Coût:** Gratuit (10K users) → $25/mois

### Option B: Auth0
**Avantages:**
- Enterprise ready

**Inconvénients:**
- Plus cher
- Complexité

**Verdict:** Clerk pour simplicité et coût.

---

## 7. Hébergement

| Service | Utilisation | Coût estimé |
|---------|-------------|-------------|
| Vercel | Frontend | $20/mois |
| Railway | Backend + DB | $20-50/mois |
| Pinecone | Vector DB | $70/mois |
| OpenAI | LLM | $100-500/mois |
| Clerk | Auth | $25/mois |
| **TOTAL** | | **~$235-665/mois** |

---

## 8. Schéma Technique Final

```
┌─────────────────────────────────────────────────────────────┐
│                      DOUANIA ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐          ┌─────────────┐                 │
│   │   Vercel    │          │   Railway   │                 │
│   │             │          │             │                 │
│   │  Next.js 14 │◄────────►│  Node.js    │                 │
│   │  Frontend   │   API    │  Fastify    │                 │
│   │             │          │             │                 │
│   └─────────────┘          └──────┬──────┘                 │
│                                    │                        │
│                         ┌─────────┼─────────┐               │
│                         │         │         │               │
│                         ▼         ▼         ▼               │
│                   ┌────────┐ ┌────────┐ ┌────────┐         │
│                   │PostgreSQL│ │ Redis  │ │Pinecone│         │
│                   │         │ │        │ │        │         │
│                   └────────┘ └────────┘ └────────┘         │
│                         │                                   │
│                         │ Embeddings                        │
│                         ▼                                   │
│                   ┌─────────────┐                          │
│                   │  OpenAI     │                          │
│                   │  GPT-4o     │                          │
│                   └─────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Alternatives Low-Cost (MVP)

Pour démarrer avec budget minimal (~$50/mois):

| Service | Alternative | Coût |
|---------|-------------|------|
| Vector DB | Pas de RAG, search SQL | $0 |
| LLM | GPT-3.5-turbo | ~$20/mois |
| Hosting | Render free tier | $0 |
| DB | Supabase free | $0 |
| **TOTAL MVP** | | **~$20-50/mois** |

---

## 10. Recommandations

### Phase MVP (Mois 1-3)
- Next.js 14 + Fastify
- PostgreSQL (Supabase)
- GPT-3.5-turbo
- Pas de Vector DB (search SQL)
- Clerk auth

### Phase Scale (Mois 4-12)
- Migrer vers Pinecone
- Upgrade GPT-4o
- Railway/Vercel Pro

### Pourquoi ces choix?
1. **Vitesse de développement** → Next.js + Node
2. **Type safety** → TypeScript partout
3. **Coût optimisé** → Start simple, scale quand CA
4. **Maintenabilité** → Stack populaire, communauté

---

*Document créé le 2026-02-08*
