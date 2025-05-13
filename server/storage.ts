import {
  settings,
  type Settings,
  type InsertSettings,
  warnings,
  type Warning,
  type InsertWarning,
  trips,
  type Trip,
  type InsertTrip
} from "@shared/schema";

export interface IStorage {
  // Settings methods
  getSettings(userId: string): Promise<Settings | undefined>;
  saveSettings(settings: InsertSettings): Promise<Settings>;
  updateSettings(id: number, settings: Partial<InsertSettings>): Promise<Settings | undefined>;

  // Warnings methods
  getActiveWarnings(): Promise<Warning[]>;
  createWarning(warning: InsertWarning): Promise<Warning>;
  dismissWarning(id: number): Promise<boolean>;

  // Trip methods
  getCurrentTrip(userId: string): Promise<Trip | undefined>;
  startTrip(trip: InsertTrip): Promise<Trip>;
  endTrip(id: number, endData: Pick<InsertTrip, 'endOdometer' | 'endTime' | 'avgSpeed' | 'maxSpeed' | 'fuelUsed'>): Promise<Trip | undefined>;
  getTripHistory(userId: string, limit: number): Promise<Trip[]>;
}

export class MemStorage implements IStorage {
  private settings: Map<number, Settings>;
  private warnings: Map<number, Warning>;
  private trips: Map<number, Trip>;
  private currentSettingsId: number;
  private currentWarningId: number;
  private currentTripId: number;

  constructor() {
    this.settings = new Map();
    this.warnings = new Map();
    this.trips = new Map();
    this.currentSettingsId = 1;
    this.currentWarningId = 1;
    this.currentTripId = 1;

    // Setup initial warnings
    this.createWarning({
      title: "Tire Pressure",
      description: "Front tire pressure low",
      severity: "warning",
      active: true
    });
  }

  // Settings methods
  async getSettings(userId: string): Promise<Settings | undefined> {
    for (const settings of this.settings.values()) {
      if (settings.userId === userId) {
        return settings;
      }
    }
    
    // Return default settings if none found
    const defaultSettings: InsertSettings = {
      userId,
      theme: "light",
      speedUnit: "kmh",
      distanceUnit: "km",
      temperatureUnit: "celsius"
    };
    
    return this.saveSettings(defaultSettings);
  }

  async saveSettings(insertSettings: InsertSettings): Promise<Settings> {
    const id = this.currentSettingsId++;
    const timestamp = new Date();
    const settings: Settings = { ...insertSettings, id, lastUpdated: timestamp };
    this.settings.set(id, settings);
    return settings;
  }

  async updateSettings(id: number, updatedSettings: Partial<InsertSettings>): Promise<Settings | undefined> {
    const existing = this.settings.get(id);
    if (!existing) return undefined;

    const updated: Settings = {
      ...existing,
      ...updatedSettings,
      lastUpdated: new Date()
    };
    
    this.settings.set(id, updated);
    return updated;
  }

  // Warnings methods
  async getActiveWarnings(): Promise<Warning[]> {
    return Array.from(this.warnings.values()).filter(warning => warning.active);
  }

  async createWarning(insertWarning: InsertWarning): Promise<Warning> {
    const id = this.currentWarningId++;
    const timestamp = new Date();
    const warning: Warning = { ...insertWarning, id, timestamp };
    this.warnings.set(id, warning);
    return warning;
  }

  async dismissWarning(id: number): Promise<boolean> {
    const warning = this.warnings.get(id);
    if (!warning) return false;
    
    warning.active = false;
    this.warnings.set(id, warning);
    return true;
  }

  // Trip methods
  async getCurrentTrip(userId: string): Promise<Trip | undefined> {
    for (const trip of this.trips.values()) {
      if (trip.userId === userId && !trip.endTime) {
        return trip;
      }
    }
    return undefined;
  }

  async startTrip(insertTrip: InsertTrip): Promise<Trip> {
    const id = this.currentTripId++;
    const trip: Trip = { ...insertTrip, id };
    this.trips.set(id, trip);
    return trip;
  }

  async endTrip(id: number, endData: Pick<InsertTrip, 'endOdometer' | 'endTime' | 'avgSpeed' | 'maxSpeed' | 'fuelUsed'>): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (!trip) return undefined;
    
    const updatedTrip: Trip = {
      ...trip,
      ...endData
    };
    
    this.trips.set(id, updatedTrip);
    return updatedTrip;
  }

  async getTripHistory(userId: string, limit: number): Promise<Trip[]> {
    return Array.from(this.trips.values())
      .filter(trip => trip.userId === userId && trip.endTime !== null)
      .sort((a, b) => (b.endTime?.getTime() || 0) - (a.endTime?.getTime() || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
