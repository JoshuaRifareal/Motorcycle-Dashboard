import React, { useState, useEffect } from 'react';
import { Settings, Satellite, RotateCcw, Coffee } from 'lucide-react';
import Speedometer from './components/Speedometer';
import SetupPanel from './components/SetupPanel';
import './App.css';

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const [fuel, setFuel] = useState(100);
  const [startOdometer, setStartOdometer] = useState(0);
  const [efficiency, setEfficiency] = useState(48);
  const [showStartupAnim, setShowStartupAnim] = useState(true);
  const [useSimulation, setUseSimulation] = useState(false);
  const [forceLandscape, setForceLandscape] = useState(false);
  const [keepScreenOn, setKeepScreenOn] = useState(false);

  // WakeLock for screen always on
  useEffect(() => {
    let wakeLock = null;
    
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && keepScreenOn) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.warn('WakeLock error:', err);
      }
    };

    if (keepScreenOn) {
      requestWakeLock();
    }

    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [keepScreenOn]);

  // Force landscape
  useEffect(() => {
    const lockOrientation = async () => {
      try {
        if ('screen' in window && 'orientation' in window.screen && forceLandscape) {
          await window.screen.orientation.lock('landscape');
        }
      } catch (err) {
        console.warn('Orientation lock error:', err);
      }
    };

    if (forceLandscape) {
      lockOrientation();
    }

    return () => {
      if ('screen' in window && 'orientation' in window.screen && forceLandscape) {
        try {
          window.screen.orientation.unlock();
        } catch (err) {
          // Ignore
        }
      }
    };
  }, [forceLandscape]);

  const handleStart = (settings) => {
    setFuel(settings.fuel);
    setStartOdometer(settings.odometer);
    setEfficiency(settings.efficiency);
    setUseSimulation(settings.useSimulation || false);
    setForceLandscape(settings.forceLandscape || false);
    setKeepScreenOn(settings.keepScreenOn || false);
    setIsRunning(true);
    setShowSetup(false);
    setShowStartupAnim(true);
  };

  const handleSettings = () => {
    setShowSetup(true);
    setShowStartupAnim(false);
  };

  const handleCloseSetup = () => {
    if (isRunning) {
      setShowSetup(false);
    }
  };

  const toggleSimulation = () => {
    setUseSimulation(!useSimulation);
  };

  const toggleLandscape = () => {
    setForceLandscape(!forceLandscape);
  };

  const toggleScreenOn = () => {
    setKeepScreenOn(!keepScreenOn);
  };

  return (
    <div className="app">
      {/* Top bar with glowing toggles */}
      {isRunning && (
        <div className="top-bar">
          <div className="toggle-group">
            <button 
              className={`toggle-icon ${useSimulation ? 'active' : ''}`}
              onClick={toggleSimulation}
              title={useSimulation ? 'Simulation Mode' : 'GPS Mode'}
            >
              <Satellite size={24} />
              <span className="led-indicator"></span>
            </button>
            <button 
              className={`toggle-icon ${forceLandscape ? 'active' : ''}`}
              onClick={toggleLandscape}
              title={forceLandscape ? 'Landscape Locked' : 'Auto Rotate'}
            >
              <RotateCcw size={24} />
              <span className="led-indicator"></span>
            </button>
            <button 
              className={`toggle-icon ${keepScreenOn ? 'active' : ''}`}
              onClick={toggleScreenOn}
              title={keepScreenOn ? 'Screen Always On' : 'Screen Auto Sleep'}
            >
              <Coffee size={24} />
              <span className="led-indicator"></span>
            </button>
          </div>
          <button className="settings-btn" onClick={handleSettings}>
            <Settings size={24} />
          </button>
        </div>
      )}
      
      <Speedometer
        isRunning={isRunning}
        fuel={fuel}
        startOdometer={startOdometer}
        efficiency={efficiency}
        showStartupAnim={showStartupAnim}
        useSimulation={useSimulation}
      />
      
      {!isRunning && !showSetup && (
        <button className="skip-btn" onClick={() => handleStart({ fuel: 100, odometer: 0, efficiency: 48, useSimulation: false, forceLandscape: false, keepScreenOn: false })}>
          Skip
        </button>
      )}
      
      {showSetup && (
        <SetupPanel 
          onStart={handleStart}
          onClose={handleCloseSetup}
          initialValues={{ 
            fuel, 
            odometer: startOdometer, 
            efficiency,
            useSimulation,
            forceLandscape,
            keepScreenOn
          }}
        />
      )}
    </div>
  );
}

export default App;