import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Startseite } from './MainPage.tsx';
import { EditGroupPage } from './group/EditGroup.tsx';
import { GroupUserList } from './group-users/GroupUserList.tsx';

type AppProps = {
  basename?: string;
};

const App = (props: AppProps) => {
  return (
    <BrowserRouter basename={props.basename ?? '/'}>
      <Routes>
        <Route path="/" element={<Startseite />} />
        <Route path="/group/:groupId" element={<EditGroupPage />} />
        <Route path="/group-users/:groupId" element={<GroupUserList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
