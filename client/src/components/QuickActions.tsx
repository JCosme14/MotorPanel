import React from 'react';
import { useDashboard } from '@/lib/dashboardContext';

const QuickActions: React.FC = () => {
  const { 
    toggleHighBeam, 
    resetTrip, 
    showSettings, 
    showHelp 
  } = useDashboard();

  return (
    <div className="flex justify-between">
      <button 
        className="touch-target flex flex-col items-center justify-center bg-lightSurface dark:bg-darkSurface rounded-xl p-4 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={toggleHighBeam}
      >
        <span className="material-icons text-2xl mb-1 text-primary">highlight</span>
        <span className="text-xs">High Beam</span>
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
      
      <button 
        className="touch-target flex flex-col items-center justify-center bg-lightSurface dark:bg-darkSurface rounded-xl p-4 shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={showHelp}
      >
        <span className="material-icons text-2xl mb-1 text-primary">help_outline</span>
        <span className="text-xs">Help</span>
      </button>
    </div>
  );
};

export default QuickActions;
