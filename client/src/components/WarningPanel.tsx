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
      <div className="bg-lightSurface dark:bg-darkSurface rounded-xl p-2 shadow-md mb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="material-icons mr-2 text-success">check_circle</span>
            <span className="font-medium">Estado do Sistema</span>
          </div>
          <span className="text-success font-medium text-sm">Todos sistemas normais</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-lightSurface dark:bg-darkSurface rounded-xl p-2 shadow-md mb-2">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <span className="material-icons mr-2 text-warning">warning</span>
          <span className="font-medium">Avisos</span>
        </div>
        <span className="bg-warning text-white px-2 py-1 rounded-full text-xs font-medium">
          {activeWarnings.length}
        </span>
      </div>
      
      {/* Warning List */}
      <div className="space-y-1 max-h-20 overflow-y-auto">
        {activeWarnings.map((warning) => (
          <div key={warning.id} className="flex items-start justify-between py-1 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start">
              <span className={`material-icons mt-1 mr-2 ${getSeverityColor(warning.severity)}`}>
                {getSeverityIcon(warning.severity)}
              </span>
              <div>
                <div className="font-medium text-sm">{warning.title}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {warning.description}
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => dismissWarning(warning.id)}
              className="text-xs h-6 ml-1"
            >
              Ignorar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarningPanel;
