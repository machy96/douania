import { FastifyInstance } from 'fastify';
import { ClassificationRequest, ClassificationResponse, ClassificationResult } from '../../shared/types';

// Données mock de classification HS Code
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
    
    // Simulation d'un délai de traitement (comme une vraie IA)
    await new Promise(resolve => setTimeout(resolve, 800));
    
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
