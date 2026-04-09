import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './exam-prep-terminal-preview.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
