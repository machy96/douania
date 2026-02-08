// Types partagés entre frontend et backend

export interface ClassificationRequest {
  query: string;
}

export interface ClassificationResult {
  hsCode: string;
  designation: string;
  tauxDD: string; // Taux de droits de douane
  tauxTVA?: string; // Taux de TVA
  aiSummary?: string; // Résumé IA
  confidence: number; // 0-100
  neCitation?: string; // Citation Note Explicative
}

export interface ClassificationResponse {
  success: boolean;
  result?: ClassificationResult;
  error?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  classification?: ClassificationResult;
}
