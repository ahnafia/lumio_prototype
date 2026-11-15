import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Third-party styles, imported once: KaTeX for math, Mafs because B's animations may use it.
import 'katex/dist/katex.min.css';
import 'mafs/core.css';
import 'mafs/font.css';
import './design/tokens.css';
import './design/base.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
