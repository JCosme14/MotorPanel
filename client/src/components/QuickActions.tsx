"use client"

import type React from "react"
import { useDashboard } from "@/lib/dashboardContext"

const QuickActions: React.FC = () => {
  const { toggleHighBeam, resetTrip, showSettings, toggleDrivingMode, motorcycleData } = useDashboard()

  // Determine the mode icon and color
  const getModeIcon = () => {
    switch (motorcycleData.drivingMode) {
      case "Eco":
        return "eco"
      case "Sport":
        return "speed"
      default:
        return "tune"
    }
  }

  const getModeColor = () => {
    switch (motorcycleData.drivingMode) {
      case "Eco":
        return "text-green-400 bg-green-500/20"
      case "Sport":
        return "text-amber-400 bg-amber-500/20"
      default:
        return "text-blue-400 bg-blue-500/20"
    }
  }

  return (
    <div className="grid grid-cols-3 gap-1 mt-0">
      <button
        className="bg-gray-900 rounded-md py-2 px-1 hover:bg-gray-800 transition-colors flex flex-col items-center justify-center min-h-[60px]"
        onClick={toggleHighBeam}
      >
        <div className="flex flex-col items-center justify-center space-y-1">
          <span className={`material-icons text-sm ${motorcycleData.highBeamOn ? "text-amber-400" : "text-blue-400"}`}>
            {motorcycleData.highBeamOn ? "flashlight_on" : "highlight"}
          </span>
          <span className="text-[10px] text-gray-300">Máximos</span>
        </div>
      </button>

      <button
        className="bg-gray-900 rounded-md py-2 px-1 hover:bg-gray-800 transition-colors flex flex-col items-center justify-center min-h-[60px]"
        onClick={toggleDrivingMode}
      >
        <div className="flex flex-col items-center justify-center space-y-1">
          <span className={`material-icons text-sm ${getModeColor()}`}>{getModeIcon()}</span>
          <span className="text-[10px] text-gray-300">Modo</span>
        </div>
      </button>

      <button
        className="bg-gray-900 rounded-md py-2 px-1 hover:bg-gray-800 transition-colors flex flex-col items-center justify-center min-h-[60px]"
        onClick={resetTrip}
      >
        <div className="flex flex-col items-center justify-center space-y-1">
          <span className="material-icons text-sm text-blue-400">restart_alt</span>
          <span className="text-[10px] text-gray-300">Reiniciar</span>
        </div>
      </button>
    </div>
  )
}

export default QuickActions
