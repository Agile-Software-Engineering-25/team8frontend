import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Startseite } from './Startseite.tsx';
import { EditRolePage } from './role/RolleEditieren.tsx';
import { UserBaseRoleList } from './base-role/UserBaseRoleList.tsx';
import { RoleUserList } from './role-users/RoleUserList.tsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Startseite />} />
      <Route path="/role/:roleId" element={<EditRolePage />} />
      <Route path="/base-role/:baseRoleId" element={<UserBaseRoleList />} />
       <Route path="/role-users/:roleId" element={<RoleUserList />} />
    </Routes>
  </BrowserRouter>
);
