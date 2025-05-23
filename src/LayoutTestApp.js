import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import contexts
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Import AppLayout
import AppLayout from './components/AppLayout';

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

function LayoutTestApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <AppLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </AppLayout>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default LayoutTestApp;
