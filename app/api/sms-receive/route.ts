import { NextResponse } from "next/server";
import { database } from "../../../lib/firebase"; // Adjust the import according to your file structure
import { ref, set } from "firebase/database";

export async function POST(req: Request) {
  try {
    // Log the request method and headers
    console.log("Request Method:", req.method);
    console.log("Request Headers:", req.headers);

    // Parse the incoming request body as FormData
    const formData = await req.formData();

    // Extract data from FormData
    const From = formData.get("From");
    const Body = formData.get("Body");

    // Check if From and Body are defined
    if (typeof From !== "string" || typeof Body !== "string") {
      console.error("Missing From or Body in the request");
      return NextResponse.json(
        { error: "Missing From or Body" },
        { status: 400 }
      );
    }

    console.log("Received SMS:", { From, Body });

    // Create a unique key for each message
    const messageKey = Date.now(); // You can use a better unique identifier if needed

    // Save the incoming message to Firebase
    await set(ref(database, `sms/${messageKey}`), {
      from: From,
      body: Body,
      seen: false, // Initial state of the message
      timestamp: messageKey, // Save the timestamp for sorting (optional)
    });

    // Respond with 200 OK
    return NextResponse.json({ message: "Message received" });
  } catch (error) {
    // Log the error for debugging
    console.error("Error receiving SMS:", error);

    // Respond with a 500 Internal Server Error
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Allow only POST method
export async function OPTIONS() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
