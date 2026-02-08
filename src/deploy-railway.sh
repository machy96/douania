#!/bin/bash
# Script de déploiement complet Douania MVP

set -e

echo "🚀 Déploiement Douania MVP - URL Publique"
echo "=========================================="
echo ""

# Vérifier Railway CLI
if ! command -v railway &> /dev/null; then
    echo "Installation Railway CLI..."
    npm install -g @railway/cli
fi

# Connexion
echo "Connexion à Railway..."
railway login

echo ""
echo "📦 ÉTAPE 1: Déploiement Backend"
echo "--------------------------------"
cd backend

# Préparer pour Railway
cp railway-package.json package.json

# Initialiser si pas déjà fait
if [ ! -f ".railway/config.json" ]; then
    railway init --name douania-backend
fi

# Déployer
echo "Déploiement en cours..."
railway up

# Récupérer l'URL
BACKEND_URL=$(railway domain)
echo ""
echo "✅ Backend déployé: $BACKEND_URL"
echo ""

cd ..

echo ""
echo "🎨 ÉTAPE 2: Déploiement Frontend"
echo "--------------------------------"
cd frontend

# Mettre à jour l'URL API
echo "NEXT_PUBLIC_API_URL=$BACKEND_URL" > .env.local

# Build
npm run build

# Déployer
if ! command -v vercel &> /dev/null; then
    npm install -g vercel
fi

echo "Déploiement Vercel..."
vercel --prod --yes

echo ""
echo "========================================"
echo "✅ DÉPLOIEMENT TERMINÉ!"
echo "========================================"
echo ""
echo "📱 Accessible depuis:"
echo "   - Ton téléphone"
echo "   - N'importe quel PC"
echo "   - URL à partager"
echo ""
echo "🔗 URLs:"
echo "   Backend: $BACKEND_URL"
echo "   Frontend: (affiché par Vercel ci-dessus)"
echo ""
