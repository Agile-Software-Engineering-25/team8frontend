/// <reference types="vite/client" />
export {};

interface ImportMetaEnv {
  readonly VITE_BACKEND_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}