import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Startseite } from './MainPage.tsx';
import { EditGroupPage } from './group/EditGroup.tsx';
import { GroupUserList } from './group-users/GroupUserList.tsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Startseite />} />
      <Route path="/group/:groupId" element={<EditGroupPage />} />
      <Route path="/group-users/:groupId" element={<GroupUserList />} />
    </Routes>
  </BrowserRouter>
);
