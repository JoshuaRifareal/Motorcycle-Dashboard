import React, { useState } from 'react';
import { Fuel, Gauge, Zap, X } from 'lucide-react';
import './SetupPanel.css';

function SetupPanel({ onStart, onClose, initialValues }) {
  const [fuel, setFuel] = useState(initialValues?.fuel || 100);
  const [odometer, setOdometer] = useState(initialValues?.odometer || 0);
  const [efficiency, setEfficiency] = useState(initialValues?.efficiency || 48);

  const handleStart = () => {
    onStart({
      fuel: parseFloat(fuel),
      odometer: parseFloat(odometer),
      efficiency: parseFloat(efficiency),
      useSimulation: initialValues?.useSimulation || false,
      forceLandscape: initialValues?.forceLandscape || false,
      keepScreenOn: initialValues?.keepScreenOn || false
    });
  };

  return (
    <div className="setup-overlay">
      <div className="setup-panel">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h1 className="setup-title">Navi Dash</h1>
        <p className="setup-subtitle">Configure your journey</p>

        <div className="sliders-container">
          <div className="slider-group">
            <div className="slider-header">
              <Fuel size={20} />
              <span>Fuel Level</span>
              <span className="slider-value-display">{Math.round(fuel)}%</span>
            </div>
            <div className="slider-track">
              <input
                type="range"
                min="0"
                max="100"
                value={fuel}
                onChange={(e) => setFuel(parseFloat(e.target.value))}
                className="slider ios-style"
                style={{
                  background: `linear-gradient(to right, 
                    ${fuel < 30 ? '#ff1744' : fuel < 60 ? '#ff9100' : '#76ff03'} 0%, 
                    ${fuel < 30 ? '#ff1744' : fuel < 60 ? '#ff9100' : '#76ff03'} ${fuel}%, 
                    rgba(255,255,255,0.1) ${fuel}%, 
                    rgba(255,255,255,0.1) 100%)`
                }}
              />
            </div>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <Gauge size={20} />
              <span>Start Odometer</span>
              <span className="slider-value-display">{Math.round(odometer).toLocaleString()} km</span>
            </div>
            <div className="slider-track">
              <input
                type="range"
                min="0"
                max="100000"
                step="100"
                value={odometer}
                onChange={(e) => setOdometer(parseFloat(e.target.value))}
                className="slider ios-style"
                style={{
                  background: `linear-gradient(to right, 
                    #6a5aff 0%, 
                    #6a5aff ${(odometer / 100000) * 100}%, 
                    rgba(255,255,255,0.1) ${(odometer / 100000) * 100}%, 
                    rgba(255,255,255,0.1) 100%)`
                }}
              />
            </div>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <Zap size={20} />
              <span>Fuel Efficiency</span>
              <span className="slider-value-display">{efficiency.toFixed(1)} km/L</span>
            </div>
            <div className="slider-track">
              <input
                type="range"
                min="10"
                max="80"
                step="0.5"
                value={efficiency}
                onChange={(e) => setEfficiency(parseFloat(e.target.value))}
                className="slider ios-style"
                style={{
                  background: `linear-gradient(to right, 
                    #6a5aff 0%, 
                    #6a5aff ${((efficiency - 10) / 70) * 100}%, 
                    rgba(255,255,255,0.1) ${((efficiency - 10) / 70) * 100}%, 
                    rgba(255,255,255,0.1) 100%)`
                }}
              />
            </div>
          </div>
        </div>

        <button className="start-btn" onClick={handleStart}>
          Start Journey
        </button>
      </div>
    </div>
  );
}

export default SetupPanel;