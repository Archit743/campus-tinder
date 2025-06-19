import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
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
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('');
  const [users, setUsers] = useState([]);
  const [noMoreUsers, setNoMoreUsers] = useState(false);
  const [matches, setMatches] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [isFetchingMatches, setIsFetchingMatches] = useState(false);
  const [isFetchingChat, setIsFetchingChat] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { matchId } = useParams();


  // Determine current tab from URL
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.startsWith('/home/chat')) return 'chat';
    if (path === '/home/matches') return 'matches';
    if (path === '/home/profile') return 'profile';
    return 'swipe'; // Default to swipe for /home or /home/swipe
  };

  const currentTab = getCurrentTab();

  // Reset currentCardIndex when switching to swipe tab
  useEffect(() => {
    if (currentTab === 'swipe') {
      setCurrentCardIndex(0);
      setNoMoreUsers(false);
    }
  }, [currentTab]);

  // Restore activeChat for chat tab
  useEffect(() => {
    if (currentTab === 'chat' && matchId) {
      setIsFetchingChat(true);
      const fetchMatch = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:3000/api/matches', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok) {
            const match = data.matches.find(m => m.id === matchId);
            if (match) {
              setActiveChat(match);
            } else {
              navigate('/home/matches', { replace: true }); // Redirect if match not found
            }
          } else {
            console.error(data.message);
            navigate('/home/matches', { replace: true });
          }
        } catch (error) {
          console.error('Error fetching match:', error);
          navigate('/home/matches', { replace: true });
        } finally {
          setIsFetchingChat(false);
        }
      };
      fetchMatch();
    } else {
      setActiveChat(null);
      setIsFetchingChat(false);
    }
  }, [currentTab, matchId, navigate]);

// Fetch users for swiping
  useEffect(() => {
    const fetchUsers = async () => {
      setIsFetchingUsers(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          // Map _id to id for compatibility
          const mappedUsers = data.users.map(user => ({
            id: user._id,
            name: user.name,
            college: user.college,
            age: user.age,
            bio: user.bio,
            interests: user.interests,
            image: user.image,
          }));
          setUsers(mappedUsers);
          setNoMoreUsers(false);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsFetchingUsers(false);
      }
    };
    if (currentTab === 'swipe') {
      fetchUsers();
    }
  }, [currentTab]);

  // Fetch matches
  useEffect(() => {
    const fetchMatches = async () => {
    setIsFetchingMatches(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/matches', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          // Ensure matches have fallback values
          const formattedMatches = data.matches.map(match => ({
            id: match.id,
            name: match.name,
            image: match.image || '',
            lastMessage: match.lastMessage || '',
            timestamp: match.timestamp || 'Just now',
          }));
          setMatches(formattedMatches);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setIsFetchingMatches(false);
      }
    };
    if (currentTab === 'matches' || currentTab === 'chat') {
      fetchMatches();
    }
  }, [currentTab]);

  // Fetch messages for active chat
  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3000/api/messages/${activeChat.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok) {
            // Map sender to 'current' for currentUser.id
            const formattedMessages = data.messages.map(msg => ({
              ...msg,
              sender: msg.sender === currentUser.id ? 'current' : msg.sender,
            }));
            setChatMessages(prev => ({
              ...prev,
              [activeChat.id]: formattedMessages,
            }));
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [activeChat, currentUser.id]);

  const handleSwipe = async (direction) => {
    if (isAnimating || !users[currentCardIndex]) return;
    setIsAnimating(true);
    setAnimationDirection(direction);

    if (direction === 'right') {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/matches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: users[currentCardIndex].id }),
        });
        const data = await response.json();
        if (response.ok && data.isMatch) {
          const newMatch = {
            id: users[currentCardIndex].id,
            name: users[currentCardIndex].name,
            image: users[currentCardIndex].image || '',
            lastMessage: 'You matched!',
            timestamp: 'Just now',
          };
          setMatches(prev => [...prev, newMatch]);
          alert(`It's a match with ${users[currentCardIndex].name}! 🎉`);
        }
      } catch (error) {
        console.error('Error creating match:', error);
      }
    }

    setTimeout(() => {
      if (currentCardIndex + 1 >= users.length) {
        setNoMoreUsers(true);
      } else {
        setCurrentCardIndex((prev) => prev + 1);
      }
      setIsAnimating(false);
      setAnimationDirection('');
    }, 300);
  };

  const handleChatSelect = (match) => {
    navigate(`/home/chat/${match.id}`);
  };

  const handleBackToMatches = () => {
    navigate('/home/matches');
  };

  const handleSendMessage = async (messageContent, tempId) => {
    if (!messageContent.trim() || !activeChat) return;

    // const tempId = `temp-${Date.now()}`;
    // const optimisticMessage = {
    //   id: tempId,
    //   sender: 'current',
    //   receiver: activeChat.id,
    //   content: messageContent,
    //   timestamp: new Date(),
    // };

    // // Optimistically update messages
    // setChatMessages((prev) => ({
    //   ...prev,
    //   [activeChat.id]: [...(prev[activeChat.id] || []), optimisticMessage],
    // }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: activeChat.id,
          content: messageContent,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Replace optimistic message with server message
        const serverMessage = {
          id: data.message._id,
          sender: 'current',
          receiver: activeChat.id,
          content: messageContent,
          timestamp: new Date(data.message.timestamp),
        };
        setChatMessages((prev) => ({
          ...prev,
          [activeChat.id]: [
            ...(prev[activeChat.id] || []).filter((m) => m.id !== tempId),
            serverMessage,
          ],
        }));
        // Update match's lastMessage and timestamp
        setMatches((prev) =>
          prev.map((m) =>
            m.id === activeChat.id
              ? { ...m, lastMessage: messageContent, timestamp: 'Just now' }
              : m
          )
        );
      } else {
        console.error('Error sending message:', data.message);
        // Remove optimistic message on error
        setChatMessages((prev) => ({
          ...prev,
          [activeChat.id]: (prev[activeChat.id] || []).filter(
            (m) => m.id !== tempId
          ),
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setChatMessages((prev) => ({
        ...prev,
        [activeChat.id]: (prev[activeChat.id] || []).filter(
          (m) => m.id !== tempId
        ),
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  if (currentTab === 'chat' && isFetchingChat) {
    return <div className="min-h-screen flex items-center justify-center">Loading chat...</div>;
  }

  if (currentTab === 'chat' && !activeChat) {
    return <div className="min-h-screen flex items-center justify-center">Loading chat...</div>;
  }

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
          <>
            {isFetchingUsers ? (
              <div className="min-h-screen flex items-center justify-center">
                Loading users...
              </div>
            ) : noMoreUsers ? (
              <div className="min-h-screen flex items-center justify-center text-center p-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    No more users to swipe
                  </h2>
                  <p className="text-gray-600">
                    Check back later for new profiles!
                  </p>
                </div>
              </div>
            ) : (
              <SwipeTab
                currentUser={currentUser}
                currentCardIndex={currentCardIndex}
                users={users}
                isAnimating={isAnimating}
                animationDirection={animationDirection}
                onSwipe={handleSwipe}
              />
            )}
          </>
        )}

        {currentTab === 'matches' && (
          isFetchingMatches ? (
            <div className="min-h-screen flex items-center justify-center">Loading matches...</div>
          ) : (
            <MatchesTab
              matches={matches}
              onChatSelect={handleChatSelect}
            />
          )
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
        onTabChange={(tab) => navigate(`/home/${tab === 'swipe' ? '' : tab}`)}
        matchesCount={matches.length}
      />
    </div>
  );
}

export default Home;