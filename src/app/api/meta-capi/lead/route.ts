import { NextResponse } from 'next/server';
import { buildLeadEvent, sendToMetaCAPI } from '@/lib/metaCapi';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      eventSourceUrl, 
      fbp, 
      fbc, 
      email, 
      phone, 
      firstName, 
      lastName, 
      origin, 
      contentName,
      testEventCode 
    } = body;

    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    const clientUserAgent = req.headers.get('user-agent');
    const eventId = crypto.randomUUID();

    const event = buildLeadEvent({
      eventId,
      eventSourceUrl: eventSourceUrl || req.url,
      clientIp,
      clientUserAgent,
      fbp,
      fbc,
      email,
      phone,
      firstName,
      lastName,
      contentName: contentName || '11 Years Lay Day Anniversary - Lead',
    });

    await sendToMetaCAPI([event], origin || 'anniversary', testEventCode || null);

    return NextResponse.json({ success: true, eventId });
  } catch (error: any) {
    console.error('Lead event error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
