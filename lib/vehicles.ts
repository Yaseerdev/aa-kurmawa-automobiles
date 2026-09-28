import type { Vehicle } from "@/lib/vehicle-types";

export const vehicles: Vehicle[] = [
  {
    id: "1",
    slug: "toyota-land-cruiser-300",
    brand: "Toyota",
    model: "Land Cruiser 300",
    year: 2024,

    price: "Price on request",
    currency: "NGN",

    mileage: "12,400 km",
    transmission: "Automatic",
    fuel: "Petrol",
    body: "SUV",

    engine: "3.5L Twin-Turbo V6",
    drivetrain: "4WD",
    exteriorColor: "White",
    interiorColor: "Black",

    description:
      "A premium Land Cruiser 300 selected for its exceptional capability, comfort and reliability.",

    status: "AVAILABLE",
    featured: true,
    published: true,

    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1800&q=85",

    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1800&q=85",
    ],
  },

  {
    id: "2",
    slug: "mercedes-amg-g63",
    brand: "Mercedes-Benz",
    model: "AMG G 63",
    year: 2025,

    price: "Price on request",
    currency: "NGN",

    mileage: "2,100 km",
    transmission: "Automatic",
    fuel: "Petrol",
    body: "SUV",

    engine: "4.0L V8 Biturbo",
    drivetrain: "4WD",
    exteriorColor: "Black",
    interiorColor: "Black",

    description:
      "The Mercedes-AMG G 63 combines iconic design with extraordinary performance and luxury.",

    status: "AVAILABLE",
    featured: true,
    published: true,

    image:
      "https://images.unsplash.com/photo-1525609004556-c46c7cf7cf81?auto=format&fit=crop&w=1800&q=85",

    images: [
      "https://images.unsplash.com/photo-1525609004556-c46c7cf7cf81?auto=format&fit=crop&w=1800&q=85",
    ],
  },

  {
    id: "3",
    slug: "lexus-lx-600",
    brand: "Lexus",
    model: "LX 600",
    year: 2024,

    price: "Price on request",
    currency: "NGN",

    mileage: "8,700 km",
    transmission: "Automatic",
    fuel: "Petrol",
    body: "SUV",

    engine: "3.4L Twin-Turbo V6",
    drivetrain: "4WD",
    exteriorColor: "White",
    interiorColor: "Tan",

    description:
      "A refined luxury SUV delivering commanding presence, advanced technology and exceptional comfort.",

    status: "AVAILABLE",
    featured: true,
    published: true,

    image:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1800&q=85",

    images: [
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1800&q=85",
    ],
  },
];