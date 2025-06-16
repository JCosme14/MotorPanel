"use client";

import type React from "react";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import type {
  MotorcycleData,
  Warning,
  UserSettings,
  SystemStatus,
} from "./types";
import { useSimulatedData } from "./useSimulatedData";

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
  saveDashboardLayout: (layouts: any) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(
  undefined
);

// Default user ID for simulation
const DEFAULT_USER_ID = "user-1";

// Default settings
const defaultSettings: UserSettings = {
  userId: DEFAULT_USER_ID,
  theme: "light",
  speedUnit: "kmh",
  distanceUnit: "km",
  temperatureUnit: "celsius",
};

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Get simulated data
  const {
    motorcycleData,
    warnings,
    loading,
    error,
    dismissWarning,
    resetTrip,
    toggleHighBeam,
    toggleDrivingMode,
  } = useSimulatedData();

  // User settings state
  const [userSettings, setUserSettings] =
    useState<UserSettings>(defaultSettings);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // System status state
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    gpsConnected: true,
    currentTime: new Date().toLocaleTimeString(),
    batteryLevel: 85,
  });

  // Load user settings from the backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const local = localStorage.getItem(`settings-${DEFAULT_USER_ID}`);
        if (local) {
          const settings = JSON.parse(local);
          setUserSettings(settings);
          setIsDarkMode(settings.theme === "dark");
        } else {
          setUserSettings(defaultSettings);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };

    fetchSettings();
  }, []);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const gpsConnected = Math.random() > 0.6;

      setSystemStatus((prev) => ({
        ...prev,
        gpsConnected,
        currentTime: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
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

    const newSettings = {
      ...userSettings,
      theme: newDarkMode ? "dark" : "light",
    };

    setUserSettings(newSettings);
    localStorage.setItem(
      `settings-${DEFAULT_USER_ID}`,
      JSON.stringify(newSettings)
    );
  };

  // Show settings modal (placeholder for implementation)
  const showSettings = () => {
    console.log("Show settings");
    // This would open a settings modal in a real implementation
  };

  // Show help screen (placeholder for implementation)
  const showHelp = () => {
    console.log("Show help");
    // This would open a help screen in a real implementation
  };

  // Add a function to save dashboard layouts
  const saveDashboardLayout = async (layouts: any) => {
    try {
      localStorage.setItem("dashboardLayouts", JSON.stringify(layouts));
    } catch (err) {
      console.error("Error saving dashboard layout:", err);
    }
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
    toggleDrivingMode,
    showSettings,
    showHelp,
    saveDashboardLayout, // Add this new function
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
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
