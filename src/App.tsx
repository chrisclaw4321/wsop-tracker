import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import TournamentList from './components/TournamentList';
import { Tournament, User } from './types';
import { Calendar, Trophy, LogOut } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '152840809437-f5g8e4st3hae8obeafinge3g233os3fb.apps.googleusercontent.com';
const AUTHORIZED_EMAIL = 'sazan4321@gmail.com';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load tournaments data
    loadTournaments();
    
    // Restore user session from localStorage
    const savedUser = localStorage.getItem('wsop_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to restore user session:', e);
      }
    }
  }, []);

  const expandFlights = (tournaments: Tournament[]): Tournament[] => {
    const expanded: Tournament[] = [];
    tournaments.forEach((t) => {
      // ONLY expand bracelet events (id 1-15) with actual flights
      // Satellites (id 101+) and side events (id 201+) are NOT expanded - they show runs per day
      if (t.id >= 1 && t.id <= 15 && t.flights > 1) {
        // Expand bracelet events into multiple flight entries
        for (let i = 0; i < t.flights; i++) {
          const flightDate = t.startDates[i] || t.startDates[0];
          const flightTime = t.startTimes[i] || t.startTimes[0];
          const flightNum = i + 1;
          
          expanded.push({
            ...t,
            id: t.id + (i / 1000), // Create unique id for each flight
            flightIndex: i,
            flightDate,
            flightTime,
            name: `${t.name} - Flight ${flightNum}` // Add flight number to name
          });
        }
      } else {
        // Single flight or satellites/side events - add as-is with flight info
        expanded.push({
          ...t,
          flightIndex: 0,
          flightDate: t.startDates[0],
          flightTime: t.startTimes[0]
        });
      }
    });
    return expanded;
  };

  const loadTournaments = () => {
    // WSOP Europe Prague 2026 - Complete tournament schedule
    // 15 Bracelet Events + Satellites + Side Events (all happening at King's Casino Prague)
    const data: Tournament[] = [
      // ===== BRACELET EVENTS (15) =====
      {
        id: 1,
        eventNum: '1',
        name: 'The Opener Mystery Bounty',
        format: 'NLH + Bounty',
        buyIn: 1100,
        rakeFee: 100,
        currency: '€',
        startDates: ['Mar 31', 'Apr 1', 'Apr 1', 'Apr 2'],
        startTimes: ['12:00 PM', '2:00 PM', '6:00 PM', '12:00 PM'],
        flights: 4,
        location: 'King\'s Casino, Prague',
        startingStack: 25000,
        blindLevels: '20-minute, starting at 25/50',
        isBounty: true,
        description: 'Four-flight opening tournament with mystery bounty component. Perfect entry-level WSOPE bracelet event. In-person at King\'s Casino Prague.'
      },
      {
        id: 2,
        eventNum: '2',
        name: 'Mixed PLO / PLO8 / Big O',
        format: 'Mixed PLO',
        buyIn: 3300,
        rakeFee: 300,
        currency: '€',
        startDates: ['Mar 31'],
        startTimes: ['2:00 PM'],
        flights: 1,
        location: 'King\'s Casino, Prague',
        startingStack: 40000,
        blindLevels: '40-minute, starting at 100/200 (200BB)',
        description: 'Variant mix: PLO → PLO8 → Big O. Ideal for experienced Omaha specialists. In-person event at King\'s Casino Prague.'
      },
      {
        id: 3,
        eventNum: '3',
        name: 'COLOSSUS NLH',
        format: 'NLH',
        buyIn: 565,
        rakeFee: 50,
        currency: '€',
        startDates: ['Apr 2', 'Apr 2'],
        startTimes: ['12:00 PM', '6:00 PM'],
        flights: 2,
        location: 'King\'s Casino, Prague',
        startingStack: 20000,
        blindLevels: '15-minute, starting at 25/50',
        description: 'The low buy-in, high-volume event. Budget-friendly bracelet opportunity with large fields. In-person at King\'s Casino Prague.'
      },
      {
        id: 4,
        eventNum: '4',
        name: 'PLOSSUS Bounty',
        format: 'PLO + Bounty',
        buyIn: 565,
        rakeFee: 50,
        currency: '€',
        startDates: ['Apr 3', 'Apr 3'],
        startTimes: ['12:00 PM', '6:00 PM'],
        flights: 2,
        location: 'King\'s Casino, Prague',
        startingStack: 50000,
        blindLevels: '20-minute, starting at 50/100 (250BB)',
        isBounty: true,
        description: 'The Colossus meets PLO with bounty component. Fantastic for aggressive action players. In-person at King\'s Casino Prague.'
      },
      {
        id: 5,
        eventNum: '5',
        name: 'Europe Main Event',
        format: 'NLH',
        buyIn: 5300,
        rakeFee: 300,
        currency: '€',
        startDates: ['Apr 3', 'Apr 4', 'Apr 5'],
        startTimes: ['12:00 PM', '12:00 PM', '12:00 PM'],
        flights: 3,
        gtd: 10000000,
        location: 'King\'s Casino, Prague',
        startingStack: 5000,
        blindLevels: '10-minute, starting at 50/100',
        isMultiday: true,
        description: '€10,000,000 GUARANTEED - The most prestigious event. Largest prize pool guarantee in European poker history. 130min late reg, unlimited re-entries. In-person at King\'s Casino Prague.'
      },
      {
        id: 6,
        eventNum: '6',
        name: 'Ladies Championship',
        format: 'NLH',
        buyIn: 1000,
        rakeFee: 90,
        currency: '€',
        startDates: ['Apr 4'],
        startTimes: ['12:00 PM'],
        flights: 1,
        location: 'King\'s Casino, Prague',
        startingStack: 25000,
        blindLevels: '30-minute, starting at 25/50 (250BB)',
        description: 'FIRST-EVER Ladies event at WSOPE. Confirmed players: Vanessa Kade, Leo Margets, Kitty Kuo, Mackenzie Dern. Custom gemstone bracelet for winner. In-person at King\'s Casino Prague.'
      },
      {
        id: 7,
        eventNum: '7',
        name: 'Turbo Bounty NLH',
        format: 'NLH Turbo + Bounty',
        buyIn: 2200,
        rakeFee: 200,
        currency: '€',
        startDates: ['Apr 5'],
        startTimes: ['2:00 PM'],
        flights: 1,
        location: 'King\'s Casino, Prague',
        startingStack: 30000,
        blindLevels: '12-minute, starting at 50/100',
        isTurbo: true,
        isBounty: true,
        description: 'Fast-paced turbo format combined with bounties. 12-minute levels, aggressive action. In-person at King\'s Casino Prague.'
      },
      {
        id: 8,
        eventNum: '8',
        name: 'MONSTER STACK NLH',
        format: 'NLH',
        buyIn: 1650,
        rakeFee: 150,
        currency: '€',
        startDates: ['Apr 6'],
        startTimes: ['2:00 PM'],
        flights: 1,
        location: 'King\'s Casino, Prague',
        startingStack: 50000,
        blindLevels: '30-minute, starting at 25/50',
        description: 'Large starting stack (50k chips) = deep-stacked play. Positional, thoughtful poker. In-person at King\'s Casino Prague.'
      },
      {
        id: 9,
        eventNum: '9',
        name: 'PLO European Championship',
        format: 'PLO',
        buyIn: 5300,
        rakeFee: 300,
        currency: '€',
        startDates: ['Apr 6'],
        startTimes: ['4:00 PM'],
        flights: 1,
        location: 'King\'s Casino, Prague',
        startingStack: 60000,
        blindLevels: '40-minute, starting at 100/200',
        description: 'Deep-stacked PLO championship. For experienced four-card players. High roller prestige. In-person at King\'s Casino Prague.'
      },
      {
        id: 10,
        eventNum: '10',
        name: 'Rounder Cup (EU vs. World)',
        format: 'NLH',
        buyIn: 2750,
        rakeFee: 250,
        currency: '€',
        startDates: ['Apr 7', 'Apr 7'],
        startTimes: ['12:00 PM', '6:00 PM'],
        flights: 2,
        location: 'King\'s Casino, Prague',
        startingStack: 40000,
        blindLevels: '20-minute, starting at 50/100',
        description: 'Ryder Cup-style team competition. EU vs. Rest of World. Unique format, social element. In-person at King\'s Casino Prague.'
      },
      {
        id: 11,
        eventNum: '11',
        name: 'Super High Roller NLH',
        format: 'NLH',
        buyIn: 20800,
        rakeFee: 1200,
        currency: '€',
        startDates: ['Apr 8'],
        startTimes: ['2:00 PM'],
        flights: 1,
        location: 'King\'s Casino, Prague',
        startingStack: 100000,
        blindLevels: '30-minute, starting at 500/1000',
        description: 'Elite poker. €20,800 buy-in attracts world\'s best. Deep stacks, slow blinds, maximum prestige. In-person at King\'s Casino Prague.'
      },
      {
        id: 12,
        eventNum: '12',
        name: 'European Circuit Championship',
        format: 'NLH',
        buyIn: 1500,
        rakeFee: 135,
        currency: '€',
        startDates: ['Apr 8', 'Apr 8', 'Apr 9', 'Apr 9'],
        startTimes: ['12:00 PM', '6:00 PM', '12:00 PM', '6:00 PM'],
        flights: 4,
        gtd: 1500000,
        location: 'King\'s Casino, Prague',
        startingStack: 35000,
        blindLevels: '20-minute, starting at 50/100',
        description: '€1,500,000 GTD - The "Mini Main Event". NEW EVENT. Four flights provide flexibility. Golden ring, golden jacket. In-person at King\'s Casino Prague.'
      },
      {
        id: 13,
        eventNum: '13',
        name: 'GGMillion$ High Roller NLH',
        format: 'NLH',
        buyIn: 8400,
        rakeFee: 600,
        currency: '€',
        startDates: ['Apr 9'],
        startTimes: ['2:00 PM'],
        flights: 1,
        location: 'King\'s Casino, Prague',
        startingStack: 75000,
        blindLevels: '60-minute, starting at 250/500',
        description: 'GGPoker-sponsored high roller. Named after GGMillion$ online series. Premium field, premium results. In-person at King\'s Casino Prague.'
      },
      {
        id: 14,
        eventNum: '14',
        name: 'PLO Double Board Bomb Pot',
        format: 'PLO',
        buyIn: 1100,
        rakeFee: 100,
        currency: '€',
        startDates: ['Apr 10'],
        startTimes: ['12:00 PM'],
        flights: 1,
        location: 'King\'s Casino, Prague',
        startingStack: 25000,
        blindLevels: '30-minute, starting at 25/50',
        description: 'NEW AT WSOPE - Double board bomb pot format popularized by high-stakes streams. Four-card chaos, recreational-friendly. In-person at King\'s Casino Prague.'
      },
      {
        id: 15,
        eventNum: '15',
        name: 'The Closer Turbo Bounty',
        format: 'NLH Turbo + Bounty',
        buyIn: 2750,
        rakeFee: 250,
        currency: '€',
        startDates: ['Apr 10'],
        startTimes: ['2:00 PM'],
        flights: 1,
        location: 'King\'s Casino, Prague',
        startingStack: 30000,
        blindLevels: '12-minute, starting at 50/100',
        isTurbo: true,
        isBounty: true,
        description: 'Final bracelet event of the series (Presented by GGPoker). Fast turbo + bounty hunting. Ending on a high note. In-person at King\'s Casino Prague.'
      }
    ];

    // ===== SATELLITE TOURNAMENTS (Running throughout series) =====
    // NOTE: These are NOT expanded. 'runsPerDay' indicates how many times these run daily, not flights.
    // IMPORTANT: All satellites are LIVE IN-PERSON events at King's Casino Prague.
    // These feed exclusively into Event #5 (€5,300 Main Event).
    // Data source: WSOP.com official schedule - "All Side Events, Satellites, and Structures are on WSOP LIVE ONLY"
    const satellites: Tournament[] = [
      {
        id: 101,
        eventNum: 'SAT-1',
        name: 'Direct Satellite to Main Event',
        format: 'NLH Satellite',
        buyIn: 350,
        rakeFee: 70,
        currency: '€',
        startDates: ['Mar 31', 'Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10'],
        startTimes: ['10:00 AM', '2:00 PM', '6:00 PM', '10:00 PM'],
        flights: 1, // Single satellite (not expanded)
        runsPerDay: 4, // Runs 4 times daily
        location: 'King\'s Casino, Prague',
        blindLevels: '15-minute, starting at 25/50',
        description: '€350 direct satellite to €5,300 Main Event. Winner takes €5,300 Main Event entry. Runs 4 times daily throughout series. IN-PERSON ONLY at King\'s Casino Prague.'
      },
      {
        id: 102,
        eventNum: 'SAT-2',
        name: 'Mega Satellite to Main Event',
        format: 'NLH Mega Sat',
        buyIn: 500,
        rakeFee: 100,
        currency: '€',
        startDates: ['Mar 31', 'Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10'],
        startTimes: ['12:00 PM', '4:00 PM', '8:00 PM'],
        flights: 1, // Single satellite (not expanded)
        runsPerDay: 3, // Runs 3 times daily
        location: 'King\'s Casino, Prague',
        blindLevels: '20-minute, starting at 25/50',
        description: 'Mega satellite awarding 3-8+ Main Event seats based on field size. Best ROI for satellites (multiple winners). Runs 3 times daily. IN-PERSON ONLY at King\'s Casino Prague.'
      },
      {
        id: 103,
        eventNum: 'SAT-3',
        name: 'Super Satellite (€100 Entry)',
        format: 'NLH Super Sat',
        buyIn: 100,
        rakeFee: 20,
        currency: '€',
        startDates: ['Mar 31', 'Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10'],
        startTimes: ['9:00 AM', '1:00 PM', '5:00 PM', '9:00 PM'],
        flights: 1, // Single satellite (not expanded)
        runsPerDay: 4, // Runs 4 times daily
        location: 'King\'s Casino, Prague',
        blindLevels: '15-minute, starting at 10/25',
        description: 'Low buy-in satellite awarding €350, €500, €750 satellite entries. Pyramid structure for budget-conscious players. Runs 4x daily. IN-PERSON ONLY at King\'s Casino Prague.'
      },
    ];

    // ===== SIDE EVENTS (Running throughout series) =====
    // NOTE: These are NOT expanded. 'runsPerDay' indicates how many times these run daily, not flights.
    // IMPORTANT: All side events are LIVE IN-PERSON events at King's Casino Prague.
    // Data source: WSOP.com official schedule - "All Side Events, Satellites, and Structures are on WSOP LIVE ONLY"
    const sideEvents: Tournament[] = [
      {
        id: 201,
        eventNum: 'SIDE-1',
        name: 'Micro €25 NLHE (5x Daily)',
        format: 'NLH',
        buyIn: 25,
        rakeFee: 5,
        currency: '€',
        startDates: ['Mar 31', 'Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['6:00 AM', '10:00 AM', '2:00 PM', '6:00 PM', '10:00 PM'],
        flights: 1, // Single event (not expanded)
        runsPerDay: 5, // Runs 5 times daily
        gtd: 2000,
        location: 'King\'s Casino, Prague',
        blindLevels: '10-minute, starting at 10/25',
        description: 'Budget-friendly no-limit hold\'em. €2,000 GTD. Perfect for recreational players and bankroll builders. Runs 5 times daily. IN-PERSON ONLY at King\'s Casino Prague.'
      },
      {
        id: 202,
        eventNum: 'SIDE-2',
        name: 'Low Buy-in €50 NLHE (5x Daily)',
        format: 'NLH',
        buyIn: 50,
        rakeFee: 10,
        currency: '€',
        startDates: ['Mar 31', 'Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['7:00 AM', '11:00 AM', '3:00 PM', '7:00 PM', '11:00 PM'],
        flights: 1, // Single event (not expanded)
        runsPerDay: 5, // Runs 5 times daily
        gtd: 5000,
        location: 'King\'s Casino, Prague',
        blindLevels: '10-minute, starting at 15/25',
        description: '€5,000 GTD daily tournament. Running 5 times per day. Most accessible side event for recreational players. IN-PERSON ONLY at King\'s Casino Prague.'
      },
      {
        id: 203,
        eventNum: 'SIDE-3',
        name: 'Mid Buy-in €100 NLHE (5x Daily)',
        format: 'NLH',
        buyIn: 100,
        rakeFee: 20,
        currency: '€',
        startDates: ['Mar 31', 'Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['8:00 AM', '12:00 PM', '4:00 PM', '8:00 PM', '12:00 AM'],
        flights: 1, // Single event (not expanded)
        runsPerDay: 5, // Runs 5 times daily
        gtd: 10000,
        location: 'King\'s Casino, Prague',
        blindLevels: '15-minute, starting at 25/50',
        description: '€10,000 GTD daily. €100+€20 buy-in. Balanced field of recreational and semi-pro players. Runs 5 times daily. IN-PERSON ONLY at King\'s Casino Prague.'
      },
      {
        id: 204,
        eventNum: 'SIDE-4',
        name: 'High Buy-in €250 NLHE (3x Daily)',
        format: 'NLH',
        buyIn: 250,
        rakeFee: 50,
        currency: '€',
        startDates: ['Mar 31', 'Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['2:00 PM', '6:00 PM', '10:00 PM'],
        flights: 1, // Single event (not expanded)
        runsPerDay: 3, // Runs 3 times daily
        gtd: 20000,
        location: 'King\'s Casino, Prague',
        blindLevels: '20-minute, starting at 50/100',
        description: '€20,000 GTD daily. €250+€50 buy-in. Premium field with stronger competition. Runs 3 times daily. IN-PERSON ONLY at King\'s Casino Prague.'
      },
      {
        id: 205,
        eventNum: 'SIDE-5',
        name: 'Low Buy-in €100 PLO (3x Daily)',
        format: 'PLO',
        buyIn: 100,
        rakeFee: 20,
        currency: '€',
        startDates: ['Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['11:00 AM', '3:00 PM', '8:00 PM'],
        flights: 1, // Single event (not expanded)
        runsPerDay: 3, // Runs 3 times daily
        gtd: 5000,
        location: 'King\'s Casino, Prague',
        blindLevels: '15-minute, starting at 25/50',
        description: 'Four-card variant €5,000 GTD. €100+€20 buy-in. Running 3 times daily. Great for PLO enthusiasts. IN-PERSON ONLY at King\'s Casino Prague.'
      },
      {
        id: 206,
        eventNum: 'SIDE-6',
        name: 'High Roller €1,000 NLHE (2x Daily)',
        format: 'NLH High Roller',
        buyIn: 1000,
        rakeFee: 200,
        currency: '€',
        startDates: ['Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['7:00 PM', '10:00 PM'],
        flights: 1, // Single event (not expanded)
        runsPerDay: 2, // Runs 2 times daily
        gtd: 50000,
        location: 'King\'s Casino, Prague',
        blindLevels: '20-minute, starting at 100/200',
        description: '€1,000 buy-in with €50,000 GTD. Premium nightly event. Elite field with experienced professionals. Runs 2x daily. IN-PERSON ONLY at King\'s Casino Prague.'
      },
      {
        id: 207,
        eventNum: 'SIDE-7',
        name: 'Heads-Up €200 NLHE (Select Days)',
        format: 'NLH Heads-Up',
        buyIn: 200,
        rakeFee: 40,
        currency: '€',
        startDates: ['Apr 2', 'Apr 4', 'Apr 6', 'Apr 8', 'Apr 10', 'Apr 12'],
        startTimes: ['6:00 PM'],
        flights: 1, // Single event (not expanded)
        runsPerDay: 1, // Runs 1x on select days
        gtd: 5000,
        location: 'King\'s Casino, Prague',
        blindLevels: '10-minute, starting at 25/50',
        description: '€5,000 GTD heads-up tournament. €200+€40 buy-in. Single-elimination one-on-one format. 3x per week (Wed/Fri/Sun). IN-PERSON ONLY at King\'s Casino Prague.'
      },
      {
        id: 208,
        eventNum: 'SIDE-8',
        name: 'Bounty €150 NLHE (2x Daily)',
        format: 'NLH + Bounty',
        buyIn: 150,
        rakeFee: 30,
        currency: '€',
        startDates: ['Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['5:00 PM', '9:00 PM'],
        flights: 1, // Single event (not expanded)
        runsPerDay: 2, // Runs 2 times daily
        gtd: 8000,
        isBounty: true,
        location: 'King\'s Casino, Prague',
        blindLevels: '15-minute, starting at 25/50',
        description: '€8,000 GTD with bounty component. Eliminate players, win bounties! €150+€30 buy-in. Runs 2x daily. Recreational friendly. IN-PERSON ONLY at King\'s Casino Prague.'
      },
      {
        id: 209,
        eventNum: 'SIDE-9',
        name: 'Deepstack €200 NLHE (Select Days)',
        format: 'NLH Deepstack',
        buyIn: 200,
        rakeFee: 40,
        currency: '€',
        startDates: ['Apr 2', 'Apr 5', 'Apr 8', 'Apr 11'],
        startTimes: ['2:00 PM'],
        flights: 1, // Single event (not expanded)
        runsPerDay: 1, // Runs once on select days
        startingStack: 50000,
        blindLevels: '30-minute, starting at 25/50',
        gtd: 15000,
        location: 'King\'s Casino, Prague',
        description: '€200 buy-in with 50,000 chip starting stack. 30-minute blinds. €15,000 GTD. Deep, strategic poker. 4 events during series. IN-PERSON ONLY at King\'s Casino Prague.'
      },
      {
        id: 210,
        eventNum: 'SIDE-10',
        name: 'Turbo €100 NLHE (2x Nightly)',
        format: 'NLH Turbo',
        buyIn: 100,
        rakeFee: 20,
        currency: '€',
        startDates: ['Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['11:00 PM', '1:00 AM'],
        flights: 1, // Single event (not expanded)
        runsPerDay: 2, // Runs 2 times nightly
        isTurbo: true,
        blindLevels: '10-minute, starting at 25/50',
        gtd: 6000,
        location: 'King\'s Casino, Prague',
        description: 'Fast-paced turbo format with short blind levels. €6,000 GTD. €100+€20 buy-in. Late night action 2x nightly. Quick sessions. IN-PERSON ONLY at King\'s Casino Prague.'
      },
    ];

    const allEvents = [...data, ...satellites, ...sideEvents];
    const expandedEvents = expandFlights(allEvents);
    
    // === DATA VALIDATION & SANITY CHECKS ===
    const braceletEvents = data.length;
    const satelliteEvents = satellites.length;
    const sideEventCount = sideEvents.length;
    const totalUniqueEvents = allEvents.length;
    const totalDisplayedRows = expandedEvents.length;
    
    // Count bracelet events with flights
    const braceletWithFlights = data.filter(e => e.flights > 1).length;
    const totalFlightExpansions = data.reduce((sum, e) => sum + (e.flights > 1 ? e.flights : 0), 0);
    
    // Validation: check for missing blind levels in bracelet events
    const missingBlindLevels = data.filter(e => !e.blindLevels).map(e => `Event #${e.eventNum}`);
    const missingStartingStacks = data.filter(e => !e.startingStack).map(e => `Event #${e.eventNum}`);
    
    console.log('=== WSOP EUROPE 2026 TRACKER - DATA AUDIT ===');
    console.log(`Bracelet Events: ${braceletEvents}`);
    console.log(`  - With actual flights (expanded): ${braceletWithFlights}`);
    console.log(`  - Total flight rows from expansion: ${totalFlightExpansions}`);
    console.log(`Satellite Events: ${satelliteEvents} (NOT expanded, using runsPerDay)`);
    console.log(`Side Events: ${sideEventCount} (NOT expanded, using runsPerDay)`);
    console.log(`Total unique event types: ${totalUniqueEvents}`);
    console.log(`Total display rows (after flight expansion): ${totalDisplayedRows}`);
    console.log(`Expected total: ~25-28 rows (15 bracelets + flights, 3 satellites, 10 sides)`);
    console.log(`Status: ${totalDisplayedRows >= 25 && totalDisplayedRows <= 30 ? '✅ PASS' : '❌ FAIL'}`);
    console.log('');
    console.log('Data Completeness:');
    if (missingBlindLevels.length > 0) {
      console.warn(`Missing blind levels: ${missingBlindLevels.join(', ')}`);
    } else {
      console.log('✅ All bracelet events have blind level data');
    }
    if (missingStartingStacks.length > 0) {
      console.warn(`Missing starting stacks: ${missingStartingStacks.join(', ')}`);
    } else {
      console.log('✅ All bracelet events have starting stack data');
    }
    console.log('===================================');
    
    setTournaments(expandedEvents);
  };

  const handleGoogleLogin = (credentialResponse: any) => {
    try {
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      if (decoded.email === AUTHORIZED_EMAIL) {
        const userData = {
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture
        };
        setUser(userData);
        // Save user session to localStorage (expires on browser close)
        localStorage.setItem('wsop_user', JSON.stringify(userData));
      } else {
        alert(`Access denied. Only ${AUTHORIZED_EMAIL} can access this site.`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    // Clear user session from localStorage
    localStorage.removeItem('wsop_user');
  };

  if (!user) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">WSOP Europe Prague 2026</h1>
            <p className="text-xl text-green-700 mb-8 font-semibold">Tournament Tracker</p>
            
            <div className="bg-white rounded-xl p-10 max-w-sm mx-auto border-4 border-blue-300 shadow-2xl">
              <p className="text-xl text-gray-800 mb-8 font-semibold">Sign in with your Google account to view tournaments</p>
              <GoogleLogin 
                onSuccess={handleGoogleLogin}
                onError={() => alert('Login failed')}
              />
              <p className="text-lg text-gray-600 mt-6 font-medium">Authorized email: {AUTHORIZED_EMAIL}</p>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-400 via-green-400 to-yellow-300 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-600 drop-shadow-lg" />
            <div>
              <h1 className="text-xl font-bold text-blue-900 drop-shadow">WSOP Europe 2026</h1>
              <p className="text-sm text-blue-800 font-semibold drop-shadow">Prague Tracker</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              {user.picture && <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white shadow-md" />}
              <p className="text-sm text-blue-900 font-semibold">{user.name}</p>
              <p className="text-xs text-blue-800">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-md"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="flex items-center space-x-3 text-blue-700 mb-6 text-2xl font-bold">
            <Calendar className="w-8 h-8" />
            <span>March 31 - April 12, 2026</span>
          </div>
          <p className="text-gray-700 text-2xl mb-6 font-semibold">
            Explore all {tournaments.length} WSOP tournaments at King's Casino, Prague. Filter, sort, and track your favorite events.
          </p>
          
          {/* Info Box: Satellites & Side Events */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-400 rounded-xl p-6 mb-8 shadow-lg">
            <p className="text-gray-800 text-xl font-semibold">
              <strong>📌 Note:</strong> This tracker shows <strong>15 official WSOP bracelet events</strong> plus <strong>satellite and side events</strong>. 
              For additional information, 
              <a href="https://www.wsop.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline ml-1 font-bold">
                visit WSOP.com →
              </a>
            </p>
          </div>
        </div>

        <TournamentList tournaments={tournaments} />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-300 to-green-300 border-t-4 border-blue-400 mt-20 py-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 text-center text-blue-900 font-bold text-lg">
          <p>WSOP Europe Prague 2026 | King's Casino | Data subject to official WSOP updates</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
