import { supabase } from "@/lib/supabase";
import type { Vehicle } from "@/lib/vehicle-types";

type DbVehicle = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number | null;
  currency: string;
  mileage: number | null;
  transmission: string | null;
  fuel_type: string | null;
  body_type: string | null;
  engine: string | null;
  drivetrain: string | null;
  exterior_color: string | null;
  interior_color: string | null;
  condition: string | null;
  description: string | null;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
};

type DbVehicleImage = {
  id: string;
  vehicle_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;

};

function formatPrice(
  price: number | null,
  currency: string
): string {
  if (price === null) {
    return "Price on request";
  }

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price.toLocaleString("en-NG")}`;
  }
}

function formatMileage(
  mileage: number | null
): string {
  if (mileage === null) {
    return "Not specified";
  }

  return `${mileage.toLocaleString("en-NG")} km`;
}

function mapVehicle(
  vehicle: DbVehicle,
  images: DbVehicleImage[]
): Vehicle {
  const sortedImages = [...images].sort((a, b) => {
    // Primary image always comes first.
    if (a.is_primary !== b.is_primary) {
      return a.is_primary ? -1 : 1;
    }

    // Then respect the administrator's image order.
    return a.sort_order - b.sort_order;
  });

  const imageUrls = sortedImages.map(
    (image) => image.image_url
  );

  return {
    id: vehicle.id,
    slug: vehicle.slug,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,

    price: formatPrice(
      vehicle.price,
      vehicle.currency
    ),

    currency: vehicle.currency,

    mileage: formatMileage(
      vehicle.mileage
    ),

    transmission:
      vehicle.transmission ?? "Not specified",

    fuel:
      vehicle.fuel_type ?? "Not specified",

    body:
      vehicle.body_type ?? "Not specified",

    engine:
      vehicle.engine ?? undefined,

    drivetrain:
      vehicle.drivetrain ?? undefined,

    exteriorColor:
      vehicle.exterior_color ?? undefined,

    interiorColor:
      vehicle.interior_color ?? undefined,

    description:
      vehicle.description ?? undefined,

    status: vehicle.status,

    featured: vehicle.featured,

    published: vehicle.published,

    image: imageUrls[0] ?? "",

    images: imageUrls,

    createdAt: vehicle.created_at,

    updatedAt: vehicle.updated_at,
  };
}

async function getImagesForVehicles(
  vehicleIds: string[]
): Promise<DbVehicleImage[]> {
  if (vehicleIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("vehicle_images")
    .select(`
      id,
      vehicle_id,
      image_url,
      alt_text,
      sort_order,
      is_primary
    `)
    .in("vehicle_id", vehicleIds)
    .order("is_primary", {
      ascending: false,
    })
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Failed to load vehicle images:",
      error
    );

    return [];
  }

  return (data ?? []) as DbVehicleImage[];
}

function attachImages(
  vehicles: DbVehicle[],
  images: DbVehicleImage[]
): Vehicle[] {
  const imagesByVehicle = new Map<
    string,
    DbVehicleImage[]
  >();

  for (const image of images) {
    const existing =
      imagesByVehicle.get(image.vehicle_id) ?? [];

    existing.push(image);

    imagesByVehicle.set(
      image.vehicle_id,
      existing
    );
  }

  return vehicles.map((vehicle) =>
    mapVehicle(
      vehicle,
      imagesByVehicle.get(vehicle.id) ?? []
    )
  );
}

export async function getPublishedVehicles(): Promise<
  Vehicle[]
> {
  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      id,
      slug,
      brand,
      model,
      year,
      price,
      currency,
      mileage,
      transmission,
      fuel_type,
      body_type,
      engine,
      drivetrain,
      exterior_color,
      interior_color,
      condition,
      description,
      status,
      featured,
      published,
      created_at,
      updated_at
    `)
    .eq("published", true)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to load published vehicles:",
      error
    );

    return [];
  }

  const vehicles =
    (data ?? []) as DbVehicle[];

  if (vehicles.length === 0) {
    return [];
  }

  const images =
    await getImagesForVehicles(
      vehicles.map(
        (vehicle) => vehicle.id
      )
    );

  return attachImages(
    vehicles,
    images
  );
}

export async function getPublishedVehicleBySlug(
  slug: string
): Promise<Vehicle | null> {
  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      id,
      slug,
      brand,
      model,
      year,
      price,
      currency,
      mileage,
      transmission,
      fuel_type,
      body_type,
      engine,
      drivetrain,
      exterior_color,
      interior_color,
      condition,
      description,
      status,
      featured,
      published,
      created_at,
      updated_at
    `)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to load vehicle:",
      error
    );

    return null;
  }

  if (!data) {
    return null;
  }

  const vehicle =
    data as DbVehicle;

  const images =
    await getImagesForVehicles([
      vehicle.id,
    ]);

  return mapVehicle(
    vehicle,
    images
  );
}

export async function getRelatedVehicles(
  vehicleId: string,
  limit = 2
): Promise<Vehicle[]> {
  const vehicles =
    await getPublishedVehicles();

  return vehicles
    .filter(
      (vehicle) =>
        vehicle.id !== vehicleId
    )
    .slice(0, limit);
}