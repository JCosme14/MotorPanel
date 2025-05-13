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
      case "Eco": return "text-success";
      case "Sport": return "text-warning";
      default: return "text-primary";
    }
  };

  return (
    <div className="flex justify-between gap-2 mt-2">
      <button 
        className="flex-1 flex flex-col items-center justify-center bg-lightSurface dark:bg-darkSurface rounded-xl p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={toggleHighBeam}
      >
        <span className={`material-icons text-xl ${motorcycleData.highBeamOn ? 'text-warning' : 'text-primary'}`}>
          {motorcycleData.highBeamOn ? 'flashlight_on' : 'highlight'}
        </span>
        <span className="text-xs mt-1">Luz Alta</span>
      </button>
      
      <button 
        className="flex-1 flex flex-col items-center justify-center bg-lightSurface dark:bg-darkSurface rounded-xl p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={toggleDrivingMode}
      >
        <span className={`material-icons text-xl ${getModeColor()}`}>
          {getModeIcon()}
        </span>
        <span className="text-xs mt-1">Modo: {motorcycleData.drivingMode}</span>
      </button>
      
      <button 
        className="flex-1 flex flex-col items-center justify-center bg-lightSurface dark:bg-darkSurface rounded-xl p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={resetTrip}
      >
        <span className="material-icons text-xl text-primary">restart_alt</span>
        <span className="text-xs mt-1">Zerar Viagem</span>
      </button>
      
      <button 
        className="flex-1 flex flex-col items-center justify-center bg-lightSurface dark:bg-darkSurface rounded-xl p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={showSettings}
      >
        <span className="material-icons text-xl text-primary">settings</span>
        <span className="text-xs mt-1">Configurações</span>
      </button>
    </div>
  );
};

export default QuickActions;
