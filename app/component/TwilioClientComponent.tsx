"use client";

import React, { useState, useEffect } from "react";
import { Device } from "twilio-client";
import type {
  TwilioDeviceOptions,
  TwilioDeviceType,
} from "@/types/twilioTypes";

const TwilioClientComponent: React.FC = () => {
  const [device, setDevice] = useState<TwilioDeviceType | null>(null);
  const [connection, setConnection] = useState<any | null>(null);
  const [incomingCall, setIncomingCall] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);

  useEffect(() => {
    const setupDevice = async () => {
      try {
        const response = await fetch("/api/token");
        const data = await response.json();
        const { token } = data;

        const deviceOptions: TwilioDeviceOptions = {
          enableRingingState: true,
        };

        const newDevice = new Device(token, deviceOptions) as TwilioDeviceType;

        newDevice.on("incoming", (conn) => {
          setConnection(conn);
          setIncomingCall(true);
          setCallDuration(0);
        });

        newDevice.on("connect", (conn) => {
          setConnection(conn);
          setIncomingCall(false);
        });

        newDevice.on("disconnect", () => {
          setConnection(null);
          setIncomingCall(false);
          setCallDuration(0);
        });

        setDevice(newDevice);
      } catch (error) {
        console.error("Error setting up Twilio device:", error);
      }
    };

    setupDevice();

    return () => {
      if (device) {
        device.destroy();
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connection) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [connection]);

  const handleAccept = () => {
    if (connection) {
      connection.accept();
      setIncomingCall(false);
    }
  };

  const handleReject = () => {
    if (connection) {
      connection.reject();
      setConnection(null);
      setIncomingCall(false);
      setCallDuration(0);
    }
  };

  const handleDisconnect = () => {
    if (connection) {
      connection.disconnect();
      setConnection(null);
      setCallDuration(0);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      {(incomingCall || connection) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              {incomingCall ? "Incoming Call" : "Call in Progress"}
            </h3>
            <p className="text-2xl font-bold mb-4">
              {formatDuration(callDuration)}
            </p>
            {incomingCall ? (
              <div className="flex justify-between">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                  onClick={handleAccept}
                >
                  Answer
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                  onClick={handleReject}
                >
                  Reject
                </button>
              </div>
            ) : (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                onClick={handleDisconnect}
              >
                Hang up
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TwilioClientComponent;
