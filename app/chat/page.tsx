"use client";

import { useEffect, useState, useRef } from "react";
import { onValue, ref, push } from "firebase/database";
import { database, auth, storage } from "@/lib/firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

type Message = {
  text: string;
  sender: string;
  timestamp: string;
  attachmentUrl?: string;
  attachmentType?: string;
  attachmentName?: string;
};

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const messagesRef = ref(database, "messages");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedMessages: Message[] = Object.values(data);
        setMessages(formattedMessages);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Display success message on login/register
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const successMessage = queryParams.get("success");

    if (successMessage) {
      setSuccessMessage(
        successMessage === "login"
          ? "Login successful!"
          : "Registration successful!"
      );
      setTimeout(() => setSuccessMessage(""), 3000); // Hide after 3 seconds
    }
  }, []);

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };

  const uploadAttachment = async (
    file: File
  ): Promise<{ url: string; type: string; name: string } | undefined> => {
    if (!file) return undefined;

    const attachmentRef = storageRef(storage, `attachments/${file.name}`);

    try {
      await uploadBytes(attachmentRef, file);
      const url = await getDownloadURL(attachmentRef);
      return { url, type: file.type, name: file.name };
    } catch (error) {
      console.error("Error uploading attachment:", error);
      setErrorMessage("Failed to upload attachment. Please try again.");
      return undefined;
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user && (message.trim() !== "" || attachment)) {
      const attachmentData = attachment
        ? await uploadAttachment(attachment)
        : undefined;

      const newMessage: Message = {
        text: message,
        sender: user.email || "Anonymous",
        timestamp: new Date().toISOString(),
        attachmentUrl: attachmentData?.url || "",
        attachmentType: attachmentData?.type || "",
        attachmentName: attachmentData?.name || "",
      };

      try {
        await push(ref(database, "messages"), newMessage);
        setSuccessMessage("Message sent successfully!");
        setMessage("");
        setAttachment(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => setSuccessMessage(""), 3000); // Hide success after 3 seconds
      } catch (error) {
        setErrorMessage("Failed to send message. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
      setErrorMessage("Failed to logout. Please try again.");
    }
  };

  const isMessageEmpty = message.trim() === "" && !attachment;

  return (
    <div className="flex flex-col h-[80vh] max-w-full bg-gray-100">
      <div className="flex justify-between p-4 bg-white shadow">
        <div>Hi {auth.currentUser?.email}</div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, idx) => {
          const isCurrentUser =
            msg.sender === (auth.currentUser?.email || "Anonymous");
          return (
            <div
              key={idx}
              className={`flex flex-col mb-4 ${
                isCurrentUser ? "items-end" : "items-start"
              }`}
            >
              <span className="text-xs text-gray-500 mb-1">
                {isCurrentUser ? "You" : msg.sender}
              </span>
              <div
                className={`max-w-xs ${
                  isCurrentUser ? "bg-blue-500 text-white" : "bg-white"
                } rounded-lg shadow-md overflow-hidden`}
              >
                <div className="p-3">
                  <p>{msg.text}</p>
                  {msg.attachmentUrl && (
                    <div className="mt-2">
                      {msg.attachmentType?.startsWith("image/") ? (
                        <img
                          src={msg.attachmentUrl}
                          alt="attachment"
                          className="max-w-full h-auto rounded"
                        />
                      ) : (
                        <a
                          href={msg.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Attachment - {msg.attachmentName}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="bg-white border-t p-4">
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 w-9/12 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <label className="cursor-pointer bg-gray-200 px-4 py-2 border-t border-r border-b rounded-none hover:bg-gray-300">
            <input
              type="file"
              onChange={handleAttachmentChange}
              className="hidden"
              ref={fileInputRef}
            />
            📎
          </label>
          <button
            type="submit"
            disabled={isMessageEmpty}
            className={`px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isMessageEmpty
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Send
          </button>
        </div>
        {attachment && (
          <div className="text-sm text-gray-600 mt-1">
            Attachment: {attachment.name}
            <button
              type="button"
              onClick={() => {
                setAttachment(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatPage;
