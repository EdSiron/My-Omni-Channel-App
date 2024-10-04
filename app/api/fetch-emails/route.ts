import { NextResponse } from "next/server";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

// Define your IMAP configuration
const imapConfig = {
  auth: {
    user: process.env.EMAIL_USER as string, // Your email address
    pass: process.env.EMAIL_PASS as string, // Your email password
  },
  host: "imap.gmail.com", // Gmail IMAP host
  port: 993, // IMAP port for Gmail
  secure: true, // Use SSL
};

export async function GET() {
  const client = new ImapFlow(imapConfig);
  const emails: any[] = []; // Array to store email data

  try {
    await client.connect(); // Connect to the IMAP server
    console.log("Connected to Gmail");

    // Open the inbox
    await client.mailboxOpen("INBOX"); // Open the INBOX

    // Get the total number of messages
    const mailbox = await client.mailboxOpen("INBOX");
    const totalMessages = mailbox.exists; // Get the total number of emails

    // Fetch the 5 most recent emails
    const start = Math.max(1, totalMessages - 4); // Start fetching from the most recent message
    const fetchedMessages = await client.fetch(`${start}:${totalMessages}`, {
      envelope: true, // Fetch envelope information (from, subject, date)
      flags: true, // Fetch message flags (seen, answered, etc.)
      source: true, // Fetch the email source to get snippets
    });

    for await (let message of fetchedMessages) {
      // Parse the full source to get email content
      const parsed = await simpleParser(message.source.toString());

      // Process attachments
      const attachments = parsed.attachments
        .map((att) => ({
          name: att.filename,
          url: att.contentId
            ? `data:${att.contentType};base64,${att.content.toString("base64")}`
            : null, // Generate a base64 URL for inline attachments
        }))
        .filter((att) => att.url !== null); // Filter out null URLs

      emails.push({
        id: message.uid, // Ensure you have a unique identifier
        header: {
          from: message.envelope.from[0]?.address || "", // Sender's email
          subject: message.envelope.subject || "", // Email subject
          date: message.envelope.date.toISOString(), // Email date
        },
        flags: Array.isArray(message.flags) ? message.flags : [], // Ensure flags is an array
        body: parsed.html || parsed.text || "", // Full email body (fallback to empty string if undefined)
        attachments, // Attachments array
        snippet: parsed.text?.substring(0, 100) || "", // Snippet of the email body
      });
    }

    // Sort emails by date in descending order (latest first)
    emails.sort(
      (a, b) =>
        new Date(b.header.date).getTime() - new Date(a.header.date).getTime()
    );

    return NextResponse.json(emails); // Return emails as JSON response
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  } finally {
    await client.logout(); // Logout from the IMAP server
  }
}
