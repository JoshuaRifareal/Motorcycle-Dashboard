import { useState, useEffect, useRef } from 'react';

export const useAnimation = (targetSpeed, settings) => {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const animationRef = useRef(null);
  const previousTargetRef = useRef(0);

  useEffect(() => {
    const animateSpeed = () => {
      const diff = targetSpeed - currentSpeed;
      
      // If difference is very small, snap to target
      if (Math.abs(diff) < 0.01) {
        setCurrentSpeed(targetSpeed);
        return;
      }

      // Smooth easing
      const step = diff * 0.08;
      setCurrentSpeed(prev => {
        const newSpeed = prev + step;
        return Math.max(0, Math.min(newSpeed, 100));
      });

      animationRef.current = requestAnimationFrame(animateSpeed);
    };

    // Cancel previous animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Start new animation
    animationRef.current = requestAnimationFrame(animateSpeed);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetSpeed, currentSpeed]);

  // Reset speed when odometer is reset
  useEffect(() => {
    if (settings.startingOdometer === 0) {
      setCurrentSpeed(0);
    }
  }, [settings.startingOdometer]);

  return currentSpeed;
};