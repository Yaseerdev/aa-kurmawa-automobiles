import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request.",
        },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          error: "Invalid request.",
        },
        { status: 400 }
      );
    }

    const {
      vehicleId,
      name,
      phone,
      email,
      message,
    } = body as {
      vehicleId?: unknown;
      name?: unknown;
      phone?: unknown;
      email?: unknown;
      message?: unknown;
    };

    // Validate required fields.
    if (
      typeof vehicleId !== "string" ||
      !vehicleId.trim() ||
      typeof name !== "string" ||
      !name.trim() ||
      typeof phone !== "string" ||
      !phone.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide your name, phone number and vehicle.",
        },
        { status: 400 }
      );
    }

    const cleanVehicleId = vehicleId.trim();

    // Validate vehicle ID before querying the database.
    if (!isValidUuid(cleanVehicleId)) {
      return NextResponse.json(
        {
          error: "Invalid vehicle.",
        },
        { status: 400 }
      );
    }

    // Make sure the vehicle exists and is publicly visible.
    const { data: vehicle, error: vehicleError } =
      await supabase
        .from("vehicles")
        .select("id, brand, model, year, published")
        .eq("id", cleanVehicleId)
        .eq("published", true)
        .maybeSingle();

    if (vehicleError) {
      console.error("Enquiry vehicle lookup error:", {
        message: vehicleError.message,
        code: vehicleError.code,
      });

      return NextResponse.json(
        {
          error:
            "Unable to verify the selected vehicle.",
        },
        { status: 500 }
      );
    }

    if (!vehicle) {
      return NextResponse.json(
        {
          error:
            "This vehicle is no longer available for enquiries.",
        },
        { status: 404 }
      );
    }

    // Clean and limit customer information.
    const cleanName = name.trim().slice(0, 100);

    const cleanPhone = phone.trim().slice(0, 40);

    const cleanEmail =
      typeof email === "string" && email.trim()
        ? email.trim().slice(0, 150)
        : null;

    const cleanMessage =
      typeof message === "string" && message.trim()
        ? message.trim().slice(0, 1000)
        : null;

    if (!cleanName || !cleanPhone) {
      return NextResponse.json(
        {
          error:
            "Please provide your name and phone number.",
        },
        { status: 400 }
      );
    }

    // Validate email only when provided.
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      return NextResponse.json(
        {
          error: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("leads")
      .insert({
        vehicle_id: vehicle.id,
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        message: cleanMessage,
        status: "NEW",
      });

    if (error) {
      console.error("Enquiry creation error:", {
        message: error.message,
        code: error.code,
      });

      // Never expose database internals to the public.
      return NextResponse.json(
        {
          error:
            "Unable to submit your enquiry. Please try again.",
        },
        { status: 500 }
      );
    }

    console.log("Enquiry created:", {
      vehicle: `${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enquiry API error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}