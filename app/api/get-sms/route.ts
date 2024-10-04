// app/api/get-sms/route.ts
import { NextResponse } from "next/server";
import { database } from "../../../lib/firebase"; // Adjust the import according to your file structure
import { ref, get } from "firebase/database";

export async function GET(req: Request) {
  try {
    const smsRef = ref(database, "sms"); // Create a reference to the 'sms' node
    const snapshot = await get(smsRef);

    if (!snapshot.exists()) {
      console.log("No messages found in the database.");
      return NextResponse.json({ messages: [] });
    }

    const messages: { from: string; body: string; seen: boolean }[] = [];
    snapshot.forEach((childSnapshot) => {
      const message = childSnapshot.val();
      messages.push({
        from: message.from || "Unknown", // Fallback to 'Unknown' if 'from' is missing
        body: message.body || "", // Fallback to empty string if 'body' is missing
        seen: message.seen || false, // Default to false if 'seen' is missing
      });
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Error fetching messages" },
      { status: 500 }
    );
  }
}
