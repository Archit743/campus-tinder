import React from 'react';
import { Heart, X } from 'lucide-react';

function SwipeCard({ 
  user, 
  isAnimating, 
  animationDirection, 
  onSwipe 
}) {
  if (!user) {
    return (
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No more profiles!</h2>
        <p className="text-gray-600">Check back later for new matches</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${
        isAnimating ? (animationDirection === 'left' ? '-translate-x-full rotate-15' : 'translate-x-full rotate-15') : ''
      }`}>
        <div className="relative">
          <img
            src={user.image || 'https://via.placeholder.com/400x500?text=No+Image'}
            alt={user.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
            <h2 className="text-2xl font-bold">{user.name}, {user.age}</h2>
            <p className="text-sm opacity-90">{user.college}</p>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-4">{user.bio}</p>
          <div className="flex flex-wrap gap-2">
            {user.interests && user.interests.length > 0 ? (
              user.interests.map((interest, idx) => (
                <span key={idx} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-gray-600 text-sm">No interests listed</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-center space-x-6 mt-6">
        <button
          onClick={() => onSwipe('left')}
          className="bg-white hover:bg-gray-50 shadow-lg rounded-full p-4 transition-all hover:scale-110"
        >
          <X className="w-8 h-8 text-red-500" />
        </button>
        <button
          onClick={() => onSwipe('right')}
          className="bg-white hover:bg-gray-50 shadow-lg rounded-full p-4 transition-all hover:scale-110"
        >
          <Heart className="w-8 h-8 text-pink-500" />
        </button>
      </div>
    </div>
  );
}

export default SwipeCard;