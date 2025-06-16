import React from "react";
import { useDashboard } from "@/lib/dashboardContext";

const TripDistanceWidget: React.FC = () => {
  const { motorcycleData } = useDashboard();

  // Fake efficiency calculation: km per kWh (assume power is roughly kW, over 1 second)
  const efficiency =
    motorcycleData.power > 0
      ? ((motorcycleData.speed / motorcycleData.power) * 10).toFixed(1)
      : "-";

  return (
    <div className="bg-gray-900 rounded-md p-2 w-full h-full flex flex-col justify-center items-center text-center">
      <div className="text-blue-200 font-mono text-lg font-bold">
        {motorcycleData.tripDistance.toFixed(1)} km
      </div>
      <div className="text-blue-200 font-mono text-sm font-bold mt-1">
        {efficiency} km/kWh
      </div>
    </div>
  );
};

export default TripDistanceWidget;
