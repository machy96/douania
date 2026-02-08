# 📋 Spécifications Techniques - Douania

## 🎨 Design System

### Identité Visuelle
- **Nom:** Douania (de "Douane" + "IA")
- **Tagline:** "L'expert HS Code qui ne dort jamais"
- **Couleurs:**
  - Primaire: `#0066CC` (bleu douane)
  - Secondaire: `#00AA66` (vert validation)
  - Accent: `#FF6B35` (orange alerte)
  - Fond: `#F8FAFC` (gris clair)
  - Texte: `#1A202C` (gris foncé)

### Typographie
- **Titres:** Inter Bold
- **Corps:** Inter Regular
- **Code:** JetBrains Mono

### Logo
À créer: pictogramme berger allemand stylisé + élément douane (balance/bouclier)

---

## 🗂️ Architecture des Pages

### Public
```
/                    → Landing page
/about               → À propos
/pricing             → Tarifs
/contact             → Contact
```

### Application (authentifié)
```
/dashboard           → Tableau de bord
/chat                → Interface chat HSBoss
/classify            → Classification produit
/history             → Historique recherches
/settings            → Paramètres compte
```

### Admin
```
/admin/users         → Gestion utilisateurs
/admin/analytics     → Statistiques
/admin/content       → Gestion base HS
```

---

## 🔌 API Endpoints

### Classification
```http
POST /api/classify
Content-Type: application/json

{
  "description": "Chauffe-eau solaire avec appoint électrique",
  "context": "Import au Maroc"
}

Response:
{
  "code_hs": "8419.81.10.00",
  "designation": "Chauffe-eau solaire avec appoint électrique",
  "taux_douane": "2.5",
  "unite": "nombre",
  "regime": "STANDARD",
  "confiance": 0.95,
  "sources": [
    {
      "type": "NE_suisse",
      "chapitre": "84",
      "position": "8419.81",
      "url": "..."
    }
  ],
  "exclusions": ["8516.10", "8419.19"],
  "arbre_decision": [...]
}
```

### Vérification Code
```http
GET /api/verify/{code_hs}

Response:
{
  "code_hs": "8419.81.10.00",
  "valide": true,
  "designation": "...",
  "taux_douane": "2.5",
  "errors": []
}
```

### Bulk Processing
```http
POST /api/bulk
Content-Type: multipart/form-data
file: produits.xlsx

Response:
{
  "job_id": "uuid",
  "status": "processing",
  "total": 150,
  "completed": 0
}
```

---

## 🗄️ Schéma Base de Données

### Table: positions
```sql
CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    code_hs VARCHAR(12) UNIQUE NOT NULL,  -- Format: XXXX.XX.XX.XX
    chapitre VARCHAR(2) NOT NULL,
    designation_fr TEXT NOT NULL,
    designation_ar TEXT,
    taux_douane DECIMAL(5,2),
    unite VARCHAR(20),
    regime VARCHAR(20),  -- STANDARD, CITES, EXONERE, CONTINGENT
    source_ne TEXT,      -- Référence NE suisse
    exclusions TEXT[],   -- Codes exclus
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: classifications
```sql
CREATE TABLE classifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    query TEXT NOT NULL,
    result_code_hs VARCHAR(12),
    confiance DECIMAL(3,2),
    feedback VARCHAR(10),  -- correct, incorrect, partial
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(100),
    entreprise VARCHAR(100),
    plan VARCHAR(20) DEFAULT 'free',  -- free, starter, pro, enterprise
    quota_requetes INTEGER DEFAULT 10,
    requetes_utilisees INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🤖 Intelligence Artificielle

### Pipeline RAG
1. **Embedding:** Texte utilisateur → vecteur (OpenAI text-embedding-3)
2. **Retrieval:** Recherche sémantique dans base NE
3. **Contexte:** Top 5 résultats + tarif ADII
4. **Génération:** GPT-4o avec prompt spécialisé
5. **Validation:** Vérification format code HS

### Prompt Système HSBoss
```
Tu es HSBoss, expert en classification douanière (Système Harmonisé).
Réponds comme un transitaire senior: précis, concis, sourcé.

RÈGLES:
1. Cite toujours la source (NE suisse, chapitre X, position Y)
2. Applique les RGIs méthodiquement
3. Mentionne les exclusions pertinentes
4. Propose un arbre de décision si ambigu

CONTEXTE ADII:
{tarif_adii_data}

NOTES EXPLICATIVES:
{ne_context}

QUESTION:
{user_query}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Largeur | Usage |
|------------|---------|-------|
| Mobile | < 640px | Chat simplifié, résultats empilés |
| Tablet | 640-1024px | Sidebar collapsible |
| Desktop | > 1024px | Interface complète |

---

## 🔒 Sécurité

- Authentification JWT (Clerk)
- Rate limiting: 100 req/min (free), 1000 req/min (pro)
- Validation entrées (Zod)
- Sanitization HTML (DOMPurify)
- HTTPS obligatoire
- RGPD compliance (données EU/Suisse)

---

## 📊 Monitoring

- **Analytics:** PostHog ou Mixpanel
- **Errors:** Sentry
- **Performance:** Vercel Analytics
- **Uptime:** UptimeRobot

---

## 🚀 Déploiement

### Environnements
```
Development → feature branches
Staging     → staging.douania.io  
Production  → douania.io
```

### CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action-deploy@v1
```

---

*Document version: 1.0*
*Last updated: 2026-02-08*
