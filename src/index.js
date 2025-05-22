import React from 'react';
import ReactDOM from 'react-dom/client';

// Import Tailwind CSS and custom styles
import './styles/main.css';

// Import custom scrollbar hiding styles
import './styles/scrollbar-hide.css';

// We'll keep Bootstrap for now during transition
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import animate.css for animations
import 'animate.css';

// Import custom CSS files
import './index.css';

// Import the App component
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import template CSS files
// Note: CSS files in public folder are automatically included via index.html

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
