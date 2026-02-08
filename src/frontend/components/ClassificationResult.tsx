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
      </div>
    </div>
  );
}
