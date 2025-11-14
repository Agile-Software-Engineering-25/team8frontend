import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

const fromEnv = import.meta.env.VITE_BACKEND_BASE_URL as string | undefined;
const local = 'http://localhost:8080/api/ase-08';

const normalize = (s: string) => s.replace(/\/+$/, '');
(window as any).API_BASE_URL = normalize(fromEnv ?? local);

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
