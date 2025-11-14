import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

declare global {
  interface Window {
    API_BASE_URL: string;
  }
}

interface ImportMetaEnv {
  readonly VITE_BACKEND_BASE_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const defaultBase = '/api/ase-08';
const fromEnv = import.meta.env.VITE_BACKEND_BASE_URL;

window.API_BASE_URL = (fromEnv && fromEnv !== 'undefined' ? fromEnv : defaultBase).replace(/\/+$/, '');

if (!window.API_BASE_URL) {
  console.error('API_BASE_URL is not set');
}

const container = document.getElementById('root');
if (!container) {
  throw new Error("Root element with id 'root' not found");
}

ReactDOM.createRoot(container).render(<App />);
