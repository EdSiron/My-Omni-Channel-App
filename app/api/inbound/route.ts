import { NextResponse } from "next/server";
import { twiml } from "twilio";

export async function POST(request: Request) {
  const response = new twiml.VoiceResponse();
  response.dial().client("browser-client");

  return new NextResponse(response.toString(), {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
