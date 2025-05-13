// Core dashboard data types
export interface MotorcycleData {
  speed: number;
  rpm: number;
  gear: number;
  fuelLevel: number;
  temperature: number;
  odometer: number;
  tripDistance: number;
  fuelRange: number;
  timestamp: string;
}

export interface Warning {
  id: number;
  title: string;
  description: string;
  severity: "info" | "warning" | "danger";
  active: boolean;
  timestamp: Date;
}

export interface UserSettings {
  id?: number;
  userId: string;
  theme: "light" | "dark";
  speedUnit: "kmh" | "mph";
  distanceUnit: "km" | "mi";
  temperatureUnit: "celsius" | "fahrenheit";
  lastUpdated?: Date;
}

// Status types
export interface SystemStatus {
  gpsConnected: boolean;
  currentTime: string;
  batteryLevel: number;
}
