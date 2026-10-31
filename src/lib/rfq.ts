/**
 * The bulk quote form (phase J4) sends through the contact form's action, so
 * its choices become the enquiry's message. Pure, so tested.
 */
export interface RfqChoices {
  textures: string[];
  lengths: string;
  quantity: string;
  destination: string;
  notes: string;
}

/** The message for the business inbox: one line per choice, then any notes. */
export function rfqMessage(choices: RfqChoices): string {
  const lines = [
    "Bulk quote request",
    `Textures: ${choices.textures.length > 0 ? choices.textures.join(", ") : "not chosen"}`,
    `Lengths: ${choices.lengths || "not chosen"}`,
    `Quantity: ${choices.quantity || "not chosen"}`,
    `Deliver to: ${choices.destination.trim() || "not given"}`,
  ];
  const notes = choices.notes.trim();
  if (notes) lines.push("", notes);
  return lines.join("\n");
}
