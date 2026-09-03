import React, { useState } from 'react';
import { Settings } from 'lucide-react';
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

  const handleStart = (settings) => {
    setFuel(settings.fuel);
    setStartOdometer(settings.odometer);
    setEfficiency(settings.efficiency);
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

  return (
    <div className="app">
      <Speedometer
        isRunning={isRunning}
        fuel={fuel}
        startOdometer={startOdometer}
        efficiency={efficiency}
        showStartupAnim={showStartupAnim}
      />
      
      {isRunning && (
        <button className="settings-btn" onClick={handleSettings}>
          <Settings size={20} />
        </button>
      )}
      
      {!isRunning && !showSetup && (
        <button className="skip-btn" onClick={() => handleStart({ fuel: 100, odometer: 0, efficiency: 48 })}>
          Skip
        </button>
      )}
      
      {showSetup && (
        <SetupPanel 
          onStart={handleStart}
          onClose={handleCloseSetup}
          initialValues={{ fuel, odometer: startOdometer, efficiency }}
        />
      )}
    </div>
  );
}

export default App;