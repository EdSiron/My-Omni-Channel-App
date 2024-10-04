"use client";

import { useEffect, useState } from "react";

interface Message {
  from: string;
  body: string;
  seen: boolean;
}

const Sms = () => {
  const [to, setTo] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<string>("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Function to send SMS
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/sms-send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, body }),
    });

    const data = await response.json();
    if (response.ok) {
      setStatus("SMS sent successfully!");
      // Do not add the sent message to the inbox
      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   { from: process.env.TWILIO_PHONE_NUMBER!, body, seen: true },
      // ]);
      setBody("");
      setTo("");

      // Automatically clear the status after 3 seconds
      setTimeout(() => {
        setStatus("");
      }, 3000);
    } else {
      setStatus(`Error: ${data.message}`);
      // Automatically clear the status after 3 seconds
      setTimeout(() => {
        setStatus("");
      }, 3000);
    }
  };

  // Fetch received messages from Firebase
  const fetchReceivedMessages = async () => {
    try {
      const response = await fetch("/api/get-sms");
      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages);
      } else {
        console.error("Error fetching messages:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchReceivedMessages();
  }, []);

  // Handle message click to show details
  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    // Update seen status locally
    const updatedMessages = messages.map((msg) =>
      msg === message ? { ...msg, seen: true } : msg
    );
    setMessages(updatedMessages);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl flex flex-col lg:flex-row">
      {/* Write Message Section */}
      <div className="flex-1 mb-4 lg:mb-0 lg:mr-4">
        <h1 className="text-3xl font-semibold mb-4">Send SMS</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Recipient's Phone Number"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            placeholder="Message"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            Send SMS
          </button>
        </form>
        {status && <p className="mt-4 text-green-500 text-center">{status}</p>}
      </div>

      {/* Inbox Section */}
      <div className="flex-1 max-h-[80vh]">
        <h2 className="text-xl font-semibold mb-4">Received Messages</h2>
        <ul className="space-y-2">
          {messages.map((message, index) => (
            <li
              key={index}
              onClick={() => handleMessageClick(message)}
              className={`cursor-pointer p-3 rounded border ${
                message.seen
                  ? "bg-gray-100 border-gray-300"
                  : "bg-yellow-200 border-yellow-400"
              } transition hover:bg-gray-200`}
            >
              <div>
                <strong>From:</strong> {message.from}
              </div>
              <div>{message.body.substring(0, 30)}...</div>
              {!message.seen && <span className="text-red-500">(New)</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for displaying message details */}
      {selectedMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-2">Message Details</h2>
            <div className="mb-4">
              <strong>From:</strong> {selectedMessage.from}
            </div>
            <div className="mb-4">
              <strong>Message:</strong> {selectedMessage.body}
            </div>
            <button
              onClick={closeModal}
              className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sms;
