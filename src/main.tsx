import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

window.API_BASE_URL = 'http://localhost:8080/api/ase-08';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
