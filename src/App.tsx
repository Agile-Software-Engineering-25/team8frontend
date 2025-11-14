import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Startseite } from './MainPage.tsx';
import { EditGroupPage } from './group/EditGroup.tsx';
import { GroupUserList } from './group-users/GroupUserList.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Startseite />} />
        <Route path="/group/:groupId" element={<EditGroupPage />} />
        <Route path="/group-users/:groupId" element={<GroupUserList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
