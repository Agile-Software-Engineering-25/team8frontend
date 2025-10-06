import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Startseite } from './Startseite.tsx';
import { EditRolePage } from './edit/RolleEditieren.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Startseite />} />

      <Route path="/edit/:roleId" element={<EditRolePage />} />
    </Routes>
  </BrowserRouter>
);
