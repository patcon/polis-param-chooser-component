import React, { useState } from 'react';
import HomePage from './HomePage';
import ParameterExplorerApp from './ParameterExplorerApp';
import { App as OpinionLandscapeApp } from './components/custom/App';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

type CurrentPage = 'home' | 'parameter-explorer' | 'opinion-landscape';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');

  const handleNavigate = (page: 'parameter-explorer' | 'opinion-landscape') => {
    setCurrentPage(page);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  // Render the appropriate component based on current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'parameter-explorer':
        return <ParameterExplorerApp />;
      case 'opinion-landscape':
        return <OpinionLandscapeApp />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="relative">
      {/* Back to Home Button - Only show when not on home page */}
      {currentPage !== 'home' && (
        <Button
          onClick={handleBackToHome}
          className="fixed top-12 left-4 z-[50] flex items-center gap-2 bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200 hover:bg-white hover:shadow-md transition-all h-9"
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </Button>
      )}

      {/* Current Page Content */}
      {renderCurrentPage()}
    </div>
  );
};

export default App;