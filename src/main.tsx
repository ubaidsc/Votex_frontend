import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Add global polyfill for AbortController if needed for older browsers
if (!window.AbortController) {
  window.AbortController = class {
    constructor() {
      this.signal = {
        aborted: false,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      };
    }
    abort() {
      this.signal.aborted = true;
    }
  };
}

// Mount the app
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);