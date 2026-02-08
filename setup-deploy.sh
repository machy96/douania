#!/bin/bash
# Script de setup complet pour Douania

echo "🚀 SETUP DÉPLOIEMENT DOUANIA"
echo "============================"
echo ""

# Vérifier les outils
command -v git >/dev/null 2>&1 || { echo "❌ Git requis"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js requis"; exit 1; }

echo "✅ Outils disponibles"
echo ""

# Étape 1: GitHub
echo "📦 ÉTAPE 1/4: Configuration GitHub"
echo "-----------------------------------"
if [ ! -d ".git" ]; then
    echo "Initialisation du repo Git..."
    git init
    git add .
    git commit -m "Initial commit - Douania MVP"
    echo "✅ Repo Git initialisé"
else
    echo "✅ Repo Git déjà initialisé"
fi

echo ""
echo "Configuration remote GitHub:"
echo "  Username: machy96"
read -p "As-tu créé le repo 'douania' sur GitHub? (oui/non): " repo_created

if [ "$repo_created" = "oui" ]; then
    git remote add origin https://github.com/machy96/douania.git 2>/dev/null || true
    echo "✅ Remote configuré"
    
    echo "Push du code..."
    git branch -M main
    git push -u origin main || echo "⚠️ Push manuel requis (mot de passe/token)"
else
    echo "⚠️ Crée d'abord le repo sur https://github.com/new"
    echo "   Puis relance ce script"
    exit 1
fi

echo ""
echo "📦 ÉTAPE 2/4: Configuration Secrets GitHub"
echo "-------------------------------------------"
echo "Va sur https://github.com/machy96/douania/settings/secrets/actions"
echo "Et ajoute ces secrets:"
echo ""
echo "   RAILWAY_TOKEN = e17625aa-637e-450c-8ee5-f02bb1b24b33"
echo "   VERCEL_TOKEN = [à générer sur vercel.com]"
echo ""
read -p "Secrets ajoutés? (oui): " secrets_ok

echo ""
echo "📦 ÉTAPE 3/4: Déploiement Backend (Railway)"
echo "---------------------------------------------"
echo "Option A - Automatique (GitHub Actions):"
echo "  Le push va déclencher le déploiement auto"
echo ""
echo "Option B - Manuel:"
echo "  cd src/backend"
echo "  npx railway login --token e17625aa-637e-450c-8ee5-f02bb1b24b33"
echo "  npx railway init --name douania-backend"
echo "  npx railway up"
echo ""

echo "📦 ÉTAPE 4/4: Déploiement Frontend (Vercel)"
echo "--------------------------------------------"
echo "Option A - Automatique (GitHub Actions):"
echo "  Nécessite VERCEL_TOKEN dans les secrets"
echo ""
echo "Option B - Manuel:"
echo "  cd src/frontend"
echo "  npx vercel login"
echo "  npx vercel --prod"
echo ""

echo "============================"
echo "✅ SETUP TERMINÉ"
echo "============================"
echo ""
echo "Prochaines étapes:"
echo "1. Vérifier les secrets GitHub sont bien ajoutés"
echo "2. Faire un push: git push origin main"
echo "3. Voir les Actions sur https://github.com/machy96/douania/actions"
echo "4. Une fois déployé, tester l'app sur l'URL Vercel"
echo ""
