import { useState, useEffect } from 'react';

function useSpeedSimulator(enabled) {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setSpeed(0);
      return;
    }

    const interval = setInterval(() => {
      // Simulate realistic speed variations
      const baseSpeed = Math.random() * 60 + 20;
      const variation = Math.sin(Date.now() / 2000) * 15;
      const newSpeed = Math.max(0, Math.min(100, baseSpeed + variation));
      setSpeed(newSpeed);
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  return speed;
}

export default useSpeedSimulator;