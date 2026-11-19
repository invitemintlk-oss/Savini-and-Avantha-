import { postToSheet } from "@/lib/sheet";

// Forwards RSVP submissions to the Apps Script web app, which writes them to the "RSVP" tab.
export async function POST(req: Request) {
  let body: { name?: string; attending?: string; guests?: number; invitedAs?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!body.name?.trim() || (body.attending !== "yes" && body.attending !== "no")) {
    return Response.json({ ok: false, error: "Name and attendance are required." }, { status: 400 });
  }

  const result = await postToSheet({
    type: "rsvp",
    name: body.name,
    attending: body.attending,
    guests: body.guests,
    invitedAs: body.invitedAs,
  });
  return Response.json(result, { status: result.ok ? 200 : 502 });
}
