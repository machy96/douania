'use client';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Douania</h1>
              <p className="text-xs text-gray-500">Classification Douanière IA</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Classification
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Historique
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Documentation
            </a>
          </nav>

          {/* Status Badge */}
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-700">En ligne</span>
          </div>
        </div>
      </div>
    </header>
  );
}
