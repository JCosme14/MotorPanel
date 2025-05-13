import React from 'react';
import { useDashboard } from '@/lib/dashboardContext';

const StatusBar: React.FC = () => {
  const { 
    systemStatus, 
    motorcycleData
  } = useDashboard();
  
  // Format current time in Portuguese format
  const formatTime = (): string => {
    return new Date().toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="flex justify-between items-center mb-1 px-2 py-1 bg-gray-900 rounded-md">
      <div className="flex items-center space-x-2">
        {/* GPS icon */}
        <span className={`material-icons text-sm ${systemStatus.gpsConnected ? 'text-green-500' : 'text-amber-500'}`}>
          {systemStatus.gpsConnected ? 'gps_fixed' : 'gps_not_fixed'}
        </span>
        
        {/* Current time */}
        <span className="font-mono text-sm">{formatTime()}</span>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Temperatura */}
        <div className="flex items-center">
          <span className="material-icons mr-1 text-sm text-gray-300">thermostat</span>
          <span className="font-mono text-sm">{Math.round(motorcycleData.temperature)}°C</span>
        </div>

        {/* Modo de condução */}
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          motorcycleData.drivingMode === 'Eco' ? 'bg-green-500/20 text-green-400' :
          motorcycleData.drivingMode === 'Sport' ? 'bg-amber-500/20 text-amber-400' :
          'bg-blue-500/20 text-blue-400'
        }`}>
          {motorcycleData.drivingMode}
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
