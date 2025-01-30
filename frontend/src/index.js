import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Asegúrate de que index.css existe
import App from './App'; // Asegúrate de que App.jsx o App.js exista
import { reportWebVitals } from './reportWebVitals';


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
