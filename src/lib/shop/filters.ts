/**
 * Listing filters in the address: `?options=Texture:Curly,Wavy;Length:18 in`
 * and `?available=1`. Pure, so links and tests share it.
 */
export type Selected = Record<string, string[]>;

export function parseSelected(value: string | string[] | undefined): Selected {
  const text = Array.isArray(value) ? value[0] : value;
  const result: Selected = {};
  for (const part of (text ?? "").split(";")) {
    const at = part.indexOf(":");
    if (at < 1) continue;
    const values = part
      .slice(at + 1)
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (values.length) result[part.slice(0, at).trim()] = values;
  }
  return result;
}

export function formatSelected(selected: Selected): string {
  return Object.entries(selected)
    .filter(([, values]) => values.length > 0)
    .map(([name, values]) => `${name}:${values.join(",")}`)
    .join(";");
}

/** The selection with one value switched on or off. */
export function toggle(selected: Selected, name: string, value: string): Selected {
  const current = selected[name] ?? [];
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  const result = { ...selected, [name]: next };
  if (next.length === 0) delete result[name];
  return result;
}

/** A listing address with these filters ("" parts left out). */
export function listingHref(path: string, selected: Selected, available: boolean): string {
  const query = new URLSearchParams();
  const options = formatSelected(selected);
  if (options) query.set("options", options);
  if (available) query.set("available", "1");
  const text = query.toString();
  return text ? `${path}?${text}` : path;
}
