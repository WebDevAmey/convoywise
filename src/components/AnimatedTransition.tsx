
import React, { useState, useEffect } from 'react';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({ 
  children, 
  className = '',
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-all duration-500 ease-out ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
