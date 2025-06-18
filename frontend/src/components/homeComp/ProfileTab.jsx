import React from 'react';
import { User, LogOut } from 'lucide-react';

function ProfileTab({ currentUser, onLogout }) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-pink-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{currentUser.name}</h1>
          <p className="text-gray-600">{currentUser.college}</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{currentUser.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <p className="text-gray-900">{currentUser.age}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <p className="text-gray-900">{currentUser.bio || 'No bio added yet'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
            <div className="flex flex-wrap gap-2">
              {currentUser.interests.map((interest, idx) => (
                <span key={idx} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default ProfileTab;