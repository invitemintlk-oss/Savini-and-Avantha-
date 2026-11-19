import { postToSheet } from "@/lib/sheet";

// Saves a new wish to the "Wishes" tab.
export async function POST(req: Request) {
  let body: { name?: string; message?: string; invitedAs?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  if (!name || !message) return Response.json({ ok: false, error: "Name and message are required." }, { status: 400 });
  if (message.length > 500) return Response.json({ ok: false, error: "Please keep your wish under 500 characters." }, { status: 400 });

  const result = await postToSheet({ type: "wish", name, message, invitedAs: body.invitedAs });
  return Response.json(result, { status: result.ok ? 200 : 502 });
}
