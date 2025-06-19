import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/HomePage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user session on page load
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok) {
            // Map _id to id for consistency with frontend
            setCurrentUser({
              id: data.user._id,
              name: data.user.name,
              email: data.user.email,
              college: data.user.college,
              age: data.user.age,
              bio: data.user.bio,
              interests: data.user.interests,
              image: data.user.image,
            });
          } else {
            localStorage.removeItem('token'); // Clear invalid token
          }
        } catch (error) {
          console.error('Error restoring session:', error);
          localStorage.removeItem('token'); // Clear token on error
        }
      }
      setIsLoading(false);
    };
    restoreSession();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home">
          <Route
            index
            element={
              currentUser ? (
                <Home
                  currentUser={currentUser}
                  onLogout={() => {
                    localStorage.removeItem('token');
                    setCurrentUser(null);
                  }}
                />
              ) : (
                <Login onLogin={setCurrentUser} />
              )
            }
          />
          <Route
            path="swipe"
            element={
              currentUser ? (
                <Home
                  currentUser={currentUser}
                  onLogout={() => {
                    localStorage.removeItem('token');
                    setCurrentUser(null);
                  }}
                />
              ) : (
                <Login onLogin={setCurrentUser} />
              )
            }
          />
          <Route
            path="matches"
            element={
              currentUser ? (
                <Home
                  currentUser={currentUser}
                  onLogout={() => {
                    localStorage.removeItem('token');
                    setCurrentUser(null);
                  }}
                />
              ) : (
                <Login onLogin={setCurrentUser} />
              )
            }
          />
          <Route
            path="profile"
            element={
              currentUser ? (
                <Home
                  currentUser={currentUser}
                  onLogout={() => {
                    localStorage.removeItem('token');
                    setCurrentUser(null);
                  }}
                />
              ) : (
                <Login onLogin={setCurrentUser} />
              )
            }
          />
          <Route
            path="chat/:matchId"
            element={
              currentUser ? (
                <Home
                  currentUser={currentUser}
                  onLogout={() => {
                    localStorage.removeItem('token');
                    setCurrentUser(null);
                  }}
                />
              ) : (
                <Login onLogin={setCurrentUser} />
              )
            }
          />
        </Route>
        <Route path="/" element={<Login onLogin={setCurrentUser} />} />
      </Routes>
    </Router>
  );
}

export default App;