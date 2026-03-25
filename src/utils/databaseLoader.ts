import { Tournament } from '../types';
import tournamentsData from '../data/tournaments.json';

export interface BraceletEvent {
  id: number;
  eventNum: string;
  name: string;
  format: string;
  buyIn: number;
  rake: number;
  startingStack?: number;
  blindLevels: {
    duration: number;
    startingBlinds: string;
  };
  gtd?: number;
  flights: Array<{
    num: number;
    date: string;
    time: string;
  }>;
  features: string[];
  description: string;
  sources: string[];
}

export interface SatelliteEvent {
  id: number;
  satNum: string;
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
  startDate: string;
  endDate: string;
  startTime: string;
  description: string;
  sources: string[];
}

export interface SideEvent {
  id: number;
  sideNum: string;
  name: string;
  format: string;
  buyIn: number;
  rake: number;
  startingStack?: number;
  blindLevels: {
    duration: number;
    startingBlinds: string;
  };
  gtd?: number;
  schedule: Array<{
    time: string;
    runsDates: string;
  }>;
  description: string;
  sources: string[];
}

export const loadTournamentsFromDatabase = (): Tournament[] => {
  const tournaments: Tournament[] = [];

  // Load bracelet events with flights expanded
  tournamentsData.braceletEvents.forEach((bracelet: BraceletEvent) => {
    bracelet.flights.forEach((flight, flightIndex) => {
      tournaments.push({
        id: bracelet.id + flightIndex / 1000,
        eventNum: bracelet.eventNum,
        name: bracelet.flights.length > 1 ? `${bracelet.name} - Flight ${flight.num}` : bracelet.name,
        format: bracelet.format,
        buyIn: bracelet.buyIn,
        rakeFee: bracelet.rake,
        currency: '€',
        startDates: [flight.date],
        startTimes: [flight.time],
        flightDate: flight.date,
        flightTime: flight.time,
        flights: 1,
        location: 'King\'s Casino, Prague',
        startingStack: bracelet.startingStack,
        blindLevels: `${bracelet.blindLevels.duration}-minute, starting at ${bracelet.blindLevels.startingBlinds}`,
        gtd: bracelet.gtd,
        isBounty: bracelet.features.includes('bounty'),
        isTurbo: bracelet.features.includes('turbo'),
        isMultiday: bracelet.features.includes('multiday'),
        description: bracelet.description,
      });
    });
  });

  // Load satellite events - already expanded by time in database
  tournamentsData.satellites.forEach((satellite: SatelliteEvent) => {
    tournaments.push({
      id: satellite.id,
      eventNum: satellite.satNum,
      name: satellite.name,
      format: satellite.format,
      buyIn: satellite.buyIn,
      rakeFee: satellite.rake,
      currency: '€',
      startDates: [satellite.startDate],
      startTimes: [satellite.startTime],
      flightDate: satellite.startDate,
      flightTime: satellite.startTime,
      flights: 1,
      location: 'King\'s Casino, Prague',
      startingStack: satellite.startingStack,
      blindLevels: `${satellite.blindLevels.duration}-minute, starting at ${satellite.blindLevels.startingBlinds}`,
      description: satellite.description,
    });
  });

  // Load side events - expand by schedule time
  tournamentsData.sideEvents.forEach((side: SideEvent) => {
    side.schedule.forEach((scheduleTime, scheduleIndex) => {
      const [startDate, endDate] = scheduleTime.runsDates.split(' to ').length === 2 
        ? scheduleTime.runsDates.split(' to ') 
        : [scheduleTime.runsDates.split(',')[0] || scheduleTime.runsDates, null];
      
      tournaments.push({
        id: side.id + scheduleIndex / 1000,
        eventNum: side.sideNum,
        name: `${side.name} @ ${scheduleTime.time}`,
        format: side.format,
        buyIn: side.buyIn,
        rakeFee: side.rake,
        currency: '€',
        startDates: [startDate.trim()],
        startTimes: [scheduleTime.time],
        flightDate: startDate.trim(),
        flightTime: scheduleTime.time,
        flights: 1,
        runsPerDay: 1,
        gtd: side.gtd,
        location: 'King\'s Casino, Prague',
        startingStack: side.startingStack,
        blindLevels: `${side.blindLevels.duration}-minute, starting at ${side.blindLevels.startingBlinds}`,
        isBounty: side.format.includes('Bounty'),
        isTurbo: side.format.includes('Turbo'),
        description: side.description,
      });
    });
  });

  return tournaments;
};
