'use client';

import { ChatInterface } from '@/components/ChatInterface';
import { Header } from '@/components/Header';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Classification Douanière
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Décrivez votre produit en langage naturel et obtenez instantanément 
            le code HS, la désignation douanière et le taux de droits.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <ChatInterface />
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Exemples : iPhone, ordinateur portable, café, chaussures, T-shirt...</p>
        </div>
      </div>
    </main>
  );
}
