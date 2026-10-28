/**
 * The address form's choices and the address as printed on the page.
 * The API checks every rule again (state names, PIN, phone per country).
 * Pure, so tested.
 */

/** As the API accepts them (it also accepts any letter case). */
export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

/** Codes that name no country (user-assigned ranges and groupings), as the API refuses them. */
const NOT_COUNTRIES = /^(AA|Q[M-Z]|X.|ZZ|EU|EZ|UN)$/;

/** Every country by ISO code, India first, then A–Z by English name. */
export function countries(): { code: string; name: string }[] {
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  const list: { code: string; name: string }[] = [];
  for (let a = 65; a <= 90; a++) {
    for (let b = 65; b <= 90; b++) {
      const code = String.fromCharCode(a, b);
      if (NOT_COUNTRIES.test(code)) continue;
      let name: string | undefined;
      try {
        name = names.of(code);
      } catch {
        continue;
      }
      if (name && name !== code) list.push({ code, name });
    }
  }
  list.sort((x, y) => (x.code === "IN" ? -1 : y.code === "IN" ? 1 : x.name.localeCompare(y.name)));
  return list;
}

export const ADDRESS_FIELDS = [
  "country",
  "fullName",
  "company",
  "gstNumber",
  "phone",
  "line1",
  "line2",
  "landmark",
  "city",
  "state",
  "postalCode",
] as const;

/** The form's text, as the API takes it: empty optional fields are left out. */
export function addressBody(values: Record<string, string>): Record<string, string | boolean> {
  const country = (values.country || "IN").toUpperCase();
  const body: Record<string, string | boolean> = { country };
  for (const name of ADDRESS_FIELDS) {
    if (name === "country") continue;
    const value = (values[name] ?? "").trim();
    // GSTIN only applies to Indian addresses.
    if (name === "gstNumber" && country !== "IN") continue;
    if (value) body[name] = value;
  }
  if (values.isDefault === "on") body.isDefault = true;
  return body;
}

/** The address as lines, for the page. */
export function addressLines(a: {
  fullName: string;
  company: string | null;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  countryName?: string;
  phone: string;
  gstNumber: string | null;
}): string[] {
  return [
    a.company ? `${a.fullName}, ${a.company}` : a.fullName,
    a.line1,
    ...(a.line2 ? [a.line2] : []),
    ...(a.landmark ? [`Near ${a.landmark}`] : []),
    [a.city, a.state, a.postalCode].filter(Boolean).join(", "),
    a.countryName ?? a.country,
    a.phone,
    ...(a.gstNumber ? [`GSTIN ${a.gstNumber}`] : []),
  ];
}

/**
 * A phone as the API's profile wants it (international, "+919812345678"):
 * spaces and dashes go, and an Indian mobile typed the usual way (98123
 * 45678, 098123 45678, 91 98123 45678) gets +91. Anything else is sent as
 * typed, for the API to explain.
 */
export function internationalPhone(input: string): string {
  const compact = input.trim().replace(/[\s\-().]/g, "");
  const indian = /^(?:\+?91|0)?([6-9]\d{9})$/.exec(compact);
  if (indian) return `+91${indian[1]}`;
  if (/^00\d{6,15}$/.test(compact)) return `+${compact.slice(2)}`;
  return compact;
}

/** "AE" → "United Arab Emirates" (the code itself when unknown). */
export function countryName(code: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}
