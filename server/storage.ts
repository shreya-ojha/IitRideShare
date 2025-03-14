import { type User, type InsertUser, type Ride, type InsertRide, type RideRequest, type InsertRideRequest } from "@shared/schema";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  
  // Ride operations
  createRide(ride: InsertRide & { creatorId: number }): Promise<Ride>;
  getRideById(id: number): Promise<Ride | undefined>;
  listRides(): Promise<Ride[]>;
  updateRideSeats(id: number, availableSeats: number): Promise<void>;
  
  // Ride request operations
  createRideRequest(request: InsertRideRequest & { userId: number }): Promise<RideRequest>;
  getRideRequests(rideId: number): Promise<RideRequest[]>;
  updateRideRequestStatus(id: number, status: string): Promise<void>;
  listUserRides(userId: number): Promise<Ride[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rides: Map<number, Ride>;
  private rideRequests: Map<number, RideRequest>;
  private currentUserId: number;
  private currentRideId: number;
  private currentRequestId: number;

  constructor() {
    this.users = new Map();
    this.rides = new Map();
    this.rideRequests = new Map();
    this.currentUserId = 1;
    this.currentRideId = 1;
    this.currentRequestId = 1;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createRide(ride: InsertRide & { creatorId: number }): Promise<Ride> {
    const id = this.currentRideId++;
    const newRide = { ...ride, id, status: "active" };
    this.rides.set(id, newRide);
    return newRide;
  }

  async getRideById(id: number): Promise<Ride | undefined> {
    return this.rides.get(id);
  }

  async listRides(): Promise<Ride[]> {
    return Array.from(this.rides.values()).filter(ride => ride.status === "active");
  }

  async updateRideSeats(id: number, availableSeats: number): Promise<void> {
    const ride = this.rides.get(id);
    if (ride) {
      this.rides.set(id, { ...ride, availableSeats });
    }
  }

  async createRideRequest(request: InsertRideRequest & { userId: number }): Promise<RideRequest> {
    const id = this.currentRequestId++;
    const newRequest = { ...request, id, status: "pending" };
    this.rideRequests.set(id, newRequest);
    return newRequest;
  }

  async getRideRequests(rideId: number): Promise<RideRequest[]> {
    return Array.from(this.rideRequests.values()).filter(
      (request) => request.rideId === rideId,
    );
  }

  async updateRideRequestStatus(id: number, status: string): Promise<void> {
    const request = this.rideRequests.get(id);
    if (request) {
      this.rideRequests.set(id, { ...request, status });
    }
  }

  async listUserRides(userId: number): Promise<Ride[]> {
    return Array.from(this.rides.values()).filter(
      (ride) => ride.creatorId === userId
    );
  }
}

export const storage = new MemStorage();
