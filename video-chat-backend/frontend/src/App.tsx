import Login from './Auth/Login';
import Home from './home/Home';
import FetchMemberInfo from './Auth/FetchMemberInfo';
import VideoChat from './chatRoom/VideoChat';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SearchRoom from './chatRoom/SearchRoom';
import ValidateAuth from './Auth/ValidateAuth';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/fetch' element={<FetchMemberInfo/>} />
        <Route path='/video-chat' element={<ValidateAuth element={<VideoChat />} />} />
        <Route path='/search' element={<ValidateAuth element={<SearchRoom />} />} />
      </Routes>
    </Router>
  );
}

export default App;
