// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [activities, setActivities] = useState([]);

  // Funciones de autenticación
  const login = async (username, password) => {
    const response = await axios.post('/token', {
      username,
      password,
      grant_type: 'password'
    });
    localStorage.setItem('token', response.data.access_token);
    setCurrentUser(username);
  };

  const register = async (username, password) => {
    await axios.post('/register', { username, password });
    login(username, password);
  };

  // Obtener horario
  const fetchSchedule = async () => {
    const response = await axios.get('/generate-schedule', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setSchedule(response.data);
  };

  // Obtener actividades recomendadas
  const fetchRecommendedActivities = async () => {
    const response = await axios.get('/recommended-activities', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setActivities(response.data);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white">
          <Link to="/" className="mr-4">Horario</Link>
          <Link to="/recommended" className="mr-4">Actividades Recomendadas</Link>
          <Link to="/update">Actualizar Horario</Link>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="p-4">
              <h1 className="text-2xl mb-4">Tu Horario</h1>
              <Calendar
                localizer={localizer}
                events={schedule}
                startAccessor="start_time"
                endAccessor="end_time"
                style={{ height: 500 }}
              />
            </div>
          }/>
          
          <Route path="/recommended" element={
            <div className="p-4">
              <h1 className="text-2xl mb-4">Actividades Recomendadas</h1>
              <div className="grid grid-cols-3 gap-4">
                {activities.map(activity => (
                  <div key={activity.id} className="bg-white p-4 rounded shadow">
                    <h3 className="font-bold">{activity.name}</h3>
                    <p>Duración: {activity.duration} mins</p>
                    <p>Prioridad: {activity.priority}/5</p>
                  </div>
                ))}
              </div>
            </div>
          }/>
          
          <Route path="/update" element={
            <div className="p-4">
              <h1 className="text-2xl mb-4">Actualizar Horario</h1>
              <button 
                onClick={fetchSchedule}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Generar Nuevo Horario
              </button>
            </div>
          }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;