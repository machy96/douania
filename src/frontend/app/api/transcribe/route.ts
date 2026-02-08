import { NextRequest, NextResponse } from 'next/server';

// F-008: Transcription audio avec Whisper API
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Fichier audio requis' },
        { status: 400 }
      );
    }

    // Dans la version réelle, appeler OpenAI Whisper API
    // const transcription = await openai.audio.transcriptions.create({
    //   file: audioFile,
    //   model: 'whisper-1',
    // });

    // Simulation pour le développement
    // On attend un peu pour simuler le traitement
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Réponse simulée
    const mockTranscriptions = [
      'Chevaux reproducteurs de race pure',
      'Bovins pour boucherie',
      'Volailles vivantes',
      'Chiens de race',
      'Produit à classifier'
    ];
    
    const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];

    return NextResponse.json({
      transcription: randomTranscription,
      language: 'fr',
      confidence: 0.92
    });

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Erreur de transcription' },
      { status: 500 }
    );
  }
}
