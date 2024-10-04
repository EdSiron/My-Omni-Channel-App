"use client";

import { useState } from "react";

export default function EmailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSuccessMessage(""); // Clear previous success message
    setErrorMessage(""); // Clear previous error message
    setIsLoading(true); // Set loading state to true

    const formData = new FormData();
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("text", text);
    attachments.forEach((file) => formData.append("attachments", file));

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        body: formData, // Send formData instead of JSON
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage(result.message); // Display success message
        setTo(""); // Clear recipient email field
        setSubject(""); // Clear subject field
        setText(""); // Clear text area
        setAttachments([]); // Clear attachments
        // Reset file input element to "No file chosen"
        (document.getElementById("attachments") as HTMLInputElement).value = "";
      } else {
        setErrorMessage(result.error); // Display error message
      }
    } catch (error) {
      setErrorMessage("An error occurred while sending the email.");
    } finally {
      setIsLoading(false); // Set loading state back to false
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-[80vh] p-4">
      <h1 className="text-2xl mb-4">Send an Email</h1>
      {/* Loading Message */}
      {isLoading && (
        <p className="text-blue-500 mb-4">Sending email to: {to}</p>
      )}
      {/* Success Message */}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      {/* Error Message */}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-full max-w-md"
      >
        <input
          type="email"
          placeholder="Recipient Email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Email Body"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        ></textarea>
        <input
          type="file"
          id="attachments"
          multiple
          onChange={(e) => setAttachments(Array.from(e.target.files!))}
          className="border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Email"}
        </button>
      </form>{" "}
    </main>
  );
}
