import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const API_URL = 'https://campus-tinder.onrender.com/api'; // Base URL for API requests


  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      setMessage('Email and password are required');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        localStorage.setItem('token', data.token);
        const userResponse = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        const userData = await userResponse.json();
        if (userResponse.ok) {
          onLogin(userData.user);
          navigate('/home');
        } else {
          setMessage(userData.message);
        }
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">💖</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">UniMatch</h1>
          <p className="text-gray-600">Find your perfect match on campus</p>
        </div>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Sign In
          </button>
          {message && <p className="text-center text-red-500">{message}</p>}
        </div>
        
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/register')}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;