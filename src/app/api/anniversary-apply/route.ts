import { NextRequest, NextResponse } from "next/server";

// POST /api/anniversary-apply
// Forwards form answers to Google Apps Script → Google Sheets
export async function POST(req: NextRequest) {
  const APPS_SCRIPT_URL =
    process.env.ANNIVERSARY_SHEETS_URL ||
    process.env.NEXT_PUBLIC_ANNIVERSARY_SHEETS_URL;

  try {
    const body = await req.json();
    
    // Ensure phone number starts with ' so Google Sheets does not interpret +countryCode as a formula error
    let phoneStr = String(body.phone || "").trim();
    if (phoneStr && !phoneStr.startsWith("'")) {
      phoneStr = "'" + phoneStr;
    }

    const payload = {
      ...body,
      phone: phoneStr,
    };

    if (APPS_SCRIPT_URL) {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn(`Apps Script responded with ${res.status}`);
      }
    } else {
      console.log("[Anniversary Apply] No ANNIVERSARY_SHEETS_URL configured yet. Payload:", body);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Sheets submission error:", err);
    return NextResponse.json({ ok: true }); // Avoid breaking client flow if sheet fails
  }
}
