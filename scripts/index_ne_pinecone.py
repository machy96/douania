#!/usr/bin/env python3
"""
Script d'indexation des Notes Explicatives Suisses dans Pinecone
Pour le projet Douania - HSBoss RAG
"""

import sys
sys.path.insert(0, '/home/node/.local/lib/python3.13/site-packages')

from pinecone import Pinecone
import openai
import os
import re
from pathlib import Path

# Configuration
PINECONE_API_KEY = 'pcsk_458UzX_949jtEhZ8nVHJsnbk1SBd8A2E8UAGwR9YngyhNJNghLMHMX46gYSrRGDZex4d2N'
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')  # À configurer
INDEX_NAME = 'douania-ne'
NAMESPACE = 'notes-explicatives'
NE_DIR = '/data/.openclaw/workspace/notes-explicatives-suisses'

def extract_text_simple(pdf_path):
    """Extraction simple de texte (fallback si PyPDF2 échoue)"""
    try:
        import PyPDF2
        with open(pdf_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    except Exception as e:
        print(f"⚠️ PyPDF2 failed for {pdf_path}: {e}")
        return ""

def chunk_text(text, chunk_size=800, overlap=200):
    """Découpe le texte en chunks avec chevauchement"""
    chunks = []
    sentences = re.split(r'(?<=[.!?])\s+', text)
    current_chunk = ""
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) > chunk_size:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence
        else:
            current_chunk += " " + sentence
    
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks

def extract_hs_codes(text):
    """Extrait les codes HS du texte"""
    # Format: XXXX.XX ou XXXX XX
    codes = re.findall(r'\b(\d{4})[\.]?(\d{2})\b', text)
    return [f"{c[0]}.{c[1]}" for c in codes]

def get_embedding(text, client):
    """Génère l'embedding OpenAI"""
    try:
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text[:8000]  # Limite de tokens
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"❌ Embedding error: {e}")
        return None

def index_pdf(pc, openai_client, chapter_num, pdf_path):
    """Indexe un PDF NE dans Pinecone"""
    print(f"\n📄 Chapitre {chapter_num}: {os.path.basename(pdf_path)}")
    
    # Extraire texte
    text = extract_text_simple(pdf_path)
    if not text:
        print(f"   ⚠️ Pas de texte extrait")
        return 0
    
    print(f"   📝 Texte extrait: {len(text)} caractères")
    
    # Découper en chunks
    chunks = chunk_text(text)
    print(f"   🧩 Chunks créés: {len(chunks)}")
    
    # Index
    index = pc.Index(INDEX_NAME)
    vectors = []
    
    for i, chunk in enumerate(chunks):
        # Générer embedding
        embedding = get_embedding(chunk, openai_client)
        if not embedding:
            continue
        
        # Extraire métadonnées
        codes = extract_hs_codes(chunk)
        
        # Créer vecteur
        vector_id = f"ch{str(chapter_num).zfill(2)}_chunk{i:04d}"
        vectors.append({
            "id": vector_id,
            "values": embedding,
            "metadata": {
                "chapitre": str(chapter_num).zfill(2),
                "text": chunk[:1000],  # Limité pour metadata
                "codes_hs": codes[:5],  # Max 5 codes
                "chunk_index": i,
                "total_chunks": len(chunks)
            }
        })
        
        # Upsert par batch de 100
        if len(vectors) >= 100:
            index.upsert(vectors=vectors, namespace=NAMESPACE)
            print(f"   ⬆️  Indexés: {len(vectors)} chunks")
            vectors = []
    
    # Upsert reste
    if vectors:
        index.upsert(vectors=vectors, namespace=NAMESPACE)
        print(f"   ⬆️  Indexés: {len(vectors)} chunks")
    
    print(f"   ✅ Total: {len(chunks)} chunks indexés")
    return len(chunks)

def main():
    print("=" * 60)
    print("🚀 Indexation Notes Explicatives Suisses - Douania")
    print("=" * 60)
    
    # Vérifier OpenAI API key
    if not OPENAI_API_KEY:
        print("\n⚠️  OPENAI_API_KEY non configuré!")
        print("   Exportez: export OPENAI_API_KEY='sk-...'")
        return
    
    # Init clients
    pc = Pinecone(api_key=PINECONE_API_KEY)
    openai_client = openai.OpenAI(api_key=OPENAI_API_KEY)
    
    # Vérifier index
    index = pc.Index(INDEX_NAME)
    stats = index.describe_index_stats()
    print(f"\n📊 Index {INDEX_NAME}: {stats.total_vector_count} vecteurs existants")
    
    # Lister PDFs
    ne_dir = Path(NE_DIR)
    if not ne_dir.exists():
        print(f"❌ Dossier non trouvé: {NE_DIR}")
        return
    
    pdfs = sorted(ne_dir.glob("Kap_*.pdf"))
    print(f"\n📁 {len(pdfs)} PDFs trouvés")
    
    # Indexer
    total_chunks = 0
    for pdf_path in pdfs:
        # Extraire numéro chapitre du nom
        match = re.search(r'Kap_(\d+)_', pdf_path.name)
        if match:
            chapter_num = int(match.group(1))
            try:
                chunks = index_pdf(pc, openai_client, chapter_num, str(pdf_path))
                total_chunks += chunks
            except Exception as e:
                print(f"   ❌ Erreur: {e}")
    
    # Stats finales
    final_stats = index.describe_index_stats()
    print("\n" + "=" * 60)
    print(f"✅ Indexation terminée!")
    print(f"   Total chunks indexés: {total_chunks}")
    print(f"   Vecteurs dans index: {final_stats.total_vector_count}")
    print("=" * 60)

if __name__ == "__main__":
    main()
