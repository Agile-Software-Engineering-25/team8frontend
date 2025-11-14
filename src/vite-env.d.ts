/// <reference types="vite/client" />

declare global {
  interface Window {
    API_BASE_URL: string;
  }
}
export {};

interface ImportMetaEnv {
  readonly VITE_BACKEND_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}