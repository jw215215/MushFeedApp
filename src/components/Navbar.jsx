import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          MushFeed
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