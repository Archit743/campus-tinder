import React, { useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react';

function ChatView({ 
  activeChat, 
  messages, 
  onBack, 
  onSendMessage 
}) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    if (typeof timestamp === 'string') return timestamp;
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white shadow-sm p-4 flex items-center space-x-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img
          src={activeChat.image}
          alt={activeChat.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold text-gray-800">{activeChat.name}</h2>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'current' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === 'current'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-800 shadow-sm'
              }`}
            >
              <p>{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'current' ? 'text-pink-100' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatView;