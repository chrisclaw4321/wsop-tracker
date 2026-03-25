export interface Tournament {
  id: number;
  eventNum: string;
  name: string;
  format: string; // NLH, PLO, Mixed, Bounty, etc.
  buyIn: number; // in euros
  rakeFee: number; // in euros
  currency: string;
  startDates: string[]; // e.g., ["Mar 31", "Apr 1", "Apr 2"]
  startTimes: string[]; // e.g., ["12:00 PM", "6:00 PM"]
  flights: number;
  gtd?: number; // guaranteed prize pool in euros
  startingStack?: number; // chip stack
  blindLevels?: string; // e.g., "10-minute" or "40-minute"
  isMultiday?: boolean;
  isBounty?: boolean;
  isTurbo?: boolean;
  description: string;
  location: string;
  // For expanded flights
  flightIndex?: number; // 0, 1, 2, etc. for which flight this is
  flightDate?: string; // specific date for this flight
  flightTime?: string; // specific time for this flight
}

export interface User {
  email: string;
  name: string;
  picture?: string;
}
