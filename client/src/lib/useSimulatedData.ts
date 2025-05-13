import { useState, useEffect, useCallback } from "react";
import { MotorcycleData, Warning } from "./types";
import { apiRequest } from "./queryClient";

const REFRESH_INTERVAL = 1000; // 1 second refresh rate

export const useSimulatedData = () => {
  const [motorcycleData, setMotorcycleData] = useState<MotorcycleData>({
    speed: 0,
    rpm: 0,
    gear: 1,
    fuelLevel: 68,
    temperature: 25,
    odometer: 12457,
    tripDistance: 234.5,
    fuelRange: 215,
    timestamp: new Date().toISOString()
  });
  
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch motorcycle data
  const fetchMotorcycleData = useCallback(async () => {
    try {
      const response = await fetch('/api/motorcycle/data');
      if (!response.ok) {
        throw new Error('Failed to fetch motorcycle data');
      }
      const data = await response.json();
      setMotorcycleData(data);
      setError(null);
    } catch (err) {
      setError('Error fetching motorcycle data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch warnings
  const fetchWarnings = useCallback(async () => {
    try {
      const response = await fetch('/api/warnings');
      if (!response.ok) {
        throw new Error('Failed to fetch warnings');
      }
      const data = await response.json();
      setWarnings(data);
    } catch (err) {
      console.error('Error fetching warnings:', err);
    }
  }, []);

  // Dismiss warning
  const dismissWarning = useCallback(async (id: number) => {
    try {
      await apiRequest('POST', `/api/warnings/${id}/dismiss`, {});
      // Update local state
      setWarnings(prev => prev.filter(warning => warning.id !== id || !warning.active));
    } catch (err) {
      console.error('Error dismissing warning:', err);
    }
  }, []);

  // Reset trip
  const resetTrip = useCallback(async () => {
    // In a real app, this would interact with the backend
    // For simulation, we just reset the trip distance value
    setMotorcycleData(prev => ({
      ...prev,
      tripDistance: 0
    }));
  }, []);

  // Simulate high beam toggle
  const toggleHighBeam = useCallback(() => {
    console.log('High beam toggled');
    // This would interact with motorcycle hardware in a real implementation
  }, []);

  // Initialize data fetching
  useEffect(() => {
    fetchMotorcycleData();
    fetchWarnings();
    
    // Set up interval for periodic data refresh
    const intervalId = setInterval(() => {
      fetchMotorcycleData();
    }, REFRESH_INTERVAL);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [fetchMotorcycleData, fetchWarnings]);

  return {
    motorcycleData,
    warnings,
    loading,
    error,
    dismissWarning,
    resetTrip,
    toggleHighBeam
  };
};
