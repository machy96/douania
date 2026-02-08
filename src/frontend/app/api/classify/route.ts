import { NextRequest, NextResponse } from 'next/server';
import { hsCodesChapitre01 } from '../../../data/hsCodesCh01';

// F-004: Citations NE Suisses par code
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
  'default': 'Chapitre 01 - Animaux vivants. Voir Note Explicative Suisse pour plus de détails sur la classification.'
};

function getNECitation(code: string): string {
  return neCitations[code] || neCitations['default'];
}

// F-008: Classification par image (simulation pour l'instant)
async function classifyImage(imageBase64: string) {
  // Dans la version réelle, appeler GPT-4 Vision ici
  // Pour l'instant, on retourne un résultat basé sur des mots-clés simulés
  
  // Simulation: analyse basique de l'image
  // On pourrait détecter des patterns dans l'image base64
  
  // Résultat simulé
  return {
    hsCode: '0105131000',
    designation: 'Poulets reproducteurs de race pure (classification par image)',
    taux: 2.5,
    unite: 'nombre',
    confidence: 88,
    note: 'Analyse par GPT-4 Vision (mode démo)'
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, imageBase64 } = body;

    // F-008: Classification par image
    if (imageBase64) {
      const imageResult = await classifyImage(imageBase64);
      
      return NextResponse.json({
        hsCode: imageResult.hsCode,
        designation: imageResult.designation,
        tauxDD: `${imageResult.taux}%`,
        tauxTVA: '20%',
        unite: imageResult.unite,
        aiSummary: imageResult.note,
        confidence: imageResult.confidence,
        neCitation: getNECitation(imageResult.hsCode),
        source: 'image'
      });
    }

    // Classification textuelle (existant)
    if (!description) {
      return NextResponse.json(
        { error: 'Description ou image requise' },
        { status: 400 }
      );
    }

    const query = description.toLowerCase();
    const matches = hsCodesChapitre01.filter(hs => 
      hs.designation.toLowerCase().includes(query) ||
      hs.code.includes(query)
    );

    if (matches.length === 0) {
      return NextResponse.json({
        error: 'Aucun code HS trouvé',
        suggestion: 'Essayez avec: cheval, bovin, poulet, chien, oiseau...'
      });
    }

    const bestMatch = matches[0];
    const citation = getNECitation(bestMatch.code);
    
    return NextResponse.json({
      hsCode: bestMatch.code,
      designation: bestMatch.designation,
      tauxDD: `${bestMatch.taux}%`,
      tauxTVA: '20%',
      unite: bestMatch.unite,
      aiSummary: `Classification trouvée: ${bestMatch.designation}`,
      confidence: matches.length === 1 ? 95 : 85,
      neCitation: citation,
      matchesFound: matches.length,
      allMatches: matches.slice(0, 5),
      source: 'text'
    });
  } catch (error) {
    console.error('Classification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
