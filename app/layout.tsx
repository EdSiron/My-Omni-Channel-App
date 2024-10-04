"use client";

import { useState } from "react";
import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false); // State to manage the visibility of the hamburger menu

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false); // Close the menu
  };

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center relative">
          <h1 className="text-2xl">Omni-Channel App</h1>
          {/* Hamburger Icon */}
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none"
            aria-label="Toggle navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          {/* Navigation Links */}
          <div
            className={`${
              isOpen ? "block" : "hidden"
            } md:flex md:items-center absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent`}
          >
            <Link
              href="/chat"
              className="block md:inline-block p-2"
              onClick={closeMenu}
            >
              Chat
            </Link>
            <Link
              href="/call"
              className="block md:inline-block p-2"
              onClick={closeMenu}
            >
              Call
            </Link>
            <Link
              href="/email"
              className="block md:inline-block p-2"
              onClick={closeMenu}
            >
              Email
            </Link>
            <Link
              href="/email-inbox"
              className="block md:inline-block p-2"
              onClick={closeMenu}
            >
              Email Inbox
            </Link>
            <Link
              href="/sms"
              className="block md:inline-block p-2"
              onClick={closeMenu}
            >
              SMS
            </Link>
            <Link
              href="/login"
              className="block md:inline-block p-2"
              onClick={closeMenu}
            >
              Login
            </Link>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          © 2024 Omni-Channel App created by Ed Mark Angelo Siron
        </footer>
      </body>
    </html>
  );
}
