import React from "react";
import { useDashboard } from "@/lib/dashboardContext";

const WarningPanel: React.FC = () => {
  const { warnings, dismissWarning } = useDashboard();

  const activeWarnings = warnings.filter((warning) => warning.active);

  // Get color based on severity
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "danger":
        return "text-red-500";
      case "info":
        return "text-blue-400";
      default:
        return "text-amber-400";
    }
  };

  if (activeWarnings.length === 0) {
    return (
      <div className="bg-gray-900 rounded-md p-1 mb-1 w-full h-full flex items-center justify-center text-center">
        <span className="material-icons mr-2 text-green-500">check_circle</span>
        <span className="text-sm text-gray-200">
          Sistema funcionando normalmente
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-md p-1 mb-1 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="material-icons mr-2 text-amber-400">warning</span>
          <span className="text-sm text-gray-200">Avisos</span>
        </div>
        <span className="bg-amber-500 text-black px-2 rounded-full text-xs font-bold">
          {activeWarnings.length}
        </span>
      </div>

      {/* Warning List - compact display */}
      {activeWarnings.length > 0 && (
        <div
          className="mt-1 overflow-hidden rounded bg-gray-800 cursor-pointer"
          onClick={() => dismissWarning(activeWarnings[0].id)}
        >
          <div className="flex items-center p-1 text-xs">
            <span
              className={`material-icons text-sm mr-1 ${getSeverityColor(
                activeWarnings[0].severity
              )}`}
            >
              error
            </span>
            <span className="font-medium">{activeWarnings[0].title}:</span>
            <span className="ml-1 text-gray-300 truncate">
              {activeWarnings[0].description}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarningPanel;
