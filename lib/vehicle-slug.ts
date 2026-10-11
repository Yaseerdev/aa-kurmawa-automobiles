export function generateVehicleSlug(
  year: number | string,
  brand: string,
  model: string
): string {
  const cleanBrand = brand.trim();
  const cleanModel = model
    .trim()
    .replace(
      new RegExp(
        `^${cleanBrand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+`,
        "i"
      ),
      ""
    );

  return `${year}-${cleanBrand}-${cleanModel}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}