# 📋 Product Requirements Document (PRD)

## Douania - HS Code Intelligence Platform

**Version:** 1.0  
**Date:** 2026-02-08  
**Status:** Draft  
**Auteurs:** Kamal Jadari (Also Logistics), Nasser, Hike

---

## 1. Overview & Vision

### 1.1 Problématique

La classification douanière des produits est un enjeu critique pour :
- **Transitaires** : déclarer rapidement des marchandises diverses
- **Importateurs** : connaître droits et taxes applicables
- **Experts douane** : valider des classifications complexes

**Défis actuels :**
- Temps de recherche : 15-30 min par produit
- Complexité tarif ADII
- Risque d'erreur (sanctions douanières)
- Accès difficile aux Notes Explicatives OMA

### 1.2 Vision Produit

**Douania** = Plateforme SaaS IA spécialisée classification HS Code pour le Maroc.

**Proposition de valeur :**
- Spécialisation Maroc/ADII
- Citations NE suisses sourcées
- Temps de recherche : 15-30 min → quelques secondes
- Alertes conformité proactive

### 1.3 Tagline

> "L'expert HS Code qui ne dort jamais"

---

## 2. User Personas

### Persona 1 : Ahmed - Transitaire Indépendant
- **Profil:** 35-50 ans, 10+ ans expérience, Casablanca/Tanger Med
- **Frustrations:** 
  - "Je perds trop de temps dans le tarif ADII"
  - "Certaines positions sont ambiguës"
- **Besoins:** Recherche rapide, citations sources, historique

### Persona 2 : Yasmine - Importatrice PME
- **Profil:** 30-45 ans, Directrice import/export
- **Frustrations:**
  - "Je veux vérifier le code de mon transitaire"
  - "Coûts d'importation imprévisibles"
- **Besoins:** Interface simple, taux en temps réel

### Persona 3 : Nasser - Expert Douane Senior
- **Profil:** 45-60 ans, 20+ ans, consultant
- **Frustrations:**
  - "Je perds du temps sur les Notes Explicatives"
  - "Besoin de sources vérifiables"
- **Besoins:** Accès NE complètes, arbres décision, API

---

## 3. User Stories

### US-001 : Classification textuelle
**En tant que** transitaire  
**Je veux** saisir une description produit  
**Afin d'** obtenir le code HS

**Critères:**
- Résultat < 5 secondes
- Code formaté XXXX.XX.XX.XX
- Taux + unité visibles
- Niveau confiance affiché

### US-002 : Vérification code existant
**En tant qu'** importateur  
**Je veux** vérifier un code HS  
**Afin d'** être sûr de mon transitaire

### US-003 : Citation sources NE
**En tant qu'** expert douane  
**Je veux** accéder aux Notes Explicatives  
**Afin d'** sourcer mes classifications

### US-004 : Export rapport PDF
**En tant que** transitaire  
**Je veux** exporter un rapport  
**Afin d'** le transmettre à mon client

### US-005 : Classification batch
**En tant que** transitaire  
**Je veux** uploader un Excel  
**Afin d'** classifier en masse

---

## 4. Feature Requirements

### Must Have (MVP)
| ID | Feature | User Story |
|----|---------|------------|
| F-001 | Classification textuelle | US-001 |
| F-002 | Vérification code HS | US-002 |
| F-003 | Affichage taux ADII | US-001 |
| F-004 | Citation NE suisses | US-003 |
| F-005 | Export PDF | US-004 |
| F-006 | Authentification | - |
| F-007 | Gestion quotas | - |

### Should Have (Phase 2)
| ID | Feature | User Story |
|----|---------|------------|
| F-008 | Classification image | - |
| F-009 | Contexte pays origine | - |
| F-010 | Analyse RGI | - |
| F-011 | Bulk Excel | US-005 |
| F-012 | API publique | - |

### Nice to Have (Phase 3)
| ID | Feature |
|----|---------|
| F-013 | Chatbot conversationnel |
| F-014 | Veille réglementaire |
| F-015 | Marketplace experts |
| F-016 | Multi-pays (Tunisie, Algérie) |
| F-017 | White-label |

---

## 5. Business Model

| Plan | Prix | Cible | Features |
|------|------|-------|----------|
| **Starter** | 299 DH/mois | Petits importateurs | 50 req/mois |
| **Pro** | 799 DH/mois | Transitaires | Illimité, API |
| **Enterprise** | Sur devis | Grands groupes | White-label, SSO |

---

## 6. Technical Architecture

### Stack Recommandé

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 14 + Tailwind |
| Backend | Node.js + Fastify |
| AI/LLM | OpenAI GPT-4o |
| Vector DB | Pinecone |
| Database | PostgreSQL 15 |
| Cache | Redis |
| Auth | Clerk |
| Hosting | Vercel + Railway |
| Monitoring | Sentry + PostHog |

### Architecture Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   Web App   │────▶│   API GW    │────▶│  Backend        │
│   Next.js   │     │             │     │  Node/Fastify   │
└─────────────┘     └─────────────┘     └────────┬────────┘
                                                  │
                       ┌──────────────────────────┼──────────┐
                       │                          │          │
                       ▼                          ▼          ▼
                ┌─────────────┐          ┌─────────────┐ ┌──────────┐
                │  AI/RAG     │          │  PostgreSQL │ │  Redis   │
                │  GPT-4o     │          │             │ │          │
                └─────────────┘          └─────────────┘ └──────────┘
                       │
                       ▼
                ┌─────────────┐
                │  Vector DB  │
                │  Pinecone   │
                └─────────────┘
```

---

## 7. Data Models

### Table: users
```sql
id UUID PRIMARY KEY
email VARCHAR(255) UNIQUE
nom VARCHAR(100)
entreprise VARCHAR(100)
plan VARCHAR(20) -- free, starter, pro, enterprise
quota_requetes INTEGER
requetes_utilisees INTEGER
created_at TIMESTAMP
```

### Table: positions (Tarif ADII)
```sql
code_hs VARCHAR(12) PRIMARY KEY -- XXXX.XX.XX.XX
chapitre VARCHAR(2)
designation_fr TEXT
designation_ar TEXT
taux_douane DECIMAL(5,2)
unite VARCHAR(20)
regime VARCHAR(20)
source_ne TEXT
exclusions TEXT[]
```

### Table: classifications
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users
query TEXT
result_code_hs VARCHAR(12)
confiance DECIMAL(3,2)
sources JSONB
created_at TIMESTAMP
```

---

## 8. API Specifications

### POST /classify
```http
POST /api/v1/classify
Authorization: Bearer {token}

{
  "description": "Chauffe-eau solaire",
  "context": {"pays_origine": "CN"}
}
```

**Response:**
```json
{
  "code_hs": "8419.81.10.00",
  "designation": "Chauffe-eau solaire...",
  "taux_douane": 2.5,
  "confiance": 0.95,
  "sources": [...]
}
```

---

## 9. Timeline

| Phase | Durée | Livrables |
|-------|-------|-----------|
| **MVP** | 2-3 mois | Chat, classification, PDF |
| **V2** | 3-6 mois | Image, bulk, API |
| **V3** | 6-12 mois | Multi-pays, white-label |

---

## 10. Success Metrics

| KPI | Target |
|-----|--------|
| Temps classification | < 5 secondes |
| Précision codes | > 90% |
| Satisfaction users | > 4.5/5 |
| Retention mensuelle | > 80% |

---

*Document créé le 2026-02-08*
