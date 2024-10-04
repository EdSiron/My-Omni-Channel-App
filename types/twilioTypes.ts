import { Device, Connection } from "twilio-client";

export interface TwilioDeviceOptions {
  edge?: string;
  enableIceRestart?: boolean;
  enableRingingState?: boolean;
  fakeLocalDTMF?: boolean;
  maxCallSignalingTimeoutMs?: number;
  region?: string;
  shouldPlayDisconnect?: () => boolean;
  sounds?: {
    [key: string]: string;
  };
}

export interface TwilioDevice {
  connect(params?: object): Promise<Connection>;
  disconnectAll(): void;
  destroy(): void; // Changed from Promise<void> to void
  on(event: string, callback: (...args: any[]) => void): void;
  // Add other methods and properties you need from Device
}

export type TwilioDeviceType = Device & TwilioDevice;
