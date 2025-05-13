import React, { useEffect } from 'react';
import StatusBar from '@/components/StatusBar';
import Speedometer from '@/components/Speedometer';
import InfoCard from '@/components/InfoCard';
import FuelIndicator from '@/components/FuelIndicator';
import WarningPanel from '@/components/WarningPanel';
import QuickActions from '@/components/QuickActions';
import { useDashboard } from '@/lib/dashboardContext';

const Dashboard: React.FC = () => {
  const { 
    motorcycleData, 
    userSettings, 
    isDarkMode, 
    loading, 
    error 
  } = useDashboard();
  
  useEffect(() => {
    // Import Material Icons
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Import fonts
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@500;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(fontLink);
    };
  }, []);
  
  // Format distance values based on user settings
  const formatDistance = (distanceInKm: number): number => {
    if (userSettings.distanceUnit === 'mi') {
      return distanceInKm * 0.621371;
    }
    return distanceInKm;
  };
  
  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightBg dark:bg-darkBg">
        <div className="text-primary font-medium">Loading dashboard...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightBg dark:bg-darkBg">
        <div className="text-destructive font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div id="dashboard" className="font-sans transition-theme bg-lightBg text-gray-900 dark:bg-darkBg dark:text-white min-h-screen touch-manipulation">
      <div className="container mx-auto h-full p-4">
        {/* Status Bar */}
        <StatusBar />
        
        <div className="grid grid-cols-1 gap-6 h-[calc(100vh-48px)]">
          {/* Main Dashboard Content */}
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Speed and Critical Info Section */}
            <div className="flex-1 flex flex-col items-center justify-center mb-4">
              {/* Speedometer */}
              <Speedometer maxSpeed={200} />
              
              {/* Additional Critical Info */}
              <div className="grid grid-cols-3 gap-4 w-full">
                {/* Odometer Card */}
                <InfoCard 
                  label="TOTAL" 
                  value={formatDistance(motorcycleData.odometer)}
                  unit={userSettings.distanceUnit}
                />
                
                {/* Trip Card */}
                <InfoCard 
                  label="TRIP" 
                  value={formatDistance(motorcycleData.tripDistance)}
                  unit={userSettings.distanceUnit}
                />
                
                {/* Gear Card */}
                <InfoCard 
                  label="GEAR" 
                  value={motorcycleData.gear}
                  unit="current"
                />
              </div>
            </div>
            
            {/* Fuel and Range Section */}
            <FuelIndicator />
            
            {/* Warning Section */}
            <WarningPanel />
            
            {/* Quick Actions */}
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
