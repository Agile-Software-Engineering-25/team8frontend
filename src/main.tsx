import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

declare global {
  interface Window {
    API_BASE_URL: string;
  }
}

const stripTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

function resolveApiBase(): string {
  // 1) Build-Zeit aus Vite (optional)
  const fromVite = (import.meta as ImportMeta).env
    ?.VITE_BACKEND_BASE_URL as unknown;

  if (isNonEmptyString(fromVite)) {
    return stripTrailingSlash(fromVite);
  }

  const inPortal = /^\/masterdata(\/|$)/.test(window.location.pathname);
  const prefix = inPortal ? '/masterdata' : '';

  return `${prefix}/api/ase-08`;
}

window.API_BASE_URL = resolveApiBase();

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
