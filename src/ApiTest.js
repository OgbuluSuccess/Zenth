import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';

function ApiTest() {
  const [apiStatus, setApiStatus] = useState('Testing...');
  const [plans, setPlans] = useState([]);
  const [loginStatus, setLoginStatus] = useState('');
  const [error, setError] = useState(null);

  // Test basic API connection
  useEffect(() => {
    const testApi = async () => {
      try {
        // Test the root endpoint
        const response = await axios.get('http://localhost:5000/');
        setApiStatus(`API is reachable: ${response.data}`);
      } catch (err) {
        setApiStatus(`API connection error: ${err.message}`);
        setError(err);
      }
    };

    testApi();
  }, []);

  // Test investment plans endpoint
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        console.log('Fetching plans from:', `${config.apiUrl}/investment-plans`);
        const response = await axios.get(`${config.apiUrl}/investment-plans`);
        setPlans(response.data);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError(err);
      }
    };

    fetchPlans();
  }, []);

  // Test login functionality
  const testLogin = async () => {
    try {
      setLoginStatus('Attempting login...');
      const response = await axios.post(`${config.apiUrl}/auth/login`, {
        email: 'test@example.com',
        password: 'password123'
      });
      setLoginStatus(`Login successful: ${JSON.stringify(response.data)}`);
    } catch (err) {
      setLoginStatus(`Login failed: ${err.message}`);
      setError(err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>API Connection Test</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
        <h2>Basic API Connection</h2>
        <p><strong>Status:</strong> {apiStatus}</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
        <h2>Investment Plans</h2>
        <p><strong>Config API URL:</strong> {config.apiUrl}</p>
        {plans.length > 0 ? (
          <ul>
            {plans.map(plan => (
              <li key={plan._id}>{plan.name} - {plan.description.substring(0, 100)}...</li>
            ))}
          </ul>
        ) : (
          <p>No plans loaded</p>
        )}
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
        <h2>Login Test</h2>
        <button 
          onClick={testLogin}
          style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Test Login
        </button>
        <p style={{ marginTop: '10px' }}>{loginStatus}</p>
      </div>

      {error && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#ffebee', border: '1px solid #f44336' }}>
          <h2>Error Details</h2>
          <p><strong>Message:</strong> {error.message}</p>
          {error.response && (
            <>
              <p><strong>Status:</strong> {error.response.status}</p>
              <p><strong>Data:</strong> {JSON.stringify(error.response.data)}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ApiTest;
