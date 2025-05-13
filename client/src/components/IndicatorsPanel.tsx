import React from 'react';
import { useDashboard } from '@/lib/dashboardContext';

const IndicatorsPanel: React.FC = () => {
  const { motorcycleData, userSettings } = useDashboard();

  // Format distance values based on user settings
  const formatDistance = (distanceInKm: number): string => {
    if (userSettings.distanceUnit === 'mi') {
      return `${Math.round(distanceInKm * 0.621371)} mi`;
    }
    return `${Math.round(distanceInKm)} km`;
  };

  return (
    <div className="bg-lightSurface dark:bg-darkSurface rounded-xl p-2 shadow-md mb-2 flex items-center justify-between">
      {/* Left side - distance info */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        <div className="flex flex-col">
          <span className="text-xs text-gray-600 dark:text-gray-400">Total</span>
          <span className="font-mono font-bold">{formatDistance(motorcycleData.odometer)}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-gray-600 dark:text-gray-400">Viagem</span>
          <span className="font-mono font-bold">{formatDistance(motorcycleData.tripDistance)}</span>
        </div>
      </div>
      
      {/* Right side - indicators */}
      <div className="flex items-center space-x-3">
        {/* Indicator lights */}
        <div className="flex items-center gap-1">
          {/* Left indicator */}
          <div className={`indicator px-1 ${motorcycleData.leftIndicator ? 'text-warning animate-pulse' : 'text-gray-400'}`}>
            <span className="material-icons text-xl">arrow_back</span>
          </div>
          
          {/* Headlight indicator */}
          <div className={`indicator px-1 ${motorcycleData.headlightOn ? 'text-primary' : 'text-gray-400'}`}>
            <span className="material-icons text-xl">
              {motorcycleData.highBeamOn ? 'flashlight_on' : 'lightbulb'}
            </span>
          </div>
          
          {/* Right indicator */}
          <div className={`indicator px-1 ${motorcycleData.rightIndicator ? 'text-warning animate-pulse' : 'text-gray-400'}`}>
            <span className="material-icons text-xl">arrow_forward</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorsPanel;