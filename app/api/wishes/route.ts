import { getFromSheet, postToSheet } from "@/lib/sheet";

export const dynamic = "force-dynamic";

// Lists wishes from the "Wishes" tab (rows whose Show column is "No" are hidden).
export async function GET() {
  const result = await getFromSheet("wishes");
  if (!result.ok) return Response.json({ ok: false, wishes: [], error: result.error }, { status: 502 });
  return Response.json({ ok: true, wishes: Array.isArray(result.wishes) ? result.wishes : [] });
}

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
