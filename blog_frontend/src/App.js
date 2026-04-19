import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import CreatePost from './Components/CreatePost'
import PostView from './Components/PostDetail'
import UserDetail from './Components/UserDetail';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path="/home_page" element={<Home/>} />
          <Route path="/create_post" element={<CreatePost/>}/>
          <Route path="/post_view/:id" element={<PostView />} />
          <Route path="/user/:userId" element={<UserDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
