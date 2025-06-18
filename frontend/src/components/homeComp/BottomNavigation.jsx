import React from 'react';
import { Heart, MessageCircle, User } from 'lucide-react';

function BottomNavigation({ currentTab, onTabChange, matchesCount }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around py-2">
        <button
          onClick={() => onTabChange('swipe')}
          className={`flex flex-col items-center py-2 px-4 ${
            currentTab === 'swipe' ? 'text-pink-500' : 'text-gray-400'
          }`}
        >
          <Heart className="w-6 h-6" />
          <span className="text-xs mt-1">Discover</span>
        </button>
        <button
          onClick={() => onTabChange('matches')}
          className={`flex flex-col items-center py-2 px-4 relative ${
            currentTab === 'matches' ? 'text-pink-500' : 'text-gray-400'
          }`}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs mt-1">Matches</span>
          {matchesCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {matchesCount}
            </div>
          )}
        </button>
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center py-2 px-4 ${
            currentTab === 'profile' ? 'text-pink-500' : 'text-gray-400'
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
}

export default BottomNavigation;