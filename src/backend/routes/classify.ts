import { FastifyInstance } from 'fastify';
import { ClassificationRequest, ClassificationResponse, ClassificationResult } from '../../shared/types';

// Configuration n8n
const N8N_BASE_URL = 'http://147.93.52.143:32771';
const N8N_WORKFLOW_ID = 'Ys3P36vD7PTxWB1p';

// Fonction pour appeler le workflow n8n
async function callN8nWorkflow(query: string): Promise<ClassificationResult | null> {
  try {
    const response = await fetch(`${N8N_BASE_URL}/webhook/classify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error('n8n webhook error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return {
      hsCode: data.hsCode || data.code_hs || '9999.99.99',
      designation: data.designation || data.description || 'Non classifié',
      tauxDD: data.tauxDD || data.taux_dd || 'N/A',
      confidence: data.confidence || data.confiance || 80,
    };
  } catch (error) {
    console.error('Error calling n8n:', error);
    return null;
  }
}

// Données mock de classification HS Code (fallback)
const mockClassifications: Record<string, ClassificationResult> = {
  'iphone': {
    hsCode: '8517.12.00',
    designation: 'Téléphones portables pour réseaux cellulaires',
    tauxDD: '0%',
    confidence: 95
  },
  'smartphone': {
    hsCode: '8517.12.00',
    designation: 'Téléphones portables pour réseaux cellulaires',
    tauxDD: '0%',
    confidence: 95
  },
  'ordinateur': {
    hsCode: '8471.30.00',
    designation: 'Ordinateurs portables, d\'un poids n\'excédant pas 10 kg',
    tauxDD: '0%',
    confidence: 92
  },
  'laptop': {
    hsCode: '8471.30.00',
    designation: 'Ordinateurs portables, d\'un poids n\'excédant pas 10 kg',
    tauxDD: '0%',
    confidence: 92
  },
  'chaussure': {
    hsCode: '6403.99.00',
    designation: 'Chaussures à tige en cuir',
    tauxDD: '8%',
    confidence: 88
  },
  'café': {
    hsCode: '0901.21.00',
    designation: 'Café torréfié, non décaféiné',
    tauxDD: '0%',
    confidence: 97
  },
  't-shirt': {
    hsCode: '6109.10.00',
    designation: 'T-shirts en coton',
    tauxDD: '12%',
    confidence: 90
  },
  'voiture': {
    hsCode: '8703.23.19',
    designation: 'Voitures de tourisme, cylindrée > 1500cm³ mais ≤ 3000cm³',
    tauxDD: '10%',
    confidence: 85
  },
  'tablette': {
    hsCode: '8471.41.00',
    designation: 'Ordinateurs automatiques de type portable, autres',
    tauxDD: '0%',
    confidence: 89
  },
  'montre': {
    hsCode: '9102.12.00',
    designation: 'Montres-bracelets, à affichage optique, mécaniques',
    tauxDD: '4.5%',
    confidence: 87
  }
};

// Fonction de recherche intelligente mock
function findClassification(query: string): ClassificationResult | null {
  const lowerQuery = query.toLowerCase().trim();
  
  // Recherche exacte
  if (mockClassifications[lowerQuery]) {
    return mockClassifications[lowerQuery];
  }
  
  // Recherche partielle
  for (const [key, value] of Object.entries(mockClassifications)) {
    if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
      return value;
    }
  }
  
  // Résultat par défaut si aucune correspondance
  if (lowerQuery.length > 2) {
    return {
      hsCode: '9999.99.99',
      designation: `Produit non identifié précisément pour "${query}"`,
      tauxDD: 'N/A',
      confidence: 30
    };
  }
  
  return null;
}

export async function classificationRoutes(fastify: FastifyInstance) {
  // Route POST /api/classify
  fastify.post<{ Body: ClassificationRequest }>('/classify', async (request, reply): Promise<ClassificationResponse> => {
    const { query } = request.body;

    if (!query || query.trim().length === 0) {
      reply.code(400);
      return {
        success: false,
        error: 'La requête ne peut pas être vide'
      };
    }

    // Essayer d'abord n8n
    const n8nResult = await callN8nWorkflow(query);

    if (n8nResult) {
      return {
        success: true,
        result: n8nResult
      };
    }

    // Fallback sur les mocks si n8n ne répond pas
    console.log('n8n unavailable, using mock data');
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = findClassification(query);

    if (!result) {
      return {
        success: false,
        error: 'Impossible de classifier ce produit. Veuillez fournir plus de détails.'
      };
    }

    return {
      success: true,
      result
    };
  });
  
  // Route GET /api/classify pour test rapide
  fastify.get('/classify', async () => {
    return {
      message: 'Utilisez POST /api/classify avec un body { "query": "votre produit" }',
      examples: Object.keys(mockClassifications)
    };
  });
}
