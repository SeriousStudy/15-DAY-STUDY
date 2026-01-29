
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Initializing Accountancy Bootcamp...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Critical Failure: Root element not found.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("React Render Error:", err);
  }
}
