import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSettingsSchema, insertWarningSchema, insertTripSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Settings API routes
  app.get("/api/settings/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
      const settings = await storage.getSettings(userId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const settingsData = insertSettingsSchema.parse(req.body);
      const settings = await storage.saveSettings(settingsData);
      res.status(201).json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save settings" });
    }
  });

  app.patch("/api/settings/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
      const updatedData = insertSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateSettings(id, updatedData);
      
      if (!settings) {
        return res.status(404).json({ message: "Settings not found" });
      }
      
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Warnings API routes
  app.get("/api/warnings", async (_req, res) => {
    try {
      const warnings = await storage.getActiveWarnings();
      res.json(warnings);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve warnings" });
    }
  });

  app.post("/api/warnings", async (req, res) => {
    try {
      const warningData = insertWarningSchema.parse(req.body);
      const warning = await storage.createWarning(warningData);
      res.status(201).json(warning);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid warning data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create warning" });
    }
  });

  app.post("/api/warnings/:id/dismiss", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
      const success = await storage.dismissWarning(id);
      
      if (!success) {
        return res.status(404).json({ message: "Warning not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to dismiss warning" });
    }
  });

  // Trip API routes
  app.get("/api/trips/current/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
      const currentTrip = await storage.getCurrentTrip(userId);
      
      if (!currentTrip) {
        return res.status(404).json({ message: "No active trip found" });
      }
      
      res.json(currentTrip);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve current trip" });
    }
  });

  app.post("/api/trips/start", async (req, res) => {
    try {
      const tripData = insertTripSchema.parse(req.body);
      const trip = await storage.startTrip(tripData);
      res.status(201).json(trip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trip data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to start trip" });
    }
  });

  app.patch("/api/trips/:id/end", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
      const endTripSchema = insertTripSchema.pick({
        endOdometer: true,
        endTime: true,
        avgSpeed: true,
        maxSpeed: true,
        fuelUsed: true
      });
      
      const endData = endTripSchema.parse(req.body);
      const trip = await storage.endTrip(id, endData);
      
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      res.json(trip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trip data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to end trip" });
    }
  });

  app.get("/api/trips/history/:userId", async (req, res) => {
    const userId = req.params.userId;
    const limit = parseInt(req.query.limit as string || "10", 10);
    
    try {
      const trips = await storage.getTripHistory(userId, limit);
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve trip history" });
    }
  });

  // Simple API for simulated motorcycle data
  app.get("/api/motorcycle/data", (_req, res) => {
    // Generate random data for simulation purposes
    const modes = ["Eco", "Normal", "Sport"];
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    
    // Random boolean for indicators
    const leftIndicator = Math.random() > 0.8;
    const rightIndicator = !leftIndicator && Math.random() > 0.8;
    const headlightOn = Math.random() > 0.3;
    const highBeamOn = headlightOn && Math.random() > 0.7;
    const regenBraking = Math.random() > 0.7;
    
    // Power can be negative (regen) or positive (consumption)
    const power = regenBraking ? 
      -(Math.floor(Math.random() * 15) + 5) : 
      Math.floor(Math.random() * 40) + 10;
      
    const data = {
      speed: Math.floor(Math.random() * 120),
      rpm: Math.floor(Math.random() * 8000) + 1000,
      gear: Math.floor(Math.random() * 6) + 1,
      fuelLevel: Math.floor(Math.random() * 100),
      temperature: Math.floor(Math.random() * 20) + 15,
      odometer: 12457 + (Math.random() * 10),
      tripDistance: 234.5 + (Math.random() * 2),
      fuelRange: Math.floor(Math.random() * 50) + 180,
      timestamp: new Date().toISOString(),
      // New fields
      drivingMode: randomMode,
      power: power,
      leftIndicator: leftIndicator,
      rightIndicator: rightIndicator,
      headlightOn: headlightOn,
      highBeamOn: highBeamOn,
      regenBraking: regenBraking
    };
    
    res.json(data);
  });

  const httpServer = createServer(app);
  return httpServer;
}
