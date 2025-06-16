import React, { useEffect, useState } from 'react';
import { useDashboard } from '@/lib/dashboardContext';

const BatteryIndicator: React.FC = () => {
  const { motorcycleData } = useDashboard();

  // Determine color based on battery level
  const getBatteryColor = (): string => {
    if (motorcycleData.fuelLevel <= 15) return 'bg-red-500';
    if (motorcycleData.fuelLevel <= 30) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-gray-900 rounded-md p-2 mb-1 w-full">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <span className="material-icons mr-2 text-blue-400">battery_charging_full</span>
          <span className="text-sm">Bateria</span>
        </div>
        <div className="flex items-center ">
          <span className="text-xs text-gray-400 mr-1">Autonomia:</span>
          <span className="font-mono font-bold text-sm">
  {Math.round(motorcycleData.fuelLevel * 3.72)} km
</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm">{motorcycleData.fuelLevel}%</span>
        </div>
      </div>

      {/* Battery progress bar */}
      <div className="progress-bar bg-gray-800 h-[8px] rounded-full overflow-hidden">
        <div
          className={`h-full ${getBatteryColor()} transition-all duration-500 ease-out`}
          style={{ width: `${motorcycleData.fuelLevel}%` }}
        />
      </div>

      {/* Power display with regen indicator */}
      <div className="flex justify-between items-center mt-1">
        <div className="flex items-center">
          <span className="text-xs text-gray-400">Potência:</span>
        </div>
        <div className="flex items-center">
          {motorcycleData.regenBraking && (
            <span className="text-xs px-1 mr-2 bg-green-500/20 text-green-400 rounded">REGEN</span>
          )}
          <span className={`font-mono font-bold text-sm ${motorcycleData.power < 0 ? 'text-green-400' : 'text-blue-400'}`}>
            {motorcycleData.power < 0 ? '' : '+'}{motorcycleData.power} kW
          </span>
        </div>
      </div>
    </div>
  );
};

export default BatteryIndicator;
