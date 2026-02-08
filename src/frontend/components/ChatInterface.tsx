'use client';

import { useState, FormEvent, useEffect } from 'react';
import { ChatMessage, ClassificationResult } from '../types';
import { ClassificationResult as ResultComponent } from './ClassificationResult';
import { LoginModal } from './LoginModal';
import { QuotaDisplay } from './QuotaDisplay';
import { ImageUpload } from './ImageUpload';
import { VoiceRecorder } from './VoiceRecorder';
import { AuthService } from '../lib/auth';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const [quotaInfo, setQuotaInfo] = useState(AuthService.getQuotaInfo());
  const [showLogin, setShowLogin] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setShowLogin(true);
    }
  }, [user]);

  const handleLogin = () => {
    setUser(AuthService.getCurrentUser());
    setQuotaInfo(AuthService.getQuotaInfo());
    setShowLogin(false);
  };

  // F-008: Gestion de l'upload d'image
  const handleImageUpload = async (imageBase64: string) => {
    if (!imageBase64) {
      setPendingImage(null);
      setShowImageUpload(false);
      return;
    }
    
    setPendingImage(imageBase64);
    setShowImageUpload(false);
    
    // Auto-envoi de l'image
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: '[Image analysée]',
      timestamp: new Date(),
      imageUrl: imageBase64
    };
    
    setMessages((prev) => [...prev, userMessage]);
    await classifyImage(imageBase64);
  };

  const classifyImage = async (imageBase64: string) => {
    const { allowed } = AuthService.checkQuota();
    if (!allowed) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: '⚠️ Quota mensuel épuisé.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }),
      });

      const data = await response.json();

      if (data.hsCode) {
        AuthService.consumeQuota();
        setQuotaInfo(AuthService.getQuotaInfo());
      }

      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: `Classification par image: "${data.designation}"`,
        timestamp: new Date(),
        classification: data.hsCode ? {
          hsCode: data.hsCode,
          designation: data.designation,
          tauxDD: data.tauxDD,
          tauxTVA: data.tauxTVA,
          aiSummary: data.aiSummary,
          confidence: data.confidence,
          neCitation: data.neCitation
        } : undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Erreur lors de l\'analyse de l\'image.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setPendingImage(null);
    }
  };

  // F-008: Gestion de la note vocale
  const handleVoiceRecording = async (transcription: string) => {
    setInput(transcription);
    // Auto-envoi après transcription
    if (transcription) {
      // Créer un événement de soumission programmatique
      const fakeEvent = {
        preventDefault: () => {},
      } as FormEvent;
      
      setTimeout(() => {
        handleSubmit(fakeEvent);
      }, 500);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const { allowed } = AuthService.checkQuota();
    if (!allowed) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: '⚠️ Quota mensuel épuisé.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: userMessage.content }),
      });

      const data = await response.json();

      if (data.hsCode) {
        AuthService.consumeQuota();
        setQuotaInfo(AuthService.getQuotaInfo());
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.hsCode 
          ? `Classification trouvée: "${userMessage.content}"`
          : data.error || 'Une erreur est survenue',
        timestamp: new Date(),
        classification: data.hsCode ? {
          hsCode: data.hsCode,
          designation: data.designation,
          tauxDD: data.tauxDD,
          tauxTVA: data.tauxTVA,
          aiSummary: data.aiSummary,
          confidence: data.confidence,
          neCitation: data.neCitation
        } : undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Erreur de connexion.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showLogin && <LoginModal onLogin={handleLogin} />}
      
      <div className="flex flex-col h-[600px]">
        {user && quotaInfo && (
          <div className="px-4 pt-4">
            <QuotaDisplay {...quotaInfo} />
          </div>
        )}
        
        {/* F-008: Upload d'image */}
        {showImageUpload && (
          <div className="px-4 py-2">
            <ImageUpload onImageUpload={handleImageUpload} />
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg">Commencez une conversation</p>
                <p className="text-sm mt-2">Décrivez votre produit ou envoyez une image</p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`animate-slide-up ${message.type === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.type === 'user' ? 'bg-blue-600 text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'}`}>
                {message.imageUrl && (
                  <img src={message.imageUrl} alt="Uploaded" className="w-32 h-32 object-cover rounded-lg mb-2" />
                )}
                <p className="text-sm">{message.content}</p>
                {message.classification && (
                  <div className="mt-3">
                    <ResultComponent result={message.classification} />
                  </div>
                )}
                <span className={`text-xs mt-2 block ${message.type === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 p-4 bg-white">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            {/* F-008: Bouton image */}
            <button
              type="button"
              onClick={() => setShowImageUpload(!showImageUpload)}
              className={`p-3 rounded-xl transition-colors ${showImageUpload ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              title="Ajouter une image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Décrivez votre produit..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading || !user}
            />
            
            {/* F-008: Bouton vocal */}
            <VoiceRecorder onRecordingComplete={handleVoiceRecording} />
            
            <button
              type="submit"
              disabled={!input.trim() || isLoading || !user}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
            >
              <span>Envoyer</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
