import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

declare global {
  interface ImportMetaEnv {
    readonly VITE_BACKEND_BASE_URL?: string; // https://sau-portal.de/masterdata/api/ase-08
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  interface Window {
    API_BASE_URL: string;
  }
}

const defaultBase = '/api/ase-08';
const fromVite = import.meta.env?.VITE_BACKEND_BASE_URL;

window.API_BASE_URL = (fromVite ?? defaultBase).replace(/\/+$/, '');

if (!window.API_BASE_URL) {
  console.error('API_BASE_URL ist nicht gesetzt.');
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root-Element #root nicht gefunden.');
}
ReactDOM.createRoot(rootEl).render(<App />);
