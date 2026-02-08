#!/bin/bash
# Installation de Tesseract OCR pour Douania

echo "🔧 Installation Tesseract OCR"
echo "=============================="

# Détection OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "OS: Linux"
    
    # Ubuntu/Debian
    if command -v apt-get &> /dev/null; then
        echo "Installation via apt..."
        sudo apt-get update
        sudo apt-get install -y tesseract-ocr tesseract-ocr-fra tesseract-ocr-ara
        sudo apt-get install -y poppler-utils  # pour pdf2image
    
    # CentOS/RHEL/Fedora
    elif command -v yum &> /dev/null; then
        echo "Installation via yum..."
        sudo yum install -y tesseract tesseract-langpack-fra
        sudo yum install -y poppler-utils
    fi

elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "OS: macOS"
    
    if command -v brew &> /dev/null; then
        echo "Installation via Homebrew..."
        brew install tesseract tesseract-lang
        brew install poppler
    else
        echo "❌ Homebrew non installé"
        echo "Installez-le d'abord: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
else
    echo "OS non détecté automatiquement"
    echo "Consultez: https://github.com/tesseract-ocr/tesseract/wiki"
fi

# Vérification
echo ""
echo "Vérification installation..."
if command -v tesseract &> /dev/null; then
    echo "✅ Tesseract installé:"
    tesseract --version
else
    echo "❌ Installation échouée"
    exit 1
fi

# Installation dépendances Python
echo ""
echo "Installation dépendances Python..."
pip3 install pytesseract pdf2image opencv-python-headless pillow

echo ""
echo "✅ Installation terminée!"
echo ""
echo "Test:"
echo "  tesseract --version"
