import React from 'react';
import { useDashboard } from '@/lib/dashboardContext';
import { Button } from '@/components/ui/button';

const WarningPanel: React.FC = () => {
  const { warnings, dismissWarning } = useDashboard();
  
  const activeWarnings = warnings.filter(warning => warning.active);
  
  // Determine icon based on severity
  const getSeverityIcon = (severity: string): string => {
    switch (severity) {
      case 'danger': return 'error';
      case 'info': return 'info';
      default: return 'warning';
    }
  };
  
  // Determine color based on severity
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'danger': return 'text-destructive';
      case 'info': return 'text-primary';
      default: return 'text-warning';
    }
  };

  if (activeWarnings.length === 0) {
    return (
      <div className="bg-lightSurface dark:bg-darkSurface rounded-xl p-4 shadow-md mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="material-icons mr-2 text-success">check_circle</span>
            <span className="font-medium">System Status</span>
          </div>
          <span className="text-success font-medium">All systems normal</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-lightSurface dark:bg-darkSurface rounded-xl p-4 shadow-md mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className="material-icons mr-2 text-warning">warning</span>
          <span className="font-medium">Warnings</span>
        </div>
        <span className="bg-warning text-white px-2 py-1 rounded-full text-xs font-medium">
          {activeWarnings.length}
        </span>
      </div>
      
      {/* Warning List */}
      <div className="space-y-2">
        {activeWarnings.map((warning) => (
          <div key={warning.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <span className={`material-icons mr-3 ${getSeverityColor(warning.severity)}`}>
                {getSeverityIcon(warning.severity)}
              </span>
              <div>
                <div className="font-medium">{warning.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {warning.description}
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => dismissWarning(warning.id)}
              className="text-xs h-8"
            >
              Dismiss
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarningPanel;
