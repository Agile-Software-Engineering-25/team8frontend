import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Startseite } from './MainPage.tsx';
import { EditGroupPage } from './group/EditGroup.tsx';
// import { UserBaseGroupList } from './base-Group/UserBaseGroupList.tsx';
import { GroupUserList } from './group-users/GroupUserList.tsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Startseite />} />
      <Route path="/Group/:GroupId" element={<EditGroupPage />} />
      
      <Route path="/Group-users/:GroupId" element={<GroupUserList />} />
    </Routes>
  </BrowserRouter>
);

//<Route path="/base-Group/:baseGroupId" element={<UserBaseGroupList />} />