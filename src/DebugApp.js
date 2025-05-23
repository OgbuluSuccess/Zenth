import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'animate.css';

// Import the API test component
import ApiTest from './ApiTest';

// Import contexts
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function DebugApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<ApiTest />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default DebugApp;
