"use client";

import { useEffect, useState, useRef } from "react";

// Define the structure of the email data
interface Email {
  id: number;
  header: {
    from: string;
    subject: string;
    date: string;
  };
  flags: string[];
  snippet: string;
  body: string;
  attachments?: { name: string; url: string }[];
}

export default function EmailInbox() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const emailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/fetch-emails");
        if (!response.ok) {
          throw new Error("Failed to fetch emails");
        }
        const data = await response.json();
        setEmails(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const handleEmailClick = (email: Email) => {
    const flags = Array.isArray(email.flags) ? email.flags : [];

    if (!flags.includes("\\Seen")) {
      flags.push("\\Seen");
      setEmails((prevEmails) =>
        prevEmails.map((e) => (e.id === email.id ? { ...e, flags } : e))
      );
    }

    setSelectedEmail(email);
  };

  const handleCloseEmail = () => {
    setSelectedEmail(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emailRef.current &&
        !emailRef.current.contains(event.target as Node)
      ) {
        handleCloseEmail();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-start h-[80vh] p-4 bg-gray-100">
      <h1 className="text-4xl mb-4 font-semibold text-gray-800">Inbox</h1>
      {loading && <p className="text-blue-500">Loading emails...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div
        className="flex flex-col w-full max-w-7xl overflow-y-auto"
        style={{ height: "70vh" }}
      >
        {emails.map((email) => {
          const flags = Array.isArray(email.flags) ? email.flags : [];
          const isUnread = !flags.includes("\\Seen");

          return (
            <div
              key={email.id}
              className={`flex items-center p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition duration-200 ${
                isUnread ? "font-semibold bg-white" : "font-normal bg-gray-50"
              }`}
              onClick={() => handleEmailClick(email)}
            >
              <div className="w-1/4 truncate pr-2">{email.header.from}</div>
              <div className="w-1/2 truncate pr-2">
                <span className="mr-2">{email.header.subject}</span>
                <span className="text-gray-500">- {email.snippet}</span>
              </div>
              <div className="w-1/4 text-right text-sm text-gray-500">
                {new Date(email.header.date).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          );
        })}
      </div>
      {selectedEmail && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div
            ref={emailRef}
            className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-3xl overflow-y-auto"
            style={{ height: "80vh" }}
          >
            <h2 className="text-2xl font-bold mb-2">
              {selectedEmail.header.subject}
            </h2>
            <p className="text-gray-600 mb-2">{selectedEmail.header.from}</p>
            <p className="text-gray-500 mb-4">
              {new Date(selectedEmail.header.date).toLocaleString()}
            </p>
            <div className="email-body mb-4">
              <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
            </div>
            {selectedEmail.attachments &&
              selectedEmail.attachments.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold">Attachments:</h3>
                  <ul className="list-disc ml-4">
                    {selectedEmail.attachments.map((attachment) => (
                      <li key={attachment.name}>
                        <a
                          href={attachment.url}
                          download={attachment.name}
                          className="text-blue-500 underline hover:text-blue-700"
                        >
                          {attachment.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            <button
              onClick={handleCloseEmail}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
