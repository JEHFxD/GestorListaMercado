import React from 'react';
import ReactDOM from 'react-dom/client';  // Importa ReactDOM de 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';  // Importa BrowserRouter
import App from './App';  // Aquí importas tu componente principal

// Usa createRoot para crear el "root" de la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza la aplicación envuelta en BrowserRouter
root.render(
  <BrowserRouter>
    <App />  {/* Aquí se renderiza el componente principal */}
  </BrowserRouter>
);
