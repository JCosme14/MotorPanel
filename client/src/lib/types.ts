// Define the types for the data you're fetching
interface MotorcycleData {
  power: number
  regenBraking: any
  fuelRange: number
  speed: number
  rpm: number
  fuelLevel: number
  batteryVoltage: number
  latitude: number
  longitude: number
  altitude: number
  heading: number
  throttlePosition: number
  engineTemperature: number
  ambientTemperature: number
  odometer: number
  tripDistance: number
  averageSpeed: number
  currentConsumption: number
  averageConsumption: number
  timeRiding: number
  createdAt: string
}

interface Warning {
  id: number;
  title: string;
  description: string;
  severity: "info" | "danger" | "warning";
  active: boolean;
}

interface SystemStatus {
  engineRunning: boolean
  lightsOn: boolean
  highBeamOn: boolean
  drivingMode: "eco" | "normal" | "sport"
}

interface UserSettings {
  units: "metric" | "imperial"
  theme: "light" | "dark"
  // Add other user settings here
}

// Add the saveDashboardLayout function to the DashboardContextProps interface
interface DashboardContextProps {
  // Motorcycle data
  motorcycleData: MotorcycleData
  warnings: Warning[]
  loading: boolean
  error: string | null

  // System state
  systemStatus: SystemStatus
  isDarkMode: boolean
  userSettings: UserSettings

  // Actions
  toggleDarkMode: () => void
  dismissWarning: (id: number) => Promise<void>
  resetTrip: () => Promise<void>
  toggleHighBeam: () => void
  toggleDrivingMode: () => void
  showSettings: () => void
  showHelp: () => void
  saveDashboardLayout: (layouts: any) => Promise<void> // Add this line
}

export type { MotorcycleData, Warning, SystemStatus, UserSettings, DashboardContextProps }
