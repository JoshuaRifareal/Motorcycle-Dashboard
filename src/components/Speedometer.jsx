import React, { useRef, useEffect, useState } from 'react';
import SpeedometerCanvas from './SpeedometerCanvas';
import useGPS from '../hooks/useGPS';
import useSpeedSimulator from '../hooks/useSpeedSimulator';

function Speedometer({ isRunning, fuel: initialFuel, startOdometer, efficiency, showStartupAnim, useSimulation }) {
  const [speed, setSpeed] = useState(0);
  const [targetSpeed, setTargetSpeed] = useState(0);
  const [currentFuel, setCurrentFuel] = useState(initialFuel);
  const [odometer, setOdometer] = useState(startOdometer);
  const [totalDistance, setTotalDistance] = useState(0);
  const [fuelUsed, setFuelUsed] = useState(0);
  const [gpsReady, setGpsReady] = useState(false);
  const [startupComplete, setStartupComplete] = useState(false);

  const lastUpdateRef = useRef(Date.now());
  const startupAnimRef = useRef(null);
  
  // Always use GPS, but simulation can override
  const gpsSpeed = useGPS(isRunning && !useSimulation);
  const simulatedSpeed = useSpeedSimulator(isRunning && useSimulation);

  // Reset state when running starts
  useEffect(() => {
    if (isRunning) {
      setCurrentFuel(initialFuel);
      setOdometer(startOdometer);
      setTotalDistance(0);
      setFuelUsed(0);
      setGpsReady(false);
      setStartupComplete(false);
      setSpeed(0);
      setTargetSpeed(0);
    }
  }, [isRunning, initialFuel, startOdometer]);

  useEffect(() => {
    if (showStartupAnim && isRunning) {
      runStartupAnimation();
    }
  }, [showStartupAnim, isRunning]);

  useEffect(() => {
    if (!isRunning || !startupComplete) return;

    // Use GPS if available and not in simulation mode
    const currentSpeed = useSimulation ? simulatedSpeed : gpsSpeed;
    setTargetSpeed(Math.min(currentSpeed, 100));

    const now = Date.now();
    const dt = (now - lastUpdateRef.current) / 3600000;
    
    if (targetSpeed > 0.5 && (gpsReady || useSimulation)) {
      const dist = targetSpeed * dt;
      setTotalDistance(prev => prev + dist);
      const newOdometer = startOdometer + totalDistance + dist;
      setOdometer(newOdometer);
      
      const newFuelUsed = (totalDistance + dist) / efficiency;
      setFuelUsed(newFuelUsed);
      const remaining = Math.max(0, initialFuel - newFuelUsed);
      const fuelPct = Math.min(100, (remaining / initialFuel) * 100);
      setCurrentFuel(Math.max(0, fuelPct));
    }
    
    lastUpdateRef.current = now;
  }, [isRunning, gpsSpeed, simulatedSpeed, gpsReady, targetSpeed, startOdometer, totalDistance, efficiency, initialFuel, startupComplete, useSimulation]);

  useEffect(() => {
    if (!isRunning || !startupComplete) return;
    
    let animFrame;
    const smoothSpeed = () => {
      setSpeed(prev => {
        const diff = targetSpeed - prev;
        if (Math.abs(diff) < 0.2) return targetSpeed;
        return prev + diff * 0.08;
      });
      animFrame = requestAnimationFrame(smoothSpeed);
    };
    smoothSpeed();
    
    return () => cancelAnimationFrame(animFrame);
  }, [isRunning, targetSpeed, startupComplete]);

  useEffect(() => {
    if (gpsSpeed > 0.5) {
      setGpsReady(true);
    }
  }, [gpsSpeed]);

  const runStartupAnimation = () => {
    const duration = 2000;
    const startTime = Date.now();

    const animateUp = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      setSpeed(ease * 100);

      if (progress < 1) {
        startupAnimRef.current = requestAnimationFrame(animateUp);
      } else {
        animateDown();
      }
    };

    const animateDown = () => {
      const downDuration = 1200;
      const downStart = Date.now();

      const step = () => {
        const elapsed = Date.now() - downStart;
        const progress = Math.min(elapsed / downDuration, 1);
        const ease = 1 - progress;
        setSpeed(ease * 100);

        if (progress < 1) {
          startupAnimRef.current = requestAnimationFrame(step);
        } else {
          setSpeed(0);
          setStartupComplete(true);
        }
      };
      step();
    };

    animateUp();
  };

  return <SpeedometerCanvas speed={speed} fuel={currentFuel} odometer={odometer} isRunning={isRunning && startupComplete} />;
}

export default Speedometer;