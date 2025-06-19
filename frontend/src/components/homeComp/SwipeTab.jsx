import React from 'react';
import SwipeCard from './SwipeCard';

function SwipeTab({ 
  currentUser, 
  currentCardIndex, 
  users, 
  isAnimating, 
  animationDirection, 
  onSwipe 
}) {
  const currentCard = users.length > 0 && currentCardIndex < users.length ? users[currentCardIndex] : null;

  return (
    <div className="h-auto bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <SwipeCard
          user={currentCard}
          isAnimating={isAnimating}
          animationDirection={animationDirection}
          onSwipe={onSwipe}
        />
      </div>
    </div>
  );
}

export default SwipeTab;