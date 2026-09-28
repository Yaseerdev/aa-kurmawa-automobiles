export type VehicleStatus = "AVAILABLE" | "RESERVED" | "SOLD";

export type Vehicle = {
  id: string;
  slug: string;

  // Identity
  brand: string;
  model: string;
  year: number;

  // Pricing
  price: string;
  currency?: string;

  // Core specifications
  mileage: string;
  transmission: string;
  fuel: string;
  body: string;

  // Additional specifications
  engine?: string;
  drivetrain?: string;
  exteriorColor?: string;
  interiorColor?: string;

  // Content
  description?: string;

  // Inventory
  status: VehicleStatus;
  featured?: boolean;
  published?: boolean;

  // Media
  image: string;
  images?: string[];

  // Metadata
  createdAt?: string;
  updatedAt?: string;
};