import React,{Suspense, lazy} from 'react';
import{BrowserRouter ,Routes,Route} from 'react-router-dom';
import ProtectRoute from './components/styles/auth/ProtectRoute';
import { LayoutLoader } from './components/layout/Loaders';


const Home= lazy(()=> import("./pages/Home"));
const Login= lazy(()=> import("./pages/Login")); //dynamic import
const Groups= lazy(()=> import("./pages/Groups"));
const Chat= lazy(()=> import("./pages/Chat"));
const Notfound=lazy(()=> import("./pages/NotFound"));
const AdminLogin=lazy(()=>import("./pages/admin/AdminLogin"));
const Dashboard =lazy(()=>import("./pages/admin/Dashboard"));
const UserManagement =lazy(()=>import("./pages/admin/UserManagement"));
const ChatManagement =lazy(()=>import("./pages/admin/ChatManagement"));
const MessagesManagement =lazy(()=>import("./pages/admin/MessageManagement"));

let user=true;

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
      <Routes>

<Route element={<ProtectRoute user={user}/>} >
  <Route path="/" element={<Home />} />
  <Route path="/chat/:chatId" element={<Chat />} />
  <Route path="/groups" element={<Groups />} />
</Route>

<Route path="/login" element={ <Login /> } />

<Route path='/admin' element={<AdminLogin />} />
<Route path='/admin/dashboard' element={<Dashboard />} />
<Route path='/admin/users' element={<UserManagement />} />
<Route path='/admin/chats' element={<ChatManagement />} />
<Route path='/admin/messages' element={<MessagesManagement />} />

<Route path="*" element={<Notfound />} />

</Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App