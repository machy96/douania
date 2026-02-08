# Douania - MVP Classification HS Code

Interface web intelligente pour la classification douanière des produits.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ 
- npm ou yarn

### Structure du Projet

```
src/
├── frontend/     # Next.js 14 - Interface utilisateur
├── backend/      # Fastify - API serveur
└── shared/       # Types TypeScript partagés
```

## 📦 Installation & Lancement

### 1. Backend (API)

```bash
cd src/backend
npm install
npm run dev
```

Le serveur démarre sur `http://localhost:3001`

### 2. Frontend (Interface)

Dans un nouveau terminal :

```bash
cd src/frontend
npm install
npm run dev
```

L'application est accessible sur `http://localhost:3000`

## 🎯 Fonctionnalités MVP

- ✅ Interface chat intuitive
- ✅ Classification mock de produits
- ✅ Affichage Code HS, Désignation, Taux DD
- ✅ Indicateur de confiance
- ✅ Design responsive Tailwind CSS

## 📝 Exemples de Requêtes

Essayez ces mots-clés dans le chat :

- `iPhone` / `smartphone`
- `ordinateur` / `laptop`
- `chaussure`
- `café`
- `t-shirt`
- `voiture`
- `tablette`
- `montre`

## 🔧 Stack Technique

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Fastify, TypeScript
- **Partagé**: Types TypeScript

## 🛣️ API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/classify` | Classification produit |
| GET | `/api/classify` | Liste des exemples |

### Exemple de requête API

```bash
curl -X POST http://localhost:3001/api/classify \
  -H "Content-Type: application/json" \
  -d '{"query": "iPhone"}'
```

### Réponse

```json
{
  "success": true,
  "result": {
    "hsCode": "8517.12.00",
    "designation": "Téléphones portables pour réseaux cellulaires",
    "tauxDD": "0%",
    "confidence": 95
  }
}
```

## 🎨 Screenshots

L'interface présente :
- Un header avec logo et statut
- Une zone de chat avec bulles de conversation
- Des cartes de résultat avec code HS, désignation et taux
- Une barre de confiance colorée

## 🚧 Prochaines Étape (Roadmap)

- [ ] Intégration IA réelle (OpenAI/Claude)
- [ ] Base de données des classifications
- [ ] Historique des recherches
- [ ] Export PDF des résultats
- [ ] Authentification utilisateur
- [ ] API rate limiting

---

**Version**: MVP 1.0  
**Créé**: Février 2025
# Douania MVP - Déployé le Sun Feb  8 10:05:19 CET 2026
