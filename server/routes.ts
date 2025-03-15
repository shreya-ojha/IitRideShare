import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertRideSchema, insertRideRequestSchema } from "@shared/schema";
import session from "express-session";
import MemoryStore from "memorystore";

// Extend express-session types to include our custom properties
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      store: new SessionStore({ checkPeriod: 86400000 }),
      secret: "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    })
  );

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser(data);
      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid request" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });

  // Ride routes
  app.get("/api/rides", async (req, res) => {
    try {
      const rides = await storage.listRides();
      res.json(rides);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rides" });
    }
  });

  app.post("/api/rides", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const data = insertRideSchema.parse(req.body);
      const ride = await storage.createRide({
        ...data,
        creatorId: req.session.userId,
      });
      res.json(ride);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid request" });
    }
  });

  app.post("/api/rides/:rideId/requests", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const rideId = parseInt(req.params.rideId);
      const ride = await storage.getRideById(rideId);

      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }

      if (ride.availableSeats < 1) {
        return res.status(400).json({ message: "No seats available" });
      }

      const request = await storage.createRideRequest({
        rideId,
        userId: req.session.userId,
      });

      res.json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.get("/api/rides/:rideId/requests", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const rideId = parseInt(req.params.rideId);
      const ride = await storage.getRideById(rideId);

      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }

      // Only ride creator can view requests
      if (ride.creatorId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to view these requests" });
      }

      const requests = await storage.getRideRequests(rideId);
      // Get user details for each request
      const requestsWithUsers = await Promise.all(
        requests.map(async (request) => {
          const user = await storage.getUserById(request.userId);
          return {
            ...request,
            user: user ? {
              username: user.username,
              fullName: user.fullName,
              studentId: user.studentId
            } : null
          };
        })
      );

      res.json(requestsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ride requests" });
    }
  });

  app.post("/api/rides/:rideId/requests/:requestId", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const rideId = parseInt(req.params.rideId);
      const requestId = parseInt(req.params.requestId);
      const { status } = req.body; // status should be 'accepted' or 'rejected'

      const ride = await storage.getRideById(rideId);
      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }

      // Only ride creator can approve/reject requests
      if (ride.creatorId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to manage requests" });
      }

      if (status === 'accepted' && ride.availableSeats < 1) {
        return res.status(400).json({ message: "No seats available" });
      }

      await storage.updateRideRequestStatus(requestId, status);

      if (status === 'accepted') {
        // Update available seats
        await storage.updateRideSeats(rideId, ride.availableSeats - 1);
      }

      res.json({ message: `Request ${status}` });
    } catch (error) {
      res.status(400).json({ message: "Failed to update request" });
    }
  });

  app.get("/api/user/rides", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const rides = await storage.listUserRides(req.session.userId);
      res.json(rides);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user rides" });
    }
  });

  app.post("/api/rides/:rideId/ratings", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const rideId = parseInt(req.params.rideId);
      const data = insertRatingSchema.parse(req.body);
      const rating = await storage.createRating({
        ...data,
        userId: req.session.userId,
        rideId,
      });
      res.json(rating);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid request" });
    }
  });

  app.get("/api/rides/:rideId/ratings", async (req, res) => {
    try {
      const rideId = parseInt(req.params.rideId);
      const ratings = await storage.getRideRatings(rideId);
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });

  app.post("/api/rides/:rideId/messages", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const rideId = parseInt(req.params.rideId);
      const data = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage({
        ...data,
        senderId: req.session.userId,
        rideId,
      });
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid request" });
    }
  });

  app.get("/api/rides/:rideId/messages", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const rideId = parseInt(req.params.rideId);
      const messages = await storage.getRideMessages(rideId, req.session.userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}