#!/bin/bash
# Script de déploiement Douania MVP

echo "🚀 Déploiement Douania MVP"
echo ""

# Option 1: Déploiement Railway (recommandé)
echo "=== Option 1: Railway (Facile) ==="
echo "1. Créer compte sur railway.app"
echo "2. Installer CLI: npm install -g @railway/cli"
echo "3. Se connecter: railway login"
echo "4. Dans backend/: railway init && railway up"
echo "5. Dans frontend/: railway init && railway up"
echo ""

# Option 2: ngrok (Test rapide local)
echo "=== Option 2: ngrok (Test immédiat) ==="
echo "1. Installer ngrok: https://ngrok.com/download"
echo "2. Démarrer backend: cd backend && npm run dev"
echo "3. Nouveau terminal: ngrok http 3001"
echo "4. Copier l'URL https://xxxx.ngrok.io"
echo "5. Mettre à jour frontend/app/page.tsx avec cette URL"
echo "6. Démarrer frontend: cd frontend && npm run dev"
echo ""

# Option 3: Vercel (Frontend) + Render (Backend)
echo "=== Option 3: Vercel + Render (Gratuit) ==="
echo "Frontend (Vercel):"
echo "  cd frontend && vercel --prod"
echo ""
echo "Backend (Render):"
echo "  - Créer web service sur render.com"
echo "  - Connecter repo GitHub"
echo "  - Build command: npm install && npm run build"
echo "  - Start command: npm start"
echo ""

echo "📖 Documentation complète dans DEPLOY.md"
