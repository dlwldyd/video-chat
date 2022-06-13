import Login from './login/Login';
import Home from './home/Home';
import FetchMemberInfo from './login/FetchMemberInfo';
import VideoChat from './chatRoom/VideoChat';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import SearchRoom from './chatRoom/SearchRoom';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/fetch' element={<FetchMemberInfo/>} />
        <Route path='/video-chat' element={<VideoChat/>} />
        <Route path='/search' element={<SearchRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
