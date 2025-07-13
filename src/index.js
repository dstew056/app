import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18+
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* This is where your root component is initially rendered */}
  </React.StrictMode>
);