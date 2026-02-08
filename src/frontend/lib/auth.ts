// F-006 & F-007: Authentification et Gestion des Quotas

const STORAGE_KEY = 'douania_user';
const QUOTA_LIMIT = 50; // 50 requêtes par mois pour le plan gratuit

export interface User {
  id: string;
  email: string;
  nom: string;
  entreprise: string;
  plan: 'free' | 'starter' | 'pro';
  quota: number;
  used: number;
  createdAt: string;
}

export const AuthService = {
  // Créer un utilisateur (simplifié - sans mot de passe pour l'instant)
  login: (email: string, nom: string, entreprise: string): User => {
    const existing = AuthService.getCurrentUser();
    if (existing && existing.email === email) {
      return existing;
    }
    
    const user: User = {
      id: Math.random().toString(36).substring(7),
      email,
      nom,
      entreprise,
      plan: 'free',
      quota: QUOTA_LIMIT,
      used: 0,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },
  
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },
  
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
  
  // F-007: Vérifier et consommer quota
  checkQuota: (): { allowed: boolean; remaining: number } => {
    const user = AuthService.getCurrentUser();
    if (!user) return { allowed: false, remaining: 0 };
    
    // Reset mensuel
    const lastMonth = new Date(user.createdAt).getMonth();
    const currentMonth = new Date().getMonth();
    if (lastMonth !== currentMonth) {
      user.used = 0;
      user.createdAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
    
    const remaining = user.quota - user.used;
    return { allowed: remaining > 0, remaining };
  },
  
  consumeQuota: (): boolean => {
    const user = AuthService.getCurrentUser();
    if (!user) return false;
    
    if (user.used >= user.quota) {
      return false;
    }
    
    user.used += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return true;
  },
  
  getQuotaInfo: () => {
    const user = AuthService.getCurrentUser();
    if (!user) return null;
    
    return {
      used: user.used,
      quota: user.quota,
      remaining: user.quota - user.used,
      percentage: Math.round((user.used / user.quota) * 100)
    };
  }
};
