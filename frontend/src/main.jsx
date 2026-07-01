import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/main.css';

// Apply the saved theme (curtains open = light, closed = dark) before the
// first paint so there's no flash of the wrong palette.
const savedTheme = localStorage.getItem("couchtime:theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
