'use client';

import type { ClassificationResult as ClassificationResultType } from '../types';

interface ClassificationResultProps {
  result: ClassificationResultType;
}

export function ClassificationResult({ result }: ClassificationResultProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 90) return 'Élevée';
    if (confidence >= 70) return 'Moyenne';
    return 'Faible';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mt-3">
      {/* Header avec Code HS */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-blue-100 text-sm font-medium">Code HS</span>
          <span className={`text-xs px-2 py-1 rounded-full border ${getConfidenceColor(result.confidence)}`}>
            Confiance {getConfidenceLabel(result.confidence)}
          </span>
        </div>
        <p className="text-2xl font-bold text-white mt-1 font-mono">
          {result.hsCode}
        </p>
      </div>

      {/* Détails */}
      <div className="p-4 space-y-3">
        <div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Désignation Douanière
          </span>
          <p className="text-gray-900 font-medium mt-1 leading-relaxed">
            {result.designation}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">
              Taux DD
            </span>
            <p className={`text-lg font-bold mt-1 ${
              result.tauxDD === '0%' ? 'text-green-600' : 'text-gray-900'
            }`}>
              {result.tauxDD}
              {result.tauxDD === '0%' && (
                <span className="text-sm font-normal text-green-600 ml-1">
                  (Exonéré)
                </span>
              )}
            </p>
          </div>

          {/* Barre de confiance */}
          <div className="flex-1 ml-6">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
              Fiabilité
            </span>
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    result.confidence >= 90 ? 'bg-green-500' :
                    result.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 w-10">
                {result.confidence}%
              </span>
            </div>
          </div>
        </div>

        {/* F-004: Citation NE Suisses */}
        {result.neCitation && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="text-xs font-medium text-amber-700 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Note Explicative Suisse
            </span>
            <p className="text-sm text-amber-900 mt-1 italic">
              "{result.neCitation}"
            </p>
            <span className="text-xs text-amber-600 mt-1 block">
              Source: BAZG - Notes Explicatives 2022
            </span>
          </div>
        )}

        {/* F-005: Bouton Export PDF */}
        <div className="pt-3 border-t border-gray-100">
          <button
            onClick={() => exportToPDF(result)}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exporter en PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// F-005: Fonction export PDF
function exportToPDF(result: ClassificationResultType) {
  const content = `
RAPPORT DE CLASSIFICATION DOUANIERE
=====================================

Code HS: ${result.hsCode}
Désignation: ${result.designation}
Taux DD: ${result.tauxDD}
Taux TVA: ${result.tauxTVA || '20%'}
Confiance: ${result.confidence}%

Note Explicative:
${result.neCitation || 'N/A'}

Document généré par Douania - ${new Date().toLocaleDateString('fr-FR')}
  `;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `classification-${result.hsCode}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
