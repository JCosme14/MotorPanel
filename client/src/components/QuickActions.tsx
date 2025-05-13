import React from 'react';
import { useDashboard } from '@/lib/dashboardContext';

const QuickActions: React.FC = () => {
  const { 
    toggleHighBeam, 
    resetTrip, 
    showSettings, 
    showHelp,
    toggleDrivingMode,
    motorcycleData
  } = useDashboard();

  // Determine the mode icon and color
  const getModeIcon = () => {
    switch(motorcycleData.drivingMode) {
      case "Eco": return "eco";
      case "Sport": return "speed";
      default: return "tune";
    }
  };

  const getModeColor = () => {
    switch(motorcycleData.drivingMode) {
      case "Eco": return "text-success";
      case "Sport": return "text-warning";
      default: return "text-primary";
    }
  };

  return (
    <div className="flex justify-between">
      <button 
        className="touch-target flex flex-col items-center justify-center bg-lightSurface dark:bg-darkSurface rounded-xl p-4 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={toggleHighBeam}
      >
        <span className={`material-icons text-2xl mb-1 ${motorcycleData.highBeamOn ? 'text-warning' : 'text-primary'}`}>
          {motorcycleData.highBeamOn ? 'flashlight_on' : 'highlight'}
        </span>
        <span className="text-xs">High Beam</span>
      </button>
      
      <button 
        className="touch-target flex flex-col items-center justify-center bg-lightSurface dark:bg-darkSurface rounded-xl p-4 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={toggleDrivingMode}
      >
        <span className={`material-icons text-2xl mb-1 ${getModeColor()}`}>
          {getModeIcon()}
        </span>
        <span className="text-xs">Mode: {motorcycleData.drivingMode}</span>
      </button>
      
      <button 
        className="touch-target flex flex-col items-center justify-center bg-lightSurface dark:bg-darkSurface rounded-xl p-4 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={resetTrip}
      >
        <span className="material-icons text-2xl mb-1 text-primary">restart_alt</span>
        <span className="text-xs">Reset Trip</span>
      </button>
      
      <button 
        className="touch-target flex flex-col items-center justify-center bg-lightSurface dark:bg-darkSurface rounded-xl p-4 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={showSettings}
      >
        <span className="material-icons text-2xl mb-1 text-primary">settings</span>
        <span className="text-xs">Settings</span>
      </button>
    </div>
  );
};

export default QuickActions;
