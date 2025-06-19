import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import SwipeTab from '../components/homeComp/SwipeTab';
import MatchesTab from '../components/homeComp/MatchesTab';
import ProfileTab from '../components/homeComp/ProfileTab';
import BottomNavigation from '../components/homeComp/BottomNavigation';
import ChatView from '../components/homeComp/ChatView';

function Home({ currentUser, onLogout, onProfileUpdate }) {
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
            const formattedMessages = data.messages.map(msg => ({
              id: `server-${msg._id || crypto.randomUUID()}`,
              sender: msg.sender === currentUser.id ? 'current' : msg.sender,
              receiver: msg.receiver,
              content: msg.content,
              timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
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

    const optimisticMessage = {
      id: tempId,
      sender: 'current',
      receiver: activeChat.id,
      content: messageContent,
      timestamp: new Date(),
    };

    // Optimistically update messages
    setChatMessages((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), optimisticMessage],
    }));

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
          id: `server-${data.message._id || crypto.randomUUID()}`,
          sender: 'current',
          receiver: activeChat.id,
          content: messageContent,
          timestamp: data.message.timestamp ? new Date(data.message.timestamp) : new Date(),
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
            onProfileUpdate={onProfileUpdate}
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