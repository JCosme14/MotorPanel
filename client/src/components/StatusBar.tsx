import React from "react";
import { useDashboard } from "@/lib/dashboardContext";

const StatusBar: React.FC = () => {
  const { systemStatus, motorcycleData } = useDashboard();

  const formatTime = () =>
    new Date().toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return (
    <div className="flex justify-between items-center px-1 bg-gray-900 rounded w-full text-[0.6rem] leading-tight">
      <div className="flex items-center gap-1">
        {/* GPS icon - micro size */}
        <span
          className={`material-icons text-[0.6rem] ${
            systemStatus.gpsConnected ? "text-green-500" : "text-amber-500"
          }`}
        >
          {systemStatus.gpsConnected ? "gps_fixed" : "gps_not_fixed"}
        </span>

        {/* Current time - condensed */}
        <span className="font-mono tracking-tight text-[0.8rem] font-semibold">
          {formatTime()}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {/* Temperature - minimal */}
        <div className="flex items-center">
          <span className="material-icons text-[0.6rem] text-gray-300 mr-px">
            thermostat
          </span>
          <span className="font-mono tracking-tight text-[0.8rem] font-semibold">
            {Math.round(motorcycleData.temperature)}°
          </span>
        </div>

        {/* Driving mode - tiny badge */}
        <span
          className={`font-bold text-[0.7rem] px-1 rounded-sm ${
            motorcycleData.drivingMode === "Eco"
              ? "bg-green-500/20 text-green-400"
              : motorcycleData.drivingMode === "Sport"
              ? "bg-amber-500/20 text-amber-400"
              : "bg-blue-500/20 text-blue-400"
          }`}
        >
          {motorcycleData.drivingMode}
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
