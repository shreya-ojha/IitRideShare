import { type User, type InsertUser, type Ride, type InsertRide, type Booking, type InsertBooking } from "@shared/schema";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  
  // Ride operations
  createRide(ride: InsertRide & { creatorId: number }): Promise<Ride>;
  getRideById(id: number): Promise<Ride | undefined>;
  getAllRides(): Promise<Ride[]>;
  searchRides(source?: string, destination?: string): Promise<Ride[]>;
  updateRideSeats(id: number, seats: number): Promise<Ride>;
  
  // Booking operations
  createBooking(booking: InsertBooking & { userId: number }): Promise<Booking>;
  getBookingsByRideId(rideId: number): Promise<Booking[]>;
  getBookingsByUserId(userId: number): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rides: Map<number, Ride>;
  private bookings: Map<number, Booking>;
  private userId: number;
  private rideId: number;
  private bookingId: number;

  constructor() {
    this.users = new Map();
    this.rides = new Map();
    this.bookings = new Map();
    this.userId = 1;
    this.rideId = 1;
    this.bookingId = 1;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createRide(ride: InsertRide & { creatorId: number }): Promise<Ride> {
    const id = this.rideId++;
    const newRide = { ...ride, id, status: "active" };
    this.rides.set(id, newRide);
    return newRide;
  }

  async getRideById(id: number): Promise<Ride | undefined> {
    return this.rides.get(id);
  }

  async getAllRides(): Promise<Ride[]> {
    return Array.from(this.rides.values());
  }

  async searchRides(source?: string, destination?: string): Promise<Ride[]> {
    return Array.from(this.rides.values()).filter(ride => {
      if (source && !ride.source.toLowerCase().includes(source.toLowerCase())) return false;
      if (destination && !ride.destination.toLowerCase().includes(destination.toLowerCase())) return false;
      return true;
    });
  }

  async updateRideSeats(id: number, seats: number): Promise<Ride> {
    const ride = await this.getRideById(id);
    if (!ride) throw new Error("Ride not found");
    const updatedRide = { ...ride, availableSeats: seats };
    this.rides.set(id, updatedRide);
    return updatedRide;
  }

  async createBooking(booking: InsertBooking & { userId: number }): Promise<Booking> {
    const id = this.bookingId++;
    const newBooking = { ...booking, id, status: "pending" };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async getBookingsByRideId(rideId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.rideId === rideId
    );
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const booking = this.bookings.get(id);
    if (!booking) throw new Error("Booking not found");
    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }
}

export const storage = new MemStorage();
