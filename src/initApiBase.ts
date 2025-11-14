// src/initApiBase.ts

declare global {
  interface Window {
    API_BASE_URL: string;
  }
}

const stripSlash = (v: string) => v.replace(/\/+$/, '');

const isNonEmpty = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0;

function resolveApiBase(): string {
  // 1) Build-Zeit per Vite (optional)
  const fromVite = (import.meta as ImportMeta).env
    ?.VITE_BACKEND_BASE_URL as unknown;
  if (isNonEmpty(fromVite)) return stripSlash(fromVite);

  // 2) Laufzeit-Fallback (Portal vs. lokal)
  const inPortal = /^\/masterdata(\/|$)/.test(location.pathname);
  const prefix = inPortal ? '/masterdata' : '';
  return `${prefix}/api/ase-08`;
}

window.API_BASE_URL = resolveApiBase();
