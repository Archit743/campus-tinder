import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/HomePage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
        <Route path="/register" element={<Register onRegister={setCurrentUser} />} />
        <Route path="/home" element={currentUser ? <Home currentUser={currentUser} onLogout={() => setCurrentUser(null)} /> : <Login onLogin={setCurrentUser} />} />
        <Route path="/" element={<Login onLogin={setCurrentUser} />} />
      </Routes>
    </Router>
  );
}

export default App;