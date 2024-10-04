// app/api/sms-send/route.ts
import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function POST(req: Request) {
  const { to, body } = await req.json(); // Use req.json() to parse the request body

  try {
    const message = await client.messages.create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER, // Ensure this is set in your environment
      to: to,
    });

    return NextResponse.json(
      { message: "SMS sent successfully", sid: message.sid },
      { status: 200 }
    );
  } catch (error) {
    // Type assertion for error
    if (error instanceof Error) {
      console.error("Error sending SMS:", error.message);
      return NextResponse.json(
        { message: "Failed to send SMS", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { message: "Failed to send SMS", error: "Unknown error occurred." },
        { status: 500 }
      );
    }
  }
}
