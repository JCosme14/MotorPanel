import type React from "react";
import { useDashboard } from "@/lib/dashboardContext";

const GearIndicator: React.FC = () => {
  const { motorcycleData } = useDashboard();

  // Get gear class for styling
  const getGearClass = () => {
    const gear = motorcycleData.gear;
    if (gear >= 5) return "bg-amber-500"; // High gear
    if (gear >= 3) return "bg-green-500"; // Medium gear
    return "bg-blue-500"; // Low gear
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div
        className={`${getGearClass()} text-white rounded py-1.5 px-3 md:py-1 md:px-2 lg:py-2 lg:px-3 flex flex-col items-center justify-center`}
      >
        <div className="text-[28px] md:text-[24px] lg:text-[32px] font-mono font-extrabold leading-none">
          {motorcycleData.gear}
        </div>
      </div>
      {/* Indicator lights */}
      <div className="flex space-x-3 md:space-x-2 lg:space-x-4 mt-1">
        {/* Left turn signal */}
        <div
          className={
            motorcycleData.leftIndicator
              ? "text-amber-400 animate-pulse"
              : "text-gray-700"
          }
        >
          <span className="material-icons text-sm md:text-xs lg:text-sm">
            arrow_back
          </span>
        </div>

        {/* High beam */}
        <div
          className={
            motorcycleData.highBeamOn ? "text-blue-400" : "text-gray-700"
          }
        >
          <span className="material-icons text-sm md:text-xs lg:text-sm">
            highlight
          </span>
        </div>

        {/* Right turn signal */}
        <div
          className={
            motorcycleData.rightIndicator
              ? "text-amber-400 animate-pulse"
              : "text-gray-700"
          }
        >
          <span className="material-icons text-sm md:text-xs lg:text-sm">
            arrow_forward
          </span>
        </div>
      </div>
    </div>
  );
};

export default GearIndicator;
