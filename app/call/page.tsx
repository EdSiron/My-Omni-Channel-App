"use client";

import { useState, useEffect } from "react";
import TwilioClientComponent from "../component/TwilioClientComponent";

const CallPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [isActive, setIsActive] = useState(false); // Call active state
  const [callDuration, setCallDuration] = useState(0); // in seconds
  const [message, setMessage] = useState("");

  const handleCall = async () => {
    setIsCalling(true);
    setMessage("Calling...");

    // Simulate the call initiation (replace this with actual call logic)
    const response = await fetch("/api/outbound", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: phoneNumber }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage(`Call initiated: ${data.sid}`);
      // Start the call timer after simulating call answered
      setIsActive(true);
    } else {
      setMessage(`Error: ${data.error}`);
      setIsCalling(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      const startTime = Date.now();
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  const handleHangUp = () => {
    setIsActive(false);
    setMessage("Call ended.");
    setIsCalling(false);
    setPhoneNumber(""); // Clear phone number after call ends
  };

  const handleNumberClick = (num: string) => {
    setPhoneNumber((prev) => prev + num);
  };

  const handleClear = () => {
    setPhoneNumber("");
  };

  return (
    <>
      <div>
        <TwilioClientComponent />
      </div>
      <div className="flex flex-col items-center p-5">
        <h1 className="text-2xl font-bold mb-4">Make a Call</h1>
        {!isCalling ? (
          <>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              readOnly // Prevent manual input during calling
              className="mb-4 w-80 h-12 text-center border border-gray-300 rounded-lg text-lg"
            />
            <div className="grid grid-cols-3 gap-3 mb-4">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => handleNumberClick(num)}
                    className="bg-gray-200 rounded-full h-16 w-16 text-lg hover:bg-gray-300 transition"
                  >
                    {num}
                  </button>
                )
              )}
              <button
                onClick={() => handleNumberClick("+")}
                className="bg-gray-200 rounded-full h-16 w-16 text-lg hover:bg-gray-300 transition"
              >
                +
              </button>
              <button
                onClick={handleCall}
                className="bg-green-500 text-white rounded-full h-16 w-16 text-lg flex items-center justify-center hover:bg-green-400 transition"
              >
                Call
              </button>
              <button
                onClick={handleClear}
                className="bg-gray-200 rounded-full h-16 w-16 text-lg hover:bg-gray-300 transition"
              >
                Clear
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-lg font-semibold">{message}</p>
            <p className="text-lg">Call Duration: {callDuration}s</p>
            <button
              onClick={handleHangUp}
              className="bg-red-500 text-white rounded-full h-12 w-32 mt-4 hover:bg-red-400 transition"
            >
              Hang Up
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CallPage;
