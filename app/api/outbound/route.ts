// app/api/outbound/route.ts

import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Ensure environment variables are defined
if (!accountSid || !authToken || !twilioPhoneNumber) {
  throw new Error("Missing Twilio environment variables");
}

// Create Twilio client
const twilioClient = twilio(accountSid, authToken);

export async function POST(request: Request) {
  const { to } = await request.json();

  try {
    const call = await twilioClient.calls.create({
      to,
      from: twilioPhoneNumber as string, // Explicitly cast to string
      url: "https://handler.twilio.com/twiml/EH38071fb36e9db09e8c9fe22e7aa21766",
    });

    return NextResponse.json({ sid: call.sid }, { status: 200 });
  } catch (error) {
    console.error("Error making the call:", error);
    return NextResponse.json(
      { error: "Failed to make the call" },
      { status: 500 }
    );
  }
}
