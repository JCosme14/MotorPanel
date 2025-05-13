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

  // Format current time in Portuguese format
  const formatTime = (): string => {
    return new Date().toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="flex justify-between items-center mb-2 px-2 py-2 bg-lightSurface dark:bg-darkSurface rounded-lg shadow-sm">
      <div className="flex items-center space-x-2">
        {/* GPS icon */}
        <span className={`material-icons text-lg ${systemStatus.gpsConnected ? 'text-success' : 'text-warning'}`}>
          {systemStatus.gpsConnected ? 'gps_fixed' : 'gps_not_fixed'}
        </span>
        
        {/* Current time */}
        <span className="font-mono text-sm">{formatTime()}</span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Temperatura */}
        <div className="flex items-center">
          <span className="material-icons mr-1 text-sm text-gray-600 dark:text-gray-300">thermostat</span>
          <span className="font-mono text-sm">{formatTemperature(motorcycleData.temperature)}</span>
        </div>

        {/* Modo de condução */}
        <div className="flex items-center">
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            motorcycleData.drivingMode === 'Eco' ? 'bg-success/20 text-success' :
            motorcycleData.drivingMode === 'Sport' ? 'bg-warning/20 text-warning' :
            'bg-primary/20 text-primary'
          }`}>
            {motorcycleData.drivingMode}
          </span>
        </div>
        
        {/* Day/Night toggle */}
        <button 
          onClick={toggleDarkMode}
          className="flex items-center justify-center rounded-full p-2 bg-gray-200 dark:bg-gray-700"
          aria-label={isDarkMode ? "Mudar para modo dia" : "Mudar para modo noite"}
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
