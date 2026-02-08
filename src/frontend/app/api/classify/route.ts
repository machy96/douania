import { NextRequest, NextResponse } from 'next/server';

// Configuration n8n
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://147.93.52.143:32771/webhook/hsboss-classify';
const USE_N8N = process.env.USE_N8N === 'true' || true; // Par défaut, utiliser n8n

// F-004: Citations NE Suisses par code (fallback si n8n down)
const neCitations: Record<string, string> = {
  '0101210000': 'Chevaux reproducteurs de race pure - Note explicative: Les chevaux de race pure sont ceux reconnus par les autorités compétentes comme appartenant à des races établies.',
  '0101291000': 'Chevaux destinés à la boucherie - Conditions d\'importation soumises à contingent.',
  '0102210000': 'Bovins reproducteurs de race pure - Les bovins de la sous-famille des Bovinae, espèces domestiques ou non.',
  '0102291000': 'Veaux - Animaux de l\'espèce bovine destinés à l\'engraissement ou l\'abattage.',
  '0102292100': 'Vaches laitières - Vaches destinées à la production laitière, reconnues par les autorités.',
  '0105131000': 'Poulets reproducteurs - Volailles de l\'espèce Gallus domesticus, reproducteurs de race pure.',
  '0105940000': 'Volailles Gallus domesticus - Pour élevage, reproduction ou production de viande.',
  '0106111000': 'Primates - Singes, lémuriens et autres primates vivants.',
  '0106209100': 'Tortues - Reptiles de l\'ordre des Testudines, vivants.',
  '0106391200': 'Pigeons voyageurs - Oiseaux de la famille des Columbidés, élevés pour le vol ou la consommation.',
  'default': 'Classification HSBoss - Voir Note Explicative Suisse pour plus de détails.'
};

function getNECitation(code: string): string {
  const codeClean = code.replace(/\./g, '');
  return neCitations[codeClean] || neCitations['default'];
}

// Appel au webhook n8n HSBoss Agent
async function callN8NAgent(description: string, userId?: string, sessionId?: string) {
  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description,
      userId: userId || 'anonymous',
      sessionId: sessionId || `sess_${Date.now()}`,
      timestamp: new Date().toISOString()
    }),
    // Timeout de 30 secondes pour l'agent
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    throw new Error(`n8n error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

// F-008: Classification par image via n8n
async function classifyImageWithN8N(imageBase64: string, userId?: string) {
  // Appel au même webhook avec l'image
  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: 'Classification par image',
      imageBase64,
      userId: userId || 'anonymous',
      sessionId: `sess_${Date.now()}`,
      timestamp: new Date().toISOString()
    }),
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    throw new Error(`n8n image error: ${response.status}`);
  }

  return await response.json();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, imageBase64, userId, sessionId } = body;

    // Validation
    if (!description && !imageBase64) {
      return NextResponse.json(
        { error: 'Description ou image requise' },
        { status: 400 }
      );
    }

    // F-008: Classification par image
    if (imageBase64) {
      try {
        if (USE_N8N) {
          const n8nResult = await classifyImageWithN8N(imageBase64, userId);
          
          return NextResponse.json({
            hsCode: n8nResult.code_hs?.replace(/\./g, '') || '0100000000',
            designation: n8nResult.designation || 'Classification par image',
            tauxDD: n8nResult.taux_douane || 'N/A',
            tauxTVA: '20%',
            unite: n8nResult.unite || 'nombre',
            aiSummary: n8nResult.analyse || 'Analyse par IA HSBoss',
            confidence: n8nResult.confiance || 80,
            neCitation: n8nResult.neCitation || getNECitation(n8nResult.code_hs || ''),
            sources: n8nResult.sources_utilisees || [],
            sessionId: n8nResult.sessionId,
            source: 'n8n-image'
          });
        }
      } catch (n8nError) {
        console.warn('n8n image classification failed, using fallback:', n8nError);
        // Fallback en cas d'erreur n8n
        return NextResponse.json({
          hsCode: '0105131000',
          designation: 'Poulets reproducteurs (mode dégradé)',
          tauxDD: '2.5%',
          tauxTVA: '20%',
          unite: 'nombre',
          aiSummary: 'Service de classification par image temporairement indisponible. Veuillez réessayer.',
          confidence: 50,
          neCitation: getNECitation('0105131000'),
          error: 'n8n_unavailable',
          source: 'fallback'
        });
      }
    }

    // Classification textuelle via HSBoss Agent n8n
    if (USE_N8N) {
      try {
        const n8nResult = await callN8NAgent(description, userId, sessionId);
        
        // Si l'agent retourne une erreur
        if (!n8nResult.success) {
          throw new Error(n8nResult.error || 'Agent error');
        }

        // Formatage de la réponse pour le frontend
        return NextResponse.json({
          hsCode: n8nResult.code_hs?.replace(/\./g, '') || '',
          designation: n8nResult.designation || description,
          tauxDD: typeof n8nResult.taux_douane === 'number' 
            ? `${n8nResult.taux_douane}%` 
            : n8nResult.taux_douane || 'N/A',
          tauxTVA: n8nResult.taux_tva || '20%',
          unite: n8nResult.unite || 'kg',
          aiSummary: n8nResult.analyse || `Classification HSBoss: ${n8nResult.designation}`,
          confidence: n8nResult.confiance || 80,
          neCitation: n8nResult.neCitation || getNECitation(n8nResult.code_hs || ''),
          chapitre: n8nResult.chapitre,
          codesCandidats: n8nResult.codes_candidats || [],
          alertes: n8nResult.alertes || [],
          recommandations: n8nResult.recommandations,
          sourcesVerifiees: n8nResult.sources_verifiees,
          verificationHumaine: n8nResult.verification_humaine_requise,
          sessionId: n8nResult.sessionId,
          ragActive: n8nResult.rag_active,
          source: 'hsboss-agent'
        });

      } catch (n8nError) {
        console.error('n8n agent error:', n8nError);
        
        // Fallback : message d'erreur user-friendly
        return NextResponse.json({
          error: 'Agent HSBoss temporairement indisponible',
          message: 'Le service de classification IA est en cours de maintenance. Veuillez réessayer dans quelques instants.',
          retryable: true,
          source: 'error'
        }, { status: 503 });
      }
    }

    // Fallback si USE_N8N = false (ne devrait pas arriver)
    return NextResponse.json({
      error: 'Configuration error',
      message: 'Le service de classification n\'est pas configuré correctement.'
    }, { status: 500 });

  } catch (error) {
    console.error('Classification error:', error);
    return NextResponse.json(
      { 
        error: 'Erreur de classification',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
