import { NextRequest, NextResponse } from 'next/server';

// Mock classification data for Chapter 01
const mockClassifications: Record<string, any> = {
  'cheval': {
    hsCode: '0101210000',
    designation: 'Chevaux reproducteurs de race pure',
    tauxDD: '2.5%',
    tauxTVA: '20%',
    aiSummary: 'Chevaux vivants, reproducteurs de race pure',
    confidence: 95,
    neCitation: 'Chapitre 01 - Note explicative: Les animaux vivants...'
  },
  'bovin': {
    hsCode: '0102210000',
    designation: 'Bovins reproducteurs de race pure',
    tauxDD: '2.5%',
    tauxTVA: '20%',
    aiSummary: 'Animaux vivants de l\'espèce bovine',
    confidence: 92,
    neCitation: 'Chapitre 01 - Note explicative: Les bovins...'
  },
  'poulet': {
    hsCode: '0105131000',
    designation: 'Poulets reproducteurs de race pure',
    tauxDD: '2.5%',
    tauxTVA: '20%',
    aiSummary: 'Volailles vivantes de l\'espèce Gallus domesticus',
    confidence: 88,
    neCitation: 'Chapitre 01 - Note explicative: Les volailles...'
  }
};

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

    // Simple keyword matching for demo
    const desc = description.toLowerCase();
    let result = mockClassifications['bovin']; // default

    if (desc.includes('cheval') || desc.includes('jument') || desc.includes('etalon')) {
      result = mockClassifications['cheval'];
    } else if (desc.includes('poulet') || desc.includes('poule') || desc.includes('volaille')) {
      result = mockClassifications['poulet'];
    } else if (desc.includes('boeuf') || desc.includes('vache') || desc.includes('taureau')) {
      result = mockClassifications['bovin'];
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Classification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
