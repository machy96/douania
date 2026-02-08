# 🧠 Configuration Pinecone pour Douania RAG

## Étape 1 : Créer un compte Pinecone

1. Va sur https://www.pinecone.io/
2. Clique **"Get Started"** (gratuit)
3. Crée un compte avec ton email
4. Vérifie ton email

## Étape 2 : Créer l'Index

### Via l'interface web :
1. **Dashboard** → **Create Index**
2. **Index Name** : `douania-ne`
3. **Dimensions** : `1536` (pour OpenAI embeddings)
4. **Metric** : `cosine`
5. **Pod Type** : `Starter` (gratuit)
6. **Create Index**

### Via API (optionnel):
```bash
curl -X POST \
  -H "Api-Key: VOTRE_API_KEY" \
  -H "Content-Type: application/json" \
  https://api.pinecone.io/indexes \
  -d '{
    "name": "douania-ne",
    "dimension": 1536,
    "metric": "cosine",
    "spec": {
      "pod": {
        "environment": "us-west1-gcp",
        "pod_type": "starter"
      }
    }
  }'
```

## Étape 3 : Récupérer les credentials

### API Key :
1. **Dashboard** → **API Keys** (en haut à droite)
2. Copie la clé : `pcsk_...`

### Environment :
1. Dans **Index Details**
2. Note l'**Environment** : ex `us-west1-gcp`

## Étape 4 : Configurer dans n8n

### 1. Installer le node Pinecone
Si pas déjà installé :
- **Settings** → **Community Nodes**
- **Install** : `@pinecone-database/pinecone`

### 2. Créer le Credential
- **Settings** → **Credentials** → **Add Credential**
- Type : **Pinecone API**
- **API Key** : Ta clé `pcsk_...`
- **Environment** : `us-west1-gcp`
- **Save**

### 3. Modifier le workflow HSBoss

Ajouter ces nodes au workflow :

#### Node 1 : Embedding (OpenAI)
```json
{
  "name": "Generate Embedding",
  "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
  "parameters": {
    "model": "text-embedding-3-small"
  }
}
```

#### Node 2 : Pinecone Search
```json
{
  "name": "Pinecone Search",
  "type": "@pinecone-database/pinecone.pineconeNode",
  "parameters": {
    "operation": "search",
    "indexName": "douania-ne",
    "namespace": "notes-explicatives",
    "topK": 5,
    "vector": "={{ $json.embedding }}",
    "includeMetadata": true
  }
}
```

#### Node 3 : Format Context
```javascript
// Code Node
const results = $input.first().json.matches || [];

const context = results.map(match => ({
  chapitre: match.metadata?.chapitre,
  code_hs: match.metadata?.code_hs,
  page: match.metadata?.page,
  text: match.metadata?.text,
  score: match.score
})).filter(r => r.score > 0.7); // Seulement résultats pertinents

return [{
  json: {
    ...$input.first().json,
    rag_context: context,
    context_text: context.map(c => 
      `[Chapitre ${c.chapitre} - Code ${c.code_hs} - Page ${c.page}]: ${c.text}`
    ).join('\n\n')
  }
}];
```

#### Node 4 : HSBoss Agent (modifié)
```
Prompt System modifié avec RAG:

Tu es HSBoss, expert classification douanière.

CONTEXTE RAG (Notes Explicatives pertinentes):
{{ $json.context_text }}

INSTRUCTIONS:
1. Utilise UNIQUEMENT le contexte RAG ci-dessus
2. Cite EXACTEMENT les passages pertinents
3. Si le contexte est insuffisant, indique-le
4. N'invente jamais d'informations

...
```

## Étape 5 : Indexer les Notes Explicatives

### Script d'indexation (Python) :
```python
from pinecone import Pinecone
import openai
import PyPDF2
import re

# Config
pc = Pinecone(api_key="pcsk_...")
index = pc.Index("douania-ne")
openai.api_key = "sk-..."

def extract_text_from_pdf(pdf_path):
    """Extrait le texte d'un PDF NE"""
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

def chunk_text(text, chunk_size=1000):
    """Découpe le texte en chunks"""
    chunks = []
    current_chunk = ""
    
    for line in text.split('\n'):
        if len(current_chunk) + len(line) > chunk_size:
            chunks.append(current_chunk)
            current_chunk = line
        else:
            current_chunk += "\n" + line
    
    if current_chunk:
        chunks.append(current_chunk)
    
    return chunks

def index_pdf(chapter_num, pdf_path):
    """Indexe un PDF NE dans Pinecone"""
    print(f"Indexing Chapitre {chapter_num}...")
    
    # Extraire texte
    text = extract_text_from_pdf(pdf_path)
    
    # Découper en chunks
    chunks = chunk_text(text)
    
    # Générer embeddings et indexer
    vectors = []
    for i, chunk in enumerate(chunks):
        # Embedding OpenAI
        response = openai.embeddings.create(
            model="text-embedding-3-small",
            input=chunk
        )
        embedding = response.data[0].embedding
        
        # Extraire codes HS du chunk
        codes = re.findall(r'\b(\d{4})\.(\d{2})\b', chunk)
        
        vectors.append({
            "id": f"ch{chapter_num}_chunk{i}",
            "values": embedding,
            "metadata": {
                "chapitre": str(chapter_num).zfill(2),
                "text": chunk[:1000],  # Limité pour metadata
                "code_hs": codes[0] if codes else "",
                "chunk_index": i
            }
        })
    
    # Upsert dans Pinecone (par batch de 100)
    for i in range(0, len(vectors), 100):
        batch = vectors[i:i+100]
        index.upsert(vectors=batch, namespace="notes-explicatives")
        print(f"  Indexed {len(batch)} chunks")
    
    print(f"✅ Chapitre {chapter_num} done: {len(vectors)} chunks")

# Indexer tous les chapitres
for ch in range(1, 98):
    pdf_path = f"/path/to/Kap_{str(ch).zfill(2)}_f.pdf"
    try:
        index_pdf(ch, pdf_path)
    except Exception as e:
        print(f"❌ Chapitre {ch}: {e}")

print("\n🎉 All chapters indexed!")
```

## Coûts Pinecone

| Plan | Stockage | Requêtes | Prix |
|------|----------|----------|------|
| **Starter** (Gratuit) | 2 GB | 100k/mois | $0 |
| **Standard** | Illimité | Illimité | ~$70/mois |

Pour Douania MVP : **Starter suffit**

## Vérification

### Tester une recherche :
```python
import openai
from pinecone import Pinecone

pc = Pinecone(api_key="pcsk_...")
index = pc.Index("douania-ne")

# Query
query = "Chevaux reproducteurs de race pure"
embedding = openai.embeddings.create(
    model="text-embedding-3-small",
    input=query
).data[0].embedding

# Search
results = index.query(
    vector=embedding,
    top_k=3,
    namespace="notes-explicatives",
    include_metadata=True
)

for match in results.matches:
    print(f"Score: {match.score:.3f}")
    print(f"Chapitre: {match.metadata['chapitre']}")
    print(f"Code: {match.metadata['code_hs']}")
    print(f"Text: {match.metadata['text'][:200]}...")
    print("---")
```

## Troubleshooting

### Erreur : "Index not found"
- Vérifie le nom de l'index : `douania-ne`
- Vérifie l'environment dans les credentials

### Erreur : "No matches found"
- Vérifie que les données sont indexées : `index.describe_index_stats()`
- Augmente `top_k` à 10 pour tester
- Vérifie la similarité minimum (score > 0.7)

### Latence élevée
- Utilise `text-embedding-3-small` (plus rapide que `text-embedding-ada-002`)
- Réduit `top_k` à 3-5
- Active le caching dans n8n

## Architecture Finale

```
Requête Utilisateur
        │
        ▼
┌───────────────┐
│   n8n         │
│   Webhook     │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Embedding   │───▶ OpenAI
│   (OpenAI)    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Pinecone    │
│   Vector DB   │
│   Top 5 NE    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   HSBoss      │
│   Agent       │───▶ GPT-4o + Contexte RAG
│   (RAG)       │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Réponse     │
│   Structurée  │
└───────────────┘
```
