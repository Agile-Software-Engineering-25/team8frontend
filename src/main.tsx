import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// --- Typ für die Global-Variable ---
declare global {
  interface Window {
    API_BASE_URL: string;
  }
}

// Hilfsfunktionen
const stripTrailingSlash = (s: string) => s.replace(/\/+$/, '');
const hasValue = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

// Liefert eine sinnvolle Base-URL – auch ohne Build-Variable
function resolveApiBase(): string {
  // 1) aus Vite-Umgebung (wird zur Build-Zeit injiziert)
  const fromVite = (import.meta as any)?.env?.VITE_BACKEND_BASE_URL as unknown;

  if (hasValue(fromVite)) {
    return stripTrailingSlash(fromVite);
  }

  // 2) Fallback zur Laufzeit abhängig vom Host/Pfad
  //    - im Portal: /masterdata/api/ase-08
  //    - lokal:     /api/ase-08
  const isPortal = location.pathname.startsWith('/masterdata');
  const prefix = isPortal ? '/masterdata' : '';
  return `${prefix}/api/ase-08`;
}

// Global setzen (immer ohne trailing slash)
window.API_BASE_URL = resolveApiBase();

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
