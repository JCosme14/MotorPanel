import React from 'react';
import { useDashboard } from '@/lib/dashboardContext';

const QuickActions: React.FC = () => {
  const { 
    toggleHighBeam, 
    resetTrip, 
    showSettings, 
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
      case "Eco": return "text-green-400 bg-green-500/20";
      case "Sport": return "text-amber-400 bg-amber-500/20";
      default: return "text-blue-400 bg-blue-500/20";
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2 mt-1">
      <button 
        className="bg-gray-900 rounded-md py-2 hover:bg-gray-800 transition-colors"
        onClick={toggleHighBeam}
      >
        <div className="flex flex-col items-center">
          <span className={`material-icons ${motorcycleData.highBeamOn ? 'text-amber-400' : 'text-blue-400'}`}>
            {motorcycleData.highBeamOn ? 'flashlight_on' : 'highlight'}
          </span>
          <span className="text-xs mt-1 text-gray-300">Luz Alta</span>
        </div>
      </button>
      
      <button 
        className="bg-gray-900 rounded-md py-2 hover:bg-gray-800 transition-colors"
        onClick={toggleDrivingMode}
      >
        <div className="flex flex-col items-center">
          <span className={`material-icons ${getModeColor()}`}>
            {getModeIcon()}
          </span>
          <span className="text-xs mt-1 text-gray-300">Modo</span>
        </div>
      </button>
      
      <button 
        className="bg-gray-900 rounded-md py-2 hover:bg-gray-800 transition-colors"
        onClick={resetTrip}
      >
        <div className="flex flex-col items-center">
          <span className="material-icons text-blue-400">restart_alt</span>
          <span className="text-xs mt-1 text-gray-300">Zerar</span>
        </div>
      </button>
    </div>
  );
};

export default QuickActions;
