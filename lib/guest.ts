export type Prefix = "mr" | "mrs" | "miss" | "mrmrs" | "family" | "dear";

export const prefixOptions: { value: Prefix; label: string }[] = [
  { value: "mr", label: "Mr." },
  { value: "mrs", label: "Mrs." },
  { value: "miss", label: "Miss" },
  { value: "mrmrs", label: "Mr. & Mrs." },
  { value: "family", label: "Family" },
  { value: "dear", label: "Dear" },
];

// "Dear" is only a greeting style: the message already starts with "Dear",
// so the display name is just the guest name.
export function displayName(prefix: Prefix, rawName: string): string {
  // The greeting already says "Dear", so never let it be typed into the name as well
  const name = rawName.replace(/^dear\s+/i, "").trim();
  switch (prefix) {
    case "mr": return `Mr. ${name}`;
    case "mrs": return `Mrs. ${name}`;
    case "miss": return `Miss ${name}`;
    case "mrmrs": return `Mr. & Mrs. ${name}`;
    case "family": return `${name} and Family`;
    case "dear": return name;
  }
}

export function cleanName(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, 60);
}

// Guest links are {site}/{encoded display name}, e.g. /Mr.%20Sanjaya
export function guestFromParam(param: string): string {
  let name = param;
  try { name = decodeURIComponent(param); } catch { /* already decoded */ }
  return cleanName(name);
}

export function greeting(name: string): string {
  return `Dear ${name} ❤️`;
}

export function invitationMessage(name: string, link: string, groom: string, bride: string): string {
  return [
    greeting(name),
    "With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.",
    "Please view our wedding invitation and all the event details through the link below 🌐:",
    link,
    "Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.",
    `With love,\n❤️ ${groom} & ${bride}`,
  ].join("\n\n");
}
