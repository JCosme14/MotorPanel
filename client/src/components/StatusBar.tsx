import React, { useEffect, useState } from 'react';
import { useDashboard } from '@/lib/dashboardContext';

const StatusBar: React.FC = () => {
  const { 
    systemStatus, 
    motorcycleData, 
    isDarkMode, 
    toggleDarkMode,
    userSettings
  } = useDashboard();
  
  // Format temperature based on user settings
  const formatTemperature = (tempInC: number): string => {
    if (userSettings.temperatureUnit === 'fahrenheit') {
      const tempInF = (tempInC * 9/5) + 32;
      return `${Math.round(tempInF)}°F`;
    }
    return `${Math.round(tempInC)}°C`;
  };

  return (
    <div className="flex justify-between items-center mb-4 px-2 py-2 bg-lightSurface dark:bg-darkSurface rounded-lg shadow-sm">
      <div className="flex items-center space-x-2">
        {/* GPS icon */}
        <span className={`material-icons text-lg ${systemStatus.gpsConnected ? 'text-success' : 'text-warning'}`}>
          {systemStatus.gpsConnected ? 'gps_fixed' : 'gps_not_fixed'}
        </span>
        
        {/* Current time */}
        <span className="font-mono text-sm">{systemStatus.currentTime}</span>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Temperature reading */}
        <div className="flex items-center">
          <span className="material-icons mr-1 text-sm text-gray-600 dark:text-gray-300">thermostat</span>
          <span className="font-mono text-sm">{formatTemperature(motorcycleData.temperature)}</span>
        </div>
        
        {/* Day/Night toggle */}
        <button 
          onClick={toggleDarkMode}
          className="flex items-center justify-center rounded-full p-2 touch-target bg-gray-200 dark:bg-gray-700"
          aria-label={isDarkMode ? "Switch to day mode" : "Switch to night mode"}
        >
          {isDarkMode ? (
            <span className="material-icons text-gray-100">nightlight</span>
          ) : (
            <span className="material-icons text-gray-800">wb_sunny</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default StatusBar;
