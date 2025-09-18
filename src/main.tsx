import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Startseite.tsx';

const rootElement = document.getElementById('root')!; 


ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);