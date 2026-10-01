import { useState } from 'react';
import { StorageProvider, useStorage } from '@/store';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { ToastContainer } from '@/components/Toast';
import { useToasts } from '@/hooks/useToasts';
import { ConfirmDialog } from '@/components/Modal';
import { Button } from '@/components/ui';
import { RotateCcw, Database } from 'lucide-react';
import type { PageKey } from '@/types';
import { Dashboard } from '@/pages/Dashboard';
import { Events } from '@/pages/Events';
import { WasteTracking } from '@/pages/WasteTracking';
import { ResourceMonitoring } from '@/pages/ResourceMonitoring';
import { GreenChecklist } from '@/pages/GreenChecklist';
import { Analytics } from '@/pages/Analytics';
import { SustainabilityGuide } from '@/pages/SustainabilityGuide';
import { AboutProject } from '@/pages/AboutProject';

function AppContent() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const { resetDemoData, clearAllData } = useStorage();
  const { success } = useToasts();
  const [resetOpen, setResetOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);

  const handleResetDemo = () => {
    resetDemoData();
    success('Demo data has been restored.');
    setResetOpen(false);
  };

  const handleClearAll = () => {
    clearAllData();
    success('All data has been cleared. You can now create fresh events.');
    setClearOpen(false);
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard onNavigate={setPage} />;
      case 'events':
        return <Events onNavigate={setPage} />;
      case 'waste':
        return <WasteTracking onNavigate={setPage} />;
      case 'resources':
        return <ResourceMonitoring onNavigate={setPage} />;
      case 'checklist':
        return <GreenChecklist onNavigate={setPage} />;
      case 'analytics':
        return <Analytics onNavigate={setPage} />;
      case 'guide':
        return <SustainabilityGuide />;
      case 'about':
        return <AboutProject />;
      default:
        return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-forest-950">
      <Sidebar current={page} onNavigate={setPage} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar current={page} />
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          {renderPage()}
        </main>
        <footer className="px-6 py-4 border-t border-forest-600/30 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-gray-600">
            EcoEvent — Technologies for Sustainable Events · CEP Project Prototype
          </p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="text-xs" onClick={() => setResetOpen(true)}>
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo Data</span>
            </Button>
            <Button variant="ghost" className="text-xs text-gray-500" onClick={() => setClearOpen(true)}>
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear All Data</span>
            </Button>
          </div>
        </footer>
      </div>

      <ConfirmDialog
        open={resetOpen}
        title="Reset to Demo Data"
        message="This will replace all current data with the original demo dataset. Any events or records you created will be lost. Continue?"
        confirmLabel="Reset"
        onConfirm={handleResetDemo}
        onCancel={() => setResetOpen(false)}
      />
      <ConfirmDialog
        open={clearOpen}
        title="Clear All Data"
        message="This will permanently delete all events, waste records, resource records, and checklist progress. You will start with an empty application. This cannot be undone. Continue?"
        confirmLabel="Clear Everything"
        danger
        onConfirm={handleClearAll}
        onCancel={() => setClearOpen(false)}
      />
    </div>
  );
}

function App() {
  const toasts = useToasts();
  return (
    <StorageProvider>
      <AppContent />
      <ToastContainer toasts={toasts.toasts} onDismiss={toasts.dismiss} />
    </StorageProvider>
  );
}

export default App;
