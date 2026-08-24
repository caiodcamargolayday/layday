import { NextRequest, NextResponse } from "next/server";

// POST /api/anniversary-uluwatu-apply
// Forwards Uluwatu anniversary RSVP form answers to Google Apps Script → Google Sheets
export async function POST(req: NextRequest) {
  const APPS_SCRIPT_URL =
    process.env.ANNIVERSARY_ULUWATU_SHEETS_URL ||
    process.env.NEXT_PUBLIC_ANNIVERSARY_ULUWATU_SHEETS_URL ||
    process.env.ANNIVERSARY_SHEETS_URL;

  try {
    const body = await req.json();

    // Ensure phone number starts with ' so Google Sheets does not interpret +countryCode as a formula error
    let phoneStr = String(body.phone || body.whatsapp || "").trim();
    if (phoneStr && !phoneStr.startsWith("'")) {
      phoneStr = "'" + phoneStr;
    }

    const payload = {
      ...body,
      phone: phoneStr,
      venue: "Lay Day Uluwatu",
      location: body.location || "Lay Day Uluwatu (2nd Anniversary)",
      eventDate: "04.09.26",
    };

    if (APPS_SCRIPT_URL) {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn(`[Uluwatu Anniversary] Apps Script responded with ${res.status}`);
      }
    } else {
      console.log(
        "[Uluwatu Anniversary Apply] No ANNIVERSARY_ULUWATU_SHEETS_URL configured yet. Payload:",
        payload
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Uluwatu Anniversary Apply] Sheets submission error:", err);
    return NextResponse.json({ ok: true }); // Avoid breaking client flow if sheet fails
  }
}
