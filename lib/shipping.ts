// ─────────────────────────────────────────────────────────────────────────────
// Shipping zones and rates.
//
// Stripe does NOT calculate carrier rates — every price below is one we set.
// To change what customers pay, edit the numbers here and nothing else.
// All amounts are in PENCE (395 = £3.95).
//
// Rates below are placeholders pending real Royal Mail quotes. Check them
// against actual international rates for a 200ml bottle before going live.
// ─────────────────────────────────────────────────────────────────────────────

export type ZoneId = "uk" | "europe" | "north-america" | "rest-of-world";

export interface Zone {
  id: ZoneId;
  label: string;
  countries: string[];
  /** Standard delivery price in pence. */
  standard: number;
  standardLabel: string;
  /** Next-day price in pence, or null if not offered to this zone. */
  nextDay: number | null;
  nextDayLabel?: string;
  /** Order subtotal (pence) above which standard delivery is free. null = never free. */
  freeOver: number | null;
}

export const ZONES: Zone[] = [
  {
    id: "uk",
    label: "United Kingdom",
    countries: ["GB"],
    standard: 395,
    standardLabel: "Standard UK Delivery (3–5 days)",
    nextDay: 695,
    nextDayLabel: "Next Day Delivery (order before 2pm)",
    freeOver: 4000, // £40 — UK only, deliberately
  },
  {
    id: "europe",
    label: "Europe",
    countries: [
      "IE", "FR", "DE", "ES", "IT", "NL", "BE", "PT", "AT", "DK", "SE",
      "FI", "NO", "PL", "CZ", "GR", "HU", "RO", "BG", "HR", "SK", "SI",
      "EE", "LV", "LT", "LU", "MT", "CY", "CH", "IS",
    ],
    standard: 995,
    standardLabel: "European Delivery (5–8 days)",
    nextDay: null,
    freeOver: null,
  },
  {
    id: "north-america",
    label: "US & Canada",
    countries: ["US", "CA"],
    standard: 1495,
    standardLabel: "International Delivery (7–12 days)",
    nextDay: null,
    freeOver: null,
  },
  {
    id: "rest-of-world",
    label: "Rest of World",
    countries: [
      "AU", "NZ", "JP", "SG", "HK", "KR", "AE", "SA", "QA", "IL",
      "ZA", "NG", "GH", "KE", "TZ", "UG", "MA", "EG",
      "BR", "MX", "AR", "CL", "IN", "MY", "TH", "PH", "ID",
    ],
    standard: 2295,
    standardLabel: "International Delivery (10–21 days)",
    nextDay: null,
    freeOver: null,
  },
];

/** Every country we ship to, for Stripe's allowed_countries. */
export const ALL_SHIPPING_COUNTRIES = ZONES.flatMap((z) => z.countries);

export function getZoneForCountry(country: string): Zone | null {
  const code = country.toUpperCase();
  return ZONES.find((z) => z.countries.includes(code)) ?? null;
}

/**
 * Build the shipping options Stripe should show for a destination.
 *
 * Stripe fixes shipping options when the Checkout Session is created — before
 * the customer types an address — so we must know the destination country up
 * front. That is why the cart asks for it.
 */
export function buildShippingOptions(zone: Zone, subtotalPence: number) {
  const freeQualified = zone.freeOver !== null && subtotalPence >= zone.freeOver;

  const options = [
    {
      shipping_rate_data: {
        type: "fixed_amount" as const,
        fixed_amount: {
          amount: freeQualified ? 0 : zone.standard,
          currency: "gbp",
        },
        display_name: freeQualified ? "Free Delivery" : zone.standardLabel,
      },
    },
  ];

  if (zone.nextDay !== null) {
    options.push({
      shipping_rate_data: {
        type: "fixed_amount" as const,
        fixed_amount: { amount: zone.nextDay, currency: "gbp" },
        display_name: zone.nextDayLabel ?? "Next Day Delivery",
      },
    });
  }

  return options;
}

/** Countries grouped by zone, for the cart's country picker. */
export const COUNTRY_NAMES: Record<string, string> = {
  GB: "United Kingdom",
  IE: "Ireland", FR: "France", DE: "Germany", ES: "Spain", IT: "Italy",
  NL: "Netherlands", BE: "Belgium", PT: "Portugal", AT: "Austria",
  DK: "Denmark", SE: "Sweden", FI: "Finland", NO: "Norway", PL: "Poland",
  CZ: "Czechia", GR: "Greece", HU: "Hungary", RO: "Romania", BG: "Bulgaria",
  HR: "Croatia", SK: "Slovakia", SI: "Slovenia", EE: "Estonia",
  LV: "Latvia", LT: "Lithuania", LU: "Luxembourg", MT: "Malta",
  CY: "Cyprus", CH: "Switzerland", IS: "Iceland",
  US: "United States", CA: "Canada",
  AU: "Australia", NZ: "New Zealand", JP: "Japan", SG: "Singapore",
  HK: "Hong Kong", KR: "South Korea", AE: "United Arab Emirates",
  SA: "Saudi Arabia", QA: "Qatar", IL: "Israel",
  ZA: "South Africa", NG: "Nigeria", GH: "Ghana", KE: "Kenya",
  TZ: "Tanzania", UG: "Uganda", MA: "Morocco", EG: "Egypt",
  BR: "Brazil", MX: "Mexico", AR: "Argentina", CL: "Chile",
  IN: "India", MY: "Malaysia", TH: "Thailand", PH: "Philippines",
  ID: "Indonesia",
};
