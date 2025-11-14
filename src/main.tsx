import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

declare global {
  interface Window {
    API_BASE_URL: string;
  }
}

const defaultBase = '/api/ase-08';
const fromEnv = import.meta.env.VITE_BACKEND_BASE_URL;

window.API_BASE_URL = (fromEnv ?? defaultBase).replace(/\/+$/, '');

if (!window.API_BASE_URL) {
  console.error('API_BASE_URL is not set');
}

const root = document.getElementById('root');
if (!root) {
  throw new Error("Root element with id 'root' not found");
}

ReactDOM.createRoot(container).render(<App />);
