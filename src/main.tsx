import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Startseite } from './Startseite.tsx';
import { EditRolePage } from './role/RolleEditieren.tsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Startseite />} />
      <Route path="/role/:roleId" element={<EditRolePage />} />
    </Routes>
  </BrowserRouter>
);
