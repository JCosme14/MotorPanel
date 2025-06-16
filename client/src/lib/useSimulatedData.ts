import { useState, useEffect, useCallback } from "react";
import { MotorcycleData, Warning } from "./types";

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
    timestamp: new Date().toISOString(),
    drivingMode: "Normal",
    power: 0,
    leftIndicator: false,
    rightIndicator: false,
    headlightOn: true,
    highBeamOn: false,
    regenBraking: false,
  });

  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate motorcycle data updates
  useEffect(() => {
    const getGearFromSpeed = (speed: number): number => {
      if (speed < 10) return 1;
      if (speed < 30) return 2;
      if (speed < 50) return 3;
      if (speed < 80) return 4;
      if (speed < 110) return 5;
      return 6;
    };

    const intervalId = setInterval(() => {
      setMotorcycleData((prev) => {
        const modes: Array<"Eco" | "Normal" | "Sport"> = [
          "Eco",
          "Normal",
          "Sport",
        ];
        const currentIndex = modes.indexOf(prev.drivingMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        const newDrivingMode = modes[nextIndex];
        const newSpeed = Math.floor(Math.random() * 181);
        const newRPM = Math.floor(Math.random() * 12001);
        const isRegenerating = Math.random() > 0.8;

        const newPower = isRegenerating
          ? -Math.round(Math.random() * 10 * 10) / 10 // -0.0 to -3.0 kW
          : Math.round(newSpeed * (0.5 + Math.random() * 0.5));

        const newFuel = Math.floor(Math.random() * 101);
        const newGear = getGearFromSpeed(newSpeed);
        const newLeftIndicator = Math.random() > 0.5;
        const newRightIndicator = Math.random() > 0.5;
        const newHighBeam = Math.random() > 0.8;

        return {
          ...prev,
          drivingMode: newDrivingMode,
          speed: newSpeed,
          rpm: newRPM,
          power: newPower,
          gear: newGear,
          fuelLevel: newFuel,
          timestamp: new Date().toISOString(),
          tripDistance: Math.max(
            0,
            +(prev.tripDistance + (Math.random() * 0.6 - 0.3)).toFixed(2)
          ),
          fuelRange: +(prev.fuelRange - newSpeed / 1000).toFixed(2),
          temperature: +(25 + Math.random() * 50).toFixed(1),
          leftIndicator: newLeftIndicator,
          rightIndicator: newRightIndicator,
          highBeamOn: newHighBeam,
          regenBraking: isRegenerating,
        };
      });
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  // Simulate random warnings
  useEffect(() => {
    const warningPool: Warning[] = [
      {
        id: 1,
        title: "Combustível baixo",
        description: "O nível de combustível está abaixo de 15%",
        severity: "danger",
        active: true,
      },
      {
        id: 2,
        title: "Superaquecimento do motor",
        description: "A temperatura do motor excedeu os limites seguros",
        severity: "danger",
        active: true,
      },
      {
        id: 3,
        title: "Pressão dos pneus baixa",
        description: "Verifique a pressão dos pneus traseiros",
        severity: "info",
        active: true,
      },
    ];

    const intervalId = setInterval(() => {
      const activeWarnings = warningPool.filter(() => Math.random() > 0.7);
      setWarnings(activeWarnings);
    }, 7000); // every 7 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Dismiss warning
  const dismissWarning = useCallback((id: number) => {
    setWarnings((prev) => prev.filter((w) => w.id !== id));
  }, []);

  // Reset trip
  const resetTrip = useCallback(() => {
    setMotorcycleData((prev) => ({
      ...prev,
      tripDistance: 0,
    }));
  }, []);

  // Toggle high beam
  const toggleHighBeam = useCallback(() => {
    setMotorcycleData((prev) => ({
      ...prev,
      highBeamOn: !prev.highBeamOn,
    }));
  }, []);

  // Toggle driving mode
  const toggleDrivingMode = useCallback(() => {
    setMotorcycleData((prev) => {
      const modes: Array<"Eco" | "Normal" | "Sport"> = [
        "Eco",
        "Normal",
        "Sport",
      ];
      const currentIndex = modes.indexOf(prev.drivingMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      return {
        ...prev,
        drivingMode: modes[nextIndex],
      };
    });
  }, []);

  return {
    motorcycleData,
    warnings,
    loading,
    error,
    dismissWarning,
    resetTrip,
    toggleHighBeam,
    toggleDrivingMode,
  };
};
