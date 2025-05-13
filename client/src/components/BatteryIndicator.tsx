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
    if (motorcycleData.fuelLevel <= 15) return 'bg-destructive';
    if (motorcycleData.fuelLevel <= 30) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="bg-lightSurface dark:bg-darkSurface rounded-xl p-3 shadow-md mb-2">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <span className="material-icons mr-2 text-secondary">battery_charging_full</span>
          <span className="font-medium">Bateria</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-1">Autonomia:</span>
            <span className="font-mono font-bold">{formatRange()}</span>
          </div>
          <span className="font-mono font-bold">{motorcycleData.fuelLevel}%</span>
        </div>
      </div>
      
      {/* Battery progress bar */}
      <div className="progress-bar bg-gray-200 dark:bg-gray-700 h-[12px] rounded-full overflow-hidden">
        <div 
          className={`h-full ${getBatteryColor()} transition-all duration-500 ease-out`} 
          style={{ width: `${motorcycleData.fuelLevel}%` }}
        />
      </div>
      
      {/* Power display */}
      <div className="flex justify-between mt-1">
        <span className="text-sm text-gray-600 dark:text-gray-400">Potência:</span>
        <span className={`font-mono font-bold ${motorcycleData.power < 0 ? 'text-success' : 'text-primary'}`}>
          {motorcycleData.power < 0 ? '' : '+'}{motorcycleData.power} kW
          {motorcycleData.regenBraking && (
            <span className="text-xs ml-1 text-success">REGEN</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default BatteryIndicator;
