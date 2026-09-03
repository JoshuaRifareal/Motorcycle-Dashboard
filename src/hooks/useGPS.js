import { useState, useEffect, useRef } from 'react';

function useGPS(enabled) {
  const [speed, setSpeed] = useState(0);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!enabled || !navigator.geolocation) {
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const speedMS = position.coords.speed;
        if (speedMS !== null && speedMS !== undefined) {
          setSpeed(speedMS * 3.6);
        }
      },
      (error) => {
        console.warn('GPS error:', error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 500,
        timeout: 2000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [enabled]);

  return speed;
}

export default useGPS;