import React from 'react';
import { useDashboard } from '@/lib/dashboardContext';

const BatteryIndicator: React.FC = () => {
  const { motorcycleData, userSettings } = useDashboard();
  
  // Format range based on user settings
  const formatRange = (): string => {
    if (userSettings.distanceUnit === 'mi') {
      const rangeInMiles = Math.round(motorcycleData.fuelRange * 0.621371);
      return `${rangeInMiles} mi`;
    }
    return `${Math.round(motorcycleData.fuelRange)} km`;
  };
  
  // Determine color based on battery level
  const getBatteryColor = (): string => {
    if (motorcycleData.fuelLevel <= 15) return 'bg-warning';
    if (motorcycleData.fuelLevel <= 30) return 'bg-secondary';
    return 'bg-success';
  };

  return (
    <div className="bg-lightSurface dark:bg-darkSurface rounded-xl p-4 shadow-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="material-icons mr-2 text-secondary">battery_charging_full</span>
          <span className="font-medium">Battery Level</span>
        </div>
        <span className="font-mono font-bold">{motorcycleData.fuelLevel}%</span>
      </div>
      
      {/* Battery progress bar */}
      <div className="progress-bar bg-gray-200 dark:bg-gray-700 mb-3 h-[18px] rounded-[9px] overflow-hidden">
        <div 
          className={`h-full ${getBatteryColor()} transition-all duration-500 ease-out`} 
          style={{ width: `${motorcycleData.fuelLevel}%` }}
        />
      </div>
      
      <div className="flex justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">Range:</span>
        <span className="font-mono font-bold">{formatRange()}</span>
      </div>
    </div>
  );
};

export default BatteryIndicator;
