import { Tournament } from '../types';
import tournamentsData from '../data/tournaments.json';

export interface BraceletFlight {
  num: number;
  label: string;
  date: string;
  time: string;
}

export interface BraceletEvent {
  id: number;
  eventNum: string;
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
  id: number;
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
  id: number;
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
  tournamentsData.braceletEvents.forEach((bracelet: any) => {
    bracelet.flights.forEach((flight: any, flightIndex: number) => {
      const totalBuyIn = bracelet.buyIn + (bracelet.rake || 0);
      tournaments.push({
        id: bracelet.id + flightIndex / 1000,
        eventNum: bracelet.eventNum,
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
      });
    });
  });

  // Load satellite events - expand instances
  tournamentsData.satellites.forEach((satellite: any) => {
    satellite.instances.forEach((instance: any, idx: number) => {
      tournaments.push({
        id: satellite.id + idx / 1000,
        eventNum: `SAT-${satellite.id - 100}`,
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
  tournamentsData.sideEvents.forEach((side: any) => {
    side.instances.forEach((instance: any, idx: number) => {
      const totalBuyIn = side.buyIn + (side.rake || 0);
      tournaments.push({
        id: side.id + idx / 1000,
        eventNum: `SIDE-${side.id - 200}`,
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
