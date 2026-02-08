import { NextRequest, NextResponse } from 'next/server';
import { hsCodesChapitre01 } from '../../../data/hsCodesCh01';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // Recherche par mot-clé dans les 93 positions
    const query = description.toLowerCase();
    const matches = hsCodesChapitre01.filter(hs => 
      hs.designation.toLowerCase().includes(query) ||
      hs.code.includes(query)
    );

    if (matches.length === 0) {
      return NextResponse.json({
        error: 'Aucun code HS trouvé pour cette description',
        suggestion: 'Essayez avec des termes comme: cheval, bovin, poulet, chien, oiseau...'
      });
    }

    // Prendre le meilleur match (premier résultat)
    const bestMatch = matches[0];
    
    return NextResponse.json({
      hsCode: bestMatch.code,
      designation: bestMatch.designation,
      tauxDD: `${bestMatch.taux}%`,
      tauxTVA: '20%',
      unite: bestMatch.unite,
      aiSummary: `Classification trouvée: ${bestMatch.designation}`,
      confidence: matches.length === 1 ? 95 : 85,
      neCitation: 'Chapitre 01 - Animaux vivants',
      matchesFound: matches.length,
      allMatches: matches.slice(0, 5) // Retourner les 5 premiers résultats
    });
  } catch (error) {
    console.error('Classification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
