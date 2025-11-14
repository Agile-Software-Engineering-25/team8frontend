import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

declare global {
  interface Window {
    API_BASE_URL: string;
  }
}

const fromVite = (import.meta as any).env?.VITE_BACKEND_BASE_URL as string | undefined;
const DEFAULT_BASE = '/api/ase-08';

window.API_BASE_URL = (fromVite || DEFAULT_BASE).replace(/\/+$/, '');

if (!window.API_BASE_URL) {
  console.error('API_BASE_URL ist nicht gesetzt!');
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
