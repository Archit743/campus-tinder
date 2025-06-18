import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwipeTab from '../components/homeComp/SwipeTab';
import MatchesTab from '../components/homeComp/MatchesTab';
import ProfileTab from '../components/homeComp/ProfileTab';
import BottomNavigation from '../components/homeComp/BottomNavigation';
import ChatView from '../components/homeComp/ChatView';

// Mock data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Emma Johnson',
    college: 'Stanford University',
    age: 20,
    bio: 'Computer Science major, love hiking and photography',
    interests: ['Photography', 'Hiking', 'Coding'],
    image: 'https://images.unsplash.com/photo-1494790108755-2616c667e3b8?w=400&h=500&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Alex Chen',
    college: 'MIT',
    age: 21,
    bio: 'Engineering student, piano enthusiast, coffee lover',
    interests: ['Music', 'Engineering', 'Coffee'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Sarah Williams',
    college: 'Harvard University',
    age: 19,
    bio: 'Pre-med student, yoga instructor, book lover',
    interests: ['Medicine', 'Yoga', 'Reading'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'Michael Davis',
    college: 'UC Berkeley',
    age: 22,
    bio: 'Business major, basketball player, travel enthusiast',
    interests: ['Basketball', 'Business', 'Travel'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face'
  }
];

const initialMatches = [
  {
    id: '1',
    name: 'Emma Johnson',
    image: 'https://images.unsplash.com/photo-1494790108755-2616c667e3b8?w=400&h=500&fit=crop&crop=face',
    lastMessage: 'Hey! How are you doing?',
    timestamp: '2 hours ago'
  },
  {
    id: '3',
    name: 'Sarah Williams',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face',
    lastMessage: 'Nice to meet you!',
    timestamp: '1 day ago'
  }
];

const initialChatMessages = {
  '1': [
    { id: '1', sender: '1', receiver: 'current', content: 'Hey! How are you doing?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: '2', sender: 'current', receiver: '1', content: 'Hi Emma! I\'m doing great, thanks for asking!', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    { id: '3', sender: '1', receiver: 'current', content: 'That\'s awesome! What\'s your favorite thing about Stanford?', timestamp: new Date(Date.now() - 30 * 60 * 1000) }
  ]
};

function Home({ currentUser, onLogout }) {
  const [currentTab, setCurrentTab] = useState('swipe');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('');
  const [matches, setMatches] = useState(initialMatches);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const navigate = useNavigate();

  const handleSwipe = (direction) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setAnimationDirection(direction);
    
    if (direction === 'right') {
      // Simulate match (50% chance for demo)
      if (Math.random() > 0.5) {
        const currentCard = mockUsers[currentCardIndex];
        setMatches(prev => [...prev, {
          id: currentCard.id,
          name: currentCard.name,
          image: currentCard.image,
          lastMessage: 'You matched!',
          timestamp: 'Just now'
        }]);
        
        // Show match notification
        setTimeout(() => {
          alert(`It's a match with ${currentCard.name}! 🎉`);
        }, 500);
      }
    }

    setTimeout(() => {
      setCurrentCardIndex(prev => (prev + 1) % mockUsers.length);
      setIsAnimating(false);
      setAnimationDirection('');
    }, 300);
  };

  const handleChatSelect = (match) => {
    setActiveChat(match);
    setCurrentTab('chat');
  };

  const handleBackToMatches = () => {
    setCurrentTab('matches');
    setActiveChat(null);
  };

  const handleSendMessage = (messageContent) => {
    if (!activeChat) return;

    const message = {
      id: Date.now().toString(),
      sender: 'current',
      receiver: activeChat.id,
      content: messageContent,
      timestamp: new Date()
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), message]
    }));
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Render chat view separately
  if (currentTab === 'chat' && activeChat) {
    const messages = chatMessages[activeChat.id] || [];
    return (
      <ChatView
        activeChat={activeChat}
        messages={messages}
        onBack={handleBackToMatches}
        onSendMessage={handleSendMessage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="pb-20">
        {currentTab === 'swipe' && (
          <SwipeTab
            currentUser={currentUser}
            currentCardIndex={currentCardIndex}
            users={mockUsers}
            isAnimating={isAnimating}
            animationDirection={animationDirection}
            onSwipe={handleSwipe}
          />
        )}

        {currentTab === 'matches' && (
          <MatchesTab
            matches={matches}
            onChatSelect={handleChatSelect}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileTab
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        matchesCount={matches.length}
      />
    </div>
  );
}

export default Home;