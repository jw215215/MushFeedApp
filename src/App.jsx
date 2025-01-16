import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Explore from './components/Explore';
import Navbar from './components/Navbar';
import AuthContext from './contexts/AuthContext';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [currentUser] = useState({
    id: 'tim_01',
    name: 'Tim Galebach',
    email: 'tim@mush.style'
  });

  console.log('App rendering...');
  return (
    <ErrorBoundary>
      <AuthContext.Provider value={{ currentUser }}>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/explore" element={<Explore />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthContext.Provider>
    </ErrorBoundary>
  );
}

export default App; 