import { useState, useCallback } from 'react';
import { Layout, type PageId } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { MessageScanner } from './pages/MessageScanner';
import { UrlAnalyzer } from './pages/UrlAnalyzer';
import { Report } from './pages/Report';
import { CyberSahayak } from './pages/CyberSahayak';
import { IncidentCenter } from './pages/IncidentCenter';
import { Learning } from './pages/Learning';
import type { AnalysisResult } from './types';
import './styles/global.css';

const TITLES: Record<PageId, string> = {
  dashboard: 'Dashboard',
  'message-scanner': 'Scam Message Scanner',
  'url-analyzer': 'URL Analyzer',
  report: 'Analysis Report',
  cybersahayak: 'CyberSahayak',
  incidents: 'Incident Center',
  learning: 'Cyber Safety Learning',
};

function App() {
  const [page, setPage] = useState<PageId>('dashboard');
  const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);

  const onResult = useCallback((r: AnalysisResult) => {
    setLastResult(r);
  }, []);

  return (
    <Layout current={page} onNavigate={setPage} title={TITLES[page]}>
      {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
      {page === 'message-scanner' && (
        <MessageScanner onNavigate={setPage} onResult={onResult} />
      )}
      {page === 'url-analyzer' && (
        <UrlAnalyzer onNavigate={setPage} onResult={onResult} />
      )}
      {page === 'report' && <Report result={lastResult} onNavigate={setPage} />}
      {page === 'cybersahayak' && <CyberSahayak />}
      {page === 'incidents' && <IncidentCenter />}
      {page === 'learning' && <Learning />}
    </Layout>
  );
}

export default App;
