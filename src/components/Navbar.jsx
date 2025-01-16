import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo" onClick={handleLogoClick}>
          <img src="/mushlogo.png" alt="Mush" className="mush-logo" />
          <span className="feed-text">feed</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            {location.pathname === '/' ? '🏠' : '🏚️'}
          </Link>
          <Link to="/explore" className={location.pathname === '/explore' ? 'active' : ''}>
            {location.pathname === '/explore' ? '🔍' : '🔎'}
          </Link>
          {currentUser && (
            <Link to={`/profile/${currentUser.id}`}>
              <img 
                src={`https://picsum.photos/id/1025/32/32`} 
                alt={currentUser.name}
                className="nav-avatar" 
              />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 