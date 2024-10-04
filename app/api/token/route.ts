import { NextResponse } from "next/server";
import twilio from "twilio";

export async function GET() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return NextResponse.json(
      { error: "Twilio credentials are not set" },
      { status: 500 }
    );
  }

  const capability = new twilio.jwt.ClientCapability({
    accountSid,
    authToken,
  });

  const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

  if (!twimlAppSid) {
    return NextResponse.json(
      { error: "TwiML App SID is not set" },
      { status: 500 }
    );
  }

  capability.addScope(
    new twilio.jwt.ClientCapability.IncomingClientScope("browser-client")
  );
  capability.addScope(
    new twilio.jwt.ClientCapability.OutgoingClientScope({
      applicationSid: twimlAppSid,
    })
  );

  const token = capability.toJwt();

  return NextResponse.json({ token });
}
