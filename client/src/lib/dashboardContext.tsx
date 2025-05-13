import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { MotorcycleData, Warning, UserSettings, SystemStatus } from './types';
import { useSimulatedData } from './useSimulatedData';

interface DashboardContextProps {
  // Motorcycle data
  motorcycleData: MotorcycleData;
  warnings: Warning[];
  loading: boolean;
  error: string | null;
  
  // System state
  systemStatus: SystemStatus;
  isDarkMode: boolean;
  userSettings: UserSettings;
  
  // Actions
  toggleDarkMode: () => void;
  dismissWarning: (id: number) => Promise<void>;
  resetTrip: () => Promise<void>;
  toggleHighBeam: () => void;
  toggleDrivingMode: () => void;
  showSettings: () => void;
  showHelp: () => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

// Default user ID for simulation
const DEFAULT_USER_ID = 'user-1';

// Default settings
const defaultSettings: UserSettings = {
  userId: DEFAULT_USER_ID,
  theme: 'light',
  speedUnit: 'kmh',
  distanceUnit: 'km',
  temperatureUnit: 'celsius'
};

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get simulated data
  const { 
    motorcycleData, 
    warnings, 
    loading, 
    error,
    dismissWarning,
    resetTrip,
    toggleHighBeam
  } = useSimulatedData();
  
  // User settings state
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultSettings);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // System status state
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    gpsConnected: true,
    currentTime: new Date().toLocaleTimeString(),
    batteryLevel: 85
  });
  
  // Load user settings from the backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/settings/${DEFAULT_USER_ID}`);
        if (response.ok) {
          const settings = await response.json();
          setUserSettings(settings);
          setIsDarkMode(settings.theme === 'dark');
        }
      } catch (err) {
        console.error('Error fetching user settings:', err);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      setSystemStatus(prev => ({
        ...prev,
        currentTime: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      }));
    };
    
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);
    
    return () => clearInterval(timeInterval);
  }, []);
  
  // Toggle dark mode and save to settings
  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    try {
      if (userSettings.id) {
        await fetch(`/api/settings/${userSettings.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme: newDarkMode ? 'dark' : 'light' })
        });
      }
    } catch (err) {
      console.error('Error saving theme settings:', err);
    }
  };
  
  // Show settings modal (placeholder for implementation)
  const showSettings = () => {
    console.log('Show settings');
    // This would open a settings modal in a real implementation
  };
  
  // Show help screen (placeholder for implementation)
  const showHelp = () => {
    console.log('Show help');
    // This would open a help screen in a real implementation
  };
  
  const contextValue: DashboardContextProps = {
    motorcycleData,
    warnings,
    loading,
    error,
    systemStatus,
    isDarkMode,
    userSettings,
    toggleDarkMode,
    dismissWarning,
    resetTrip,
    toggleHighBeam,
    showSettings,
    showHelp
  };
  
  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextProps => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
