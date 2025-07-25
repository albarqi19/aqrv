import React, { useEffect, useState } from 'react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start fade in animation
    setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Start fade out and complete after 2 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    // Complete transition
    setTimeout(() => {
      onComplete();
    }, 2000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
مرحبا ألف 
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
