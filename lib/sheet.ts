import { wedding } from "@/lib/wedding";

// Google Apps Script web app (google-apps-script/Code.gs) that stores RSVPs and wishes.
export function scriptUrl(): string {
  return process.env.SHEET_SCRIPT_URL || process.env.RSVP_SCRIPT_URL || wedding.rsvpScriptUrl;
}

type Result = { ok: boolean; error?: string; [key: string]: unknown };

export async function postToSheet(payload: Record<string, unknown>): Promise<Result> {
  const url = scriptUrl();
  if (!url) return { ok: false, error: "The Google Sheet is not connected yet." };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      cache: "no-store",
    });
    return (await res.json()) as Result;
  } catch {
    return { ok: false, error: "Could not reach the Google Sheet." };
  }
}
