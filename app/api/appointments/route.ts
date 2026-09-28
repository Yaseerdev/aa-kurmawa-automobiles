import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

function isValidDateString(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isValidTimeString(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
  );
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
      appointmentDate,
      appointmentTime,
      message,
    } = body as {
      vehicleId?: unknown;
      name?: unknown;
      phone?: unknown;
      email?: unknown;
      appointmentDate?: unknown;
      appointmentTime?: unknown;
      message?: unknown;
    };

    // Required fields
    if (
      typeof vehicleId !== "string" ||
      !vehicleId.trim() ||
      typeof name !== "string" ||
      !name.trim() ||
      typeof phone !== "string" ||
      !phone.trim() ||
      typeof appointmentDate !== "string" ||
      !appointmentDate.trim() ||
      typeof appointmentTime !== "string" ||
      !appointmentTime.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide your name, phone number, date and time.",
        },
        { status: 400 }
      );
    }

    const cleanVehicleId = vehicleId.trim();

    // Validate UUID format before querying Supabase.
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(cleanVehicleId)) {
      return NextResponse.json(
        {
          error: "Invalid vehicle.",
        },
        { status: 400 }
      );
    }

    // Make sure the vehicle exists, is published,
    // and is actually available for appointment requests.
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .select("id, brand, model, year, published, status")
      .eq("id", cleanVehicleId)
      .eq("published", true)
      .eq("status", "AVAILABLE")
      .maybeSingle();

    if (vehicleError) {
      console.error("Appointment vehicle lookup error:", {
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
            "This vehicle is no longer available for appointment requests.",
        },
        { status: 404 }
      );
    }

    // Strict date validation.
    if (!isValidDateString(appointmentDate)) {
      return NextResponse.json(
        {
          error: "Please provide a valid appointment date.",
        },
        { status: 400 }
      );
    }

    // Compare calendar dates without relying on UTC conversion.
    const today = new Date();

    const todayString = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    if (appointmentDate < todayString) {
      return NextResponse.json(
        {
          error:
            "Please choose today or a future date.",
        },
        { status: 400 }
      );
    }

    // Validate time.
    if (!isValidTimeString(appointmentTime)) {
      return NextResponse.json(
        {
          error: "Please provide a valid appointment time.",
        },
        { status: 400 }
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

    // Basic email validation when supplied.
    if (
      cleanEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      return NextResponse.json(
        {
          error: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("appointments")
      .insert({
        vehicle_id: vehicle.id,
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,

        // Current fields
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,

        // Legacy compatibility fields
        preferred_date: appointmentDate,
        preferred_time: appointmentTime,

        message: cleanMessage,
        status: "PENDING",
      });

    if (error) {
      console.error("Appointment creation error:", {
        message: error.message,
        code: error.code,
      });

      // Never expose raw database errors to the public.
      return NextResponse.json(
        {
          error:
            "Unable to submit your appointment request. Please try again.",
        },
        { status: 500 }
      );
    }

    console.log("Appointment created:", {
      vehicle: `${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Appointment request submitted successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Appointment API error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}