import React from 'react';
import { useDashboard } from '@/lib/dashboardContext';
import { Badge } from '@/components/ui/badge';

const IndicatorsPanel: React.FC = () => {
  const { motorcycleData } = useDashboard();

  return (
    <div className="bg-lightSurface dark:bg-darkSurface rounded-xl p-4 shadow-md mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className="material-icons mr-2 text-primary">dashboard</span>
          <span className="font-medium">Status</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left side - indicators */}
        <div className="space-y-2">
          {/* Indicators (turn signals, lights) */}
          <div className="flex items-center space-x-4">
            {/* Left indicator */}
            <div className={`indicator p-2 ${motorcycleData.leftIndicator ? 'text-warning animate-pulse' : 'text-gray-400'}`}>
              <span className="material-icons text-2xl">arrow_back</span>
            </div>
            
            {/* Headlight indicator */}
            <div className={`indicator p-2 ${motorcycleData.headlightOn ? 'text-primary' : 'text-gray-400'}`}>
              <span className="material-icons text-2xl">
                {motorcycleData.highBeamOn ? 'flashlight_on' : 'lightbulb'}
              </span>
            </div>
            
            {/* Right indicator */}
            <div className={`indicator p-2 ${motorcycleData.rightIndicator ? 'text-warning animate-pulse' : 'text-gray-400'}`}>
              <span className="material-icons text-2xl">arrow_forward</span>
            </div>
          </div>
          
          {/* Regenerative braking indicator */}
          {motorcycleData.regenBraking && (
            <Badge className="ml-2 bg-success text-white">
              <span className="material-icons text-sm mr-1">battery_charging_full</span>
              REGEN
            </Badge>
          )}
        </div>
        
        {/* Right side - power and mode */}
        <div className="space-y-2">
          {/* Driving mode */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Modo:</span>
            <Badge 
              className={`${
                motorcycleData.drivingMode === 'Eco' ? 'bg-success' :
                motorcycleData.drivingMode === 'Sport' ? 'bg-warning' :
                'bg-primary'
              }`}
            >
              {motorcycleData.drivingMode}
            </Badge>
          </div>
          
          {/* Power consumption/regeneration */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Potência:</span>
            <span className={`font-mono font-bold ${motorcycleData.power < 0 ? 'text-success' : 'text-primary'}`}>
              {motorcycleData.power < 0 ? '' : '+'}{motorcycleData.power} kW
            </span>
          </div>
          
          {/* Current time */}
          <div className="flex justify-end mt-2">
            <span className="font-mono text-sm">
              {new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorsPanel;