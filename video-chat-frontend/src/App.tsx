import Login from './login/Login';
import Home from './home/Home';
import FetchMemberInfo from './fetch/FetchMemberInfo';
import VideoChat from './chatRoom/VideoChat';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/fetch' element={<FetchMemberInfo/>} />
        <Route path='/video-chat/:roomKey' element={<VideoChat/>} />
      </Routes>
    </Router>
  );
}

export default App;
