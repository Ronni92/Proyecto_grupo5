import React from "react";
import { Link } from "react-router-dom";
import "../App.css"; // Ruta corregida

const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Bienvenido a nuestra aplicación</h1>
      <p>Por favor, selecciona una opción para continuar.</p>
      <div className="button-container">
        <Link to="/login">
          <button className="btn-primary">Iniciar Sesión</button>
        </Link>
        <Link to="/register">
          <button className="btn-secondary">Registrarse</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
