import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [isLogin, setIsLogin] = useState(true);  // Estado para controlar si es Login o Register

  // Función para alternar entre Login y Register
  const toggleForm = () => {
    setIsLogin(!isLogin);  // Cambia entre Login y Register
  };

  return (
    <div>
      <h1>Bienvenido a Schedule AI</h1>
      
      {/* Botón para alternar entre Login y Register */}
      <button onClick={toggleForm}>
        {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
      </button>
      
      {/* Renderiza Login si isLogin es true, o Register si es false */}
      {isLogin ? <Login /> : <Register />}
    </div>
  );
}

export default App;
