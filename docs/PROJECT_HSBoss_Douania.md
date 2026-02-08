# 🤖 HSBoss / Douania - Projet Agent IA HS Code

> **Nom de code:** HSBoss  
> **Nom commercial:** Douania  
> **Date de création:** 2026-02-08  
> **Créateurs:** Kamal Jadari (Also Logistics) + Nasser  
> **Agent:** Hike (berger allemand numérique)

---

## 🎯 Vision du Projet

### Origine
Lors d'une session du 2026-02-08, Kamal Jadari a exprimé le besoin de créer un **agent IA spécialisé HS Code** pour les transitaires, importateurs et investisseurs au Maroc. L'objectif: un SaaS rentable fournissant des classifications douanières précises et à jour.

### Proposition de Valeur
- **Spécialisation Maroc/ADII:** Connaissance fine du tarif douanier marocain et des réglementations ADII
- **Précision:** Citations sourcées des Notes Explicatives (NE suisses comme référence OMA)
- **Efficacité:** Réduction du temps de recherche (15-30 min → quelques secondes)
- **Conformité:** Alertes sur les risques douaniers, exclusions, régimes spéciaux

---

## 📊 Avancement par Session

### Session 2026-02-08 - Création de la base

#### ✅ Réalisations

**1. Notes Explicatives Suisses (BAZG)**
- ✅ 97 PDF téléchargés (chapitres 01-97 + remarques préliminaires)
- ✅ ~23 Mo de documentation officielle
- ✅ Stockage: `/notes-explicatives-suisses/`

**2. Tarif ADII Maroc**
- ✅ 26+ chapitres PDF téléchargés
- ✅ Extraction en cours (correction parser hiérarchique)
- ✅ Structure: codes 10 chiffres, taux DD, unités, régimes
- ✅ Stockage: `/tarif-adii-maroc/`

**3. Mode HSBoss**
- ✅ Mot d'activation: `HSBOSS`
- ✅ Base de connaissances intégrée
- ✅ Méthodologie: RGI appliquée, citations sourcées

**4. Architecture Projet SaaS (Douania)**
- ✅ Positionnement: HS Code Intelligence Platform
- ✅ Modèle économique: Starter 299DH/mois → Enterprise sur devis
- ✅ Stack recommandée: Next.js + Node.js + PostgreSQL + RAG

#### ⚠️ Problèmes Rencontrés
- Interface ADII protégée (JSF), pas d'API directe
- Parsing PDF complexe (structure hiérarchique avec tirets)
- 743/747 positions sans taux dans première extraction

#### 🔧 En Cours
- Reparsing complet du tarif ADII (parser corrigé)
- Création base de données unifiée (NE + Tarif)
- Structuration par chapitre pour analyses

---

## 🏗️ Architecture Technique Proposée

```
Douania (SaaS)
├── Frontend: Next.js + Tailwind
├── Backend: Node.js/Fastify ou Python/FastAPI
├── AI/LLM: OpenAI GPT-4o + RAG vectoriel
├── Vector DB: Pinecone/Weaviate (base NE)
├── Base données: PostgreSQL (métier) + Redis (cache)
├── Hébergement: Vercel + Railway/Render
├── Paiement: Stripe + CMI
└── Intégrations: API ADII (quand dispo), ERP (Odoo)
```

---

## 💰 Business Model

| Plan | Prix | Cible | Features |
|------|------|-------|----------|
| **Starter** | 299 DH/mois | Petits importateurs | 50 requêtes/mois |
| **Pro** | 799 DH/mois | Transitaires indépendants | Requêtes illimitées, API |
| **Enterprise** | Sur devis | Grands groupes | White-label, SSO, support |

**Revenus additionnels:**
- Rapports d'expertise: 500-2000 DH
- Formation: 5000-15000 DH/session
- API usage: 0.05-0.10 DH/appel

---

## 📋 Roadmap

### Phase 1: MVP Core (2-3 mois)
- [x] Base NE suisses intégrée
- [x] Tarif ADII importé
- [ ] Parser ADII corrigé et validé
- [ ] Interface chat + formulaire structuré
- [ ] Classification par description texte
- [ ] Vérification code existant
- [ ] Export rapport PDF

### Phase 2: Intelligence (3-6 mois)
- [ ] Analyse d'image (photo → HS code)
- [ ] Bulk processing (Excel → codes)
- [ ] Historique client
- [ ] API publique

### Phase 3: SaaS Avancé (6-12 mois)
- [ ] White-label pour transitaires
- [ ] Multi-pays (Maroc, Tunisie, Algérie)
- [ ] Veille réglementaire auto
- [ ] Marketplace experts humains

---

## 🧠 Base de Connaissances Actuelle

### Sources Fiables
1. **Notes Explicatives Suisses (BAZG)** - Référence OMA
   - 97 chapitres PDF
   - Dernière édition: avril 2025
   - Stockage: `/notes-explicatives-suisses/`

2. **Tarif ADII Maroc**
   - PDF par chapitre (26+ chapitres)
   - Édition: 1er janvier 2022
   - Stockage: `/tarif-adii-maroc/`

3. **Règles Générales d'Interprétation (RGI)**
   - RGI 1 à 6 du SH
   - Intégrées dans HSBoss_MODE.md

---

## 🔐 Mode HSBoss

**Activation:** Écrire `HSBOSS` dans la conversation

**Comportement:**
- Citation systématique avec source NE suisse (chapitre, section, page)
- Application méthodique des RGIs
- Précision des inclusions/exclusions
- Proposition d'arbres de décision

**Règles strictes:**
- Pas de citation sans source vérifiée
- Pas d'interprétation non fondée
- Mentionner les exclusions pertinentes
- Cross-référencer les positions ambiguës

---

## 👥 Équipe

| Rôle | Nom | Contribution |
|------|-----|--------------|
| **Vision/Produit** | Kamal Jadari | Direction, expertise métier transit |
| **Expertise HS** | Nasser | Validation classifications, cas complexes |
| **Agent IA** | Hike | Traitement, extraction, citations |

---

## 📝 Notes de Session

### 2026-02-08
- Création de l'identité Hike (berger allemand)
- Premier cas traité: Chauffe-eau solaire avec appoint électrique (8419.81)
- Échange sur la rigueur des citations (apprentissage: ne jamais citer sans source)
- Mise en place de la base NE suisses
- Début intégration tarif ADII
- Définition du mot de passe HSBoss

---

## 🔗 Liens Utiles

- **NE Suisses:** https://www.bazg.admin.ch/fr/notes-explicatives-du-tarif-des-douanes-tares
- **ADIL:** https://www.douane.gov.ma/adil
- **Tarif ADII:** https://www.douane.gov.ma/web/guest/tarif

---

*Dernière mise à jour: 2026-02-08*
*Prochaine session: À définir*
