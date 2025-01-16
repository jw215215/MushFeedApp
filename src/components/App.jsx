import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Feed from './Feed';
import Profile from './Profile';
import Explore from './Explore';
import AuthContext from '../contexts/AuthContext';
import { useState } from 'react';

function App() {
  const [currentUser, setCurrentUser] = useState({
    id: 'tim_01', // Default logged in user for demo
    name: 'Tim Galebach',
    email: 'tim@mush.style'
  });

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile/:userId" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App; 