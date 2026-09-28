import type { VehicleStatus } from "@/lib/vehicle-types";

export function getVehicleStatusLabel(status: VehicleStatus) {
  switch (status) {
    case "AVAILABLE":
      return "Available";

    case "RESERVED":
      return "Reserved";

    case "SOLD":
      return "Sold";

    default:
      return "Available";
  }
}

export function getVehicleStatusMessage(status: VehicleStatus) {
  switch (status) {
    case "AVAILABLE":
      return "This vehicle is currently available for enquiry and inspection.";

    case "RESERVED":
      return "This vehicle is currently reserved. Contact our team for further information.";

    case "SOLD":
      return "This vehicle has been sold. Contact our team to explore similar vehicles.";

    default:
      return "Contact our team for current availability.";
  }
}