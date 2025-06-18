import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register({ onRegister }) {
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    age: '',
    bio: '',
    interests: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.college || !registerForm.age) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
          college: registerForm.college,
          age: registerForm.age,
          bio: registerForm.bio,
          interests: registerForm.interests
        }),
      });
      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        setTimeout(() => navigate('/login'), 1000);
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">💖</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Join College Connect</h1>
          <p className="text-gray-600">Create your profile</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Left Column */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={registerForm.name}
              onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="College/University"
              value={registerForm.college}
              onChange={(e) => setRegisterForm(prev => ({ ...prev, college: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Age"
              value={registerForm.age}
              onChange={(e) => setRegisterForm(prev => ({ ...prev, age: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <textarea
              placeholder="Bio (optional)"
              value={registerForm.bio}
              onChange={(e) => setRegisterForm(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent h-20 resize-none"
            />
            <input
              type="text"
              placeholder="Interests (comma separated)"
              value={registerForm.interests}
              onChange={(e) => setRegisterForm(prev => ({ ...prev, interests: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            {/* Empty div to maintain grid alignment */}
            <div></div>
          </div>
        </div>

        {/* Button and message span full width */}
        <div className="mt-6 space-y-4">
          <button
            onClick={handleRegister}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Create Account
          </button>
          {message && <p className="text-center text-red-500">{message}</p>}
        </div>
        
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/login')}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;