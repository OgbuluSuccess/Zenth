import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import contexts
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Simple Home component
function HomePage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Zynith Investment Platform</h1>
      <p>Welcome to the Zynith Investment Platform!</p>
    </div>
  );
}

// Simple About component
function AboutPage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>About Zynith</h1>
      <p>This is the about page for Zynith Investment Platform.</p>
    </div>
  );
}

function FullTestApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <nav style={{ background: '#333', padding: '10px', marginBottom: '20px' }}>
              <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', justifyContent: 'center' }}>
                <li><a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a></li>
                <li><a href="/about" style={{ color: 'white', textDecoration: 'none' }}>About</a></li>
              </ul>
            </nav>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default FullTestApp;
