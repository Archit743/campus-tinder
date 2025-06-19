import React from 'react';
import { MessageCircle } from 'lucide-react';

function MatchesTab({ matches, onChatSelect }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Chats</h1>
      {matches.length > 0 ? (
        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.id}
              onClick={() => onChatSelect(match)}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={match.image || null}
                  alt={match.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{match.name}</h3>
                  <p className="text-gray-600 text-sm">{match.lastMessage}</p>
                  <p className="text-gray-400 text-xs">{match.timestamp}</p>
                </div>
                <MessageCircle className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No chats yet</h2>
          <p className="text-gray-600">Keep swiping to start a conversation!</p>
        </div>
      )}
    </div>
  );
}

export default MatchesTab;