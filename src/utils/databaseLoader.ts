import { Tournament } from '../types';
import tournamentsData from '../data/tournaments.json';

export interface BraceletFlight {
  num: number;
  label: string;
  date: string;
  time: string;
}

export interface BraceletEvent {
  eventNum?: string;
  name: string;
  format: string;
  buyIn: number;
  rake: number;
  rakeNote?: string;
  startingStack?: number;
  blindLevels: {
    duration: number;
    durationNote?: string;
    startingBlinds: string;
  };
  gtd?: number;
  flights: BraceletFlight[];
  day2?: { date: string; time: string };
  day3?: { date: string; time: string };
  day4?: { date: string; time: string };
  day5?: { date: string; time: string };
  day6?: { date: string; time: string };
  flightNotes?: string;
  features: string[];
  description: string;
  sources: string[];
}

export interface SatelliteInstance {
  date: string;
  time: string;
  seatsGtd?: number;
}

export interface SatelliteEvent {
  name: string;
  format: string;
  buyIn: number;
  rake: number;
  startingStack: number;
  blindLevels: {
    duration: number;
    startingBlinds: string;
  };
  feedsTo: string;
  instances: SatelliteInstance[];
  description: string;
  sources: string[];
}

export interface SideEventInstance {
  date: string;
  time: string;
  note?: string;
}

export interface SideEvent {
  name: string;
  format: string;
  buyIn: number;
  rake: number;
  rakeNote?: string;
  buyInNote?: string;
  startingStack?: number;
  blindLevels: {
    duration: number;
    durationNote?: string;
    startingBlinds: string;
  };
  gtd?: number;
  instances: SideEventInstance[];
  features: string[];
  description: string;
  sources: string[];
}

export const loadTournamentsFromDatabase = (): Tournament[] => {
  const tournaments: Tournament[] = [];

  // Load bracelet events with flights expanded
  tournamentsData.braceletEvents.forEach((bracelet: any, braceletIndex: number) => {
    // Collect continuation days
    const continuationDays: { day: number; date: string; time: string }[] = [];
    for (let d = 2; d <= 6; d++) {
      const dayKey = `day${d}`;
      if (bracelet[dayKey]) {
        continuationDays.push({
          day: d,
          date: bracelet[dayKey].date,
          time: bracelet[dayKey].time,
        });
      }
    }

    bracelet.flights.forEach((flight: any, flightIndex: number) => {
      const totalBuyIn = bracelet.buyIn + (bracelet.rake || 0);
      tournaments.push({
        id: (braceletIndex + 1) + flightIndex / 1000,
        eventType: 'bracelet',
        ...(bracelet.eventNum ? { eventNum: bracelet.eventNum } : {}),
        name: bracelet.flights.length > 1
          ? `${bracelet.name} - Day ${flight.label}`
          : bracelet.name,
        format: bracelet.format,
        buyIn: totalBuyIn,
        rakeFee: bracelet.rake || 0,
        currency: '€',
        startDates: [flight.date],
        startTimes: [flight.time],
        flightDate: flight.date,
        flightTime: flight.time,
        flights: 1,
        location: 'King\'s Casino, Prague',
        startingStack: bracelet.startingStack,
        blindLevels: bracelet.blindLevels.durationNote
          ? `${bracelet.blindLevels.durationNote}, starting at ${bracelet.blindLevels.startingBlinds}`
          : `${bracelet.blindLevels.duration}-minute, starting at ${bracelet.blindLevels.startingBlinds}`,
        gtd: bracelet.gtd,
        isBounty: bracelet.features.includes('bounty'),
        isTurbo: bracelet.features.includes('turbo'),
        isMultiday: bracelet.features.includes('multiday'),
        description: bracelet.description,
        continuationDays: continuationDays.length > 0 ? continuationDays : undefined,
      });
    });
  });

  // Load satellite events - expand instances
  tournamentsData.satellites.forEach((satellite: any, satIndex: number) => {
    satellite.instances.forEach((instance: any, idx: number) => {
      tournaments.push({
        id: 100 + satIndex + idx / 1000,
        eventType: 'satellite',
        name: `${satellite.name}${instance.seatsGtd ? ` (${instance.seatsGtd} seats GTD)` : ''}`,
        format: satellite.format,
        buyIn: satellite.buyIn + (satellite.rake || 0),
        rakeFee: satellite.rake || 0,
        currency: '€',
        startDates: [instance.date],
        startTimes: [instance.time],
        flightDate: instance.date,
        flightTime: instance.time,
        flights: 1,
        location: 'King\'s Casino, Prague',
        startingStack: satellite.startingStack,
        blindLevels: `${satellite.blindLevels.duration}-minute, starting at ${satellite.blindLevels.startingBlinds}`,
        description: satellite.description,
      });
    });
  });

  // Load side events - expand instances
  tournamentsData.sideEvents.forEach((side: any, sideIndex: number) => {
    side.instances.forEach((instance: any, idx: number) => {
      const totalBuyIn = side.buyIn + (side.rake || 0);
      tournaments.push({
        id: 200 + sideIndex + idx / 1000,
        eventType: 'side',
        name: instance.note ? `${side.name} - ${instance.note}` : side.name,
        format: side.format,
        buyIn: totalBuyIn,
        rakeFee: side.rake || 0,
        currency: '€',
        startDates: [instance.date],
        startTimes: [instance.time],
        flightDate: instance.date,
        flightTime: instance.time,
        flights: 1,
        runsPerDay: 1,
        gtd: side.gtd,
        location: 'King\'s Casino, Prague',
        startingStack: side.startingStack,
        blindLevels: side.blindLevels.durationNote
          ? `${side.blindLevels.durationNote}, starting at ${side.blindLevels.startingBlinds}`
          : `${side.blindLevels.duration}-minute, starting at ${side.blindLevels.startingBlinds}`,
        isBounty: side.features?.includes('bounty') || false,
        isTurbo: side.features?.includes('turbo') || side.features?.includes('hyper-turbo') || false,
        description: side.description,
      });
    });
  });

  return tournaments;
};
