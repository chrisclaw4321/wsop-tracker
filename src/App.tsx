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
        isBounty: true,
        description: 'Four-flight opening tournament with mystery bounty component. Perfect entry-level WSOPE bracelet event.'
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
        blindLevels: '40-minute',
        description: 'Variant mix: PLO → PLO8 → Big O. Ideal for experienced Omaha specialists.'
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
        description: 'The low buy-in, high-volume event. Budget-friendly bracelet opportunity with large fields.'
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
        isBounty: true,
        description: 'The Colossus meets PLO with bounty component. Fantastic for aggressive action players.'
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
        blindLevels: '10-minute',
        isMultiday: true,
        description: '€10,000,000 GUARANTEED - The most prestigious event. Largest prize pool guarantee in European poker history. 130min late reg, unlimited re-entries.'
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
        description: 'FIRST-EVER Ladies event at WSOPE. Confirmed players: Vanessa Kade, Leo Margets, Kitty Kuo, Mackenzie Dern. Custom gemstone bracelet for winner.'
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
        isTurbo: true,
        isBounty: true,
        description: 'Fast-paced turbo format combined with bounties. 60-90 minute levels, aggressive action.'
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
        description: 'Large starting stack (50k chips) = deep-stacked play. Positional, thoughtful poker.'
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
        blindLevels: '40/60-minute',
        description: 'Deep-stacked PLO championship. For experienced four-card players. High roller prestige.'
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
        description: 'Ryder Cup-style team competition. EU vs. Rest of World. Unique format, social element.'
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
        blindLevels: '30/60-minute',
        description: 'Elite poker. €20,800 buy-in attracts world\'s best. Deep stacks, slow blinds, maximum prestige.'
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
        description: '€1,500,000 GTD - The "Mini Main Event". NEW EVENT. Four flights provide flexibility. Golden ring, golden jacket.'
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
        blindLevels: '60-minute',
        description: 'GGPoker-sponsored high roller. Named after GGMillion$ online series. Premium field, premium results.'
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
        blindLevels: '30-minute',
        isBounty: false,
        description: 'NEW AT WSOPE - Double board bomb pot format popularized by high-stakes streams. Four-card chaos, recreational-friendly.'
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
        isTurbo: true,
        isBounty: true,
        description: 'Final bracelet event of the series (Presented by GGPoker). Fast turbo + bounty hunting. Ending on a high note.'
      }
    ];

    // ===== SATELLITE TOURNAMENTS (Running throughout series) =====
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
        flights: 40,
        location: 'King\'s Casino, Prague',
        description: '€350 direct satellite to €5,300 Main Event. Winner takes €5,300 Main Event entry. Running multiple times daily throughout series.'
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
        flights: 30,
        location: 'King\'s Casino, Prague',
        description: 'Mega satellite awarding 3-8+ Main Event seats based on field size. Best ROI for satellites (multiple winners). Running 3x daily.'
      },
      {
        id: 103,
        eventNum: 'SAT-3',
        name: 'Super Satellite',
        format: 'NLH Super Sat',
        buyIn: 100,
        rakeFee: 20,
        currency: '€',
        startDates: ['Mar 31', 'Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10'],
        startTimes: ['9:00 AM', '1:00 PM', '5:00 PM', '9:00 PM'],
        flights: 50,
        location: 'King\'s Casino, Prague',
        description: 'Low buy-in satellite awarding €350, €500, €750 satellite entries. Pyramid structure for budget-conscious players.'
      },
    ];

    // ===== SIDE EVENTS (Expected throughout series) =====
    const sideEvents: Tournament[] = [
      {
        id: 201,
        eventNum: 'SIDE-1',
        name: 'Micro NLHE',
        format: 'NLH',
        buyIn: 25,
        rakeFee: 5,
        currency: '€',
        startDates: ['Mar 31', 'Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['6:00 AM', '10:00 AM', '2:00 PM', '6:00 PM', '10:00 PM'],
        flights: 100,
        gtd: 2000,
        location: 'King\'s Casino, Prague',
        description: 'Budget-friendly no-limit hold\'em. €2,000 GTD. Perfect for recreational players and bankroll builders.'
      },
      {
        id: 202,
        eventNum: 'SIDE-2',
        name: 'Low Buy-in NLHE',
        format: 'NLH',
        buyIn: 50,
        rakeFee: 10,
        currency: '€',
        startDates: ['Mar 31', 'Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['7:00 AM', '11:00 AM', '3:00 PM', '7:00 PM', '11:00 PM'],
        flights: 80,
        gtd: 5000,
        location: 'King\'s Casino, Prague',
        description: '€5,000 GTD daily tournament. Running 5 times per day. Most accessible side event for recreational players.'
      },
      {
        id: 203,
        eventNum: 'SIDE-3',
        name: 'Mid Buy-in NLHE',
        format: 'NLH',
        buyIn: 100,
        rakeFee: 20,
        currency: '€',
        startDates: ['Mar 31', 'Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['8:00 AM', '12:00 PM', '4:00 PM', '8:00 PM', '12:00 AM'],
        flights: 60,
        gtd: 10000,
        location: 'King\'s Casino, Prague',
        description: '€10,000 GTD daily. €100+€20 buy-in. Balanced field of recreational and semi-pro players.'
      },
      {
        id: 204,
        eventNum: 'SIDE-4',
        name: 'High Buy-in NLHE',
        format: 'NLH',
        buyIn: 250,
        rakeFee: 50,
        currency: '€',
        startDates: ['Mar 31', 'Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['2:00 PM', '6:00 PM', '10:00 PM'],
        flights: 40,
        gtd: 20000,
        location: 'King\'s Casino, Prague',
        description: '€20,000 GTD daily. €250+€50 buy-in. Premium field with stronger competition. 3 flights per day.'
      },
      {
        id: 205,
        eventNum: 'SIDE-5',
        name: 'Low Buy-in PLO',
        format: 'PLO',
        buyIn: 100,
        rakeFee: 20,
        currency: '€',
        startDates: ['Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['11:00 AM', '3:00 PM', '8:00 PM'],
        flights: 50,
        gtd: 5000,
        location: 'King\'s Casino, Prague',
        description: 'Four-card variant €5,000 GTD. €100+€20 buy-in. Running 3 times daily. Great for PLO enthusiasts.'
      },
      {
        id: 206,
        eventNum: 'SIDE-6',
        name: 'High Roller Tournament',
        format: 'NLH High Roller',
        buyIn: 1000,
        rakeFee: 200,
        currency: '€',
        startDates: ['Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['7:00 PM', '10:00 PM'],
        flights: 20,
        gtd: 50000,
        location: 'King\'s Casino, Prague',
        description: '€1,000 buy-in with €50,000 GTD. Premium nightly event. Elite field with experienced professionals. 2 flights daily.'
      },
      {
        id: 207,
        eventNum: 'SIDE-7',
        name: 'Heads-Up Tournament',
        format: 'NLH Heads-Up',
        buyIn: 200,
        rakeFee: 40,
        currency: '€',
        startDates: ['Apr 2', 'Apr 4', 'Apr 6', 'Apr 8', 'Apr 10', 'Apr 12'],
        startTimes: ['6:00 PM'],
        flights: 15,
        gtd: 5000,
        location: 'King\'s Casino, Prague',
        description: '€5,000 GTD heads-up tournament. €200+€40 buy-in. Single-elimination one-on-one format. 3x per week.'
      },
      {
        id: 208,
        eventNum: 'SIDE-8',
        name: 'Bounty NLHE',
        format: 'NLH + Bounty',
        buyIn: 150,
        rakeFee: 30,
        currency: '€',
        startDates: ['Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['5:00 PM', '9:00 PM'],
        flights: 50,
        gtd: 8000,
        isBounty: true,
        location: 'King\'s Castle, Prague',
        description: '€8,000 GTD with bounty component. Eliminate players, win bounties! €150+€30 buy-in. 2 flights daily. Recreational friendly.'
      },
      {
        id: 209,
        eventNum: 'SIDE-9',
        name: 'Deepstack Tournament',
        format: 'NLH Deepstack',
        buyIn: 200,
        rakeFee: 40,
        currency: '€',
        startDates: ['Apr 2', 'Apr 5', 'Apr 8', 'Apr 11'],
        startTimes: ['2:00 PM'],
        flights: 30,
        startingStack: 50000,
        blindLevels: '30-minute',
        gtd: 15000,
        location: 'King\'s Casino, Prague',
        description: '€200 buy-in with 50,000 chip starting stack. 30-minute blinds. €15,000 GTD. Deep, strategic poker. 4 events during series.'
      },
      {
        id: 210,
        eventNum: 'SIDE-10',
        name: 'Turbo Tournament',
        format: 'NLH Turbo',
        buyIn: 100,
        rakeFee: 20,
        currency: '€',
        startDates: ['Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12'],
        startTimes: ['11:00 PM', '1:00 AM'],
        flights: 60,
        isTurbo: true,
        gtd: 6000,
        location: 'King\'s Casino, Prague',
        description: 'Fast-paced turbo format with short blind levels. €6,000 GTD. €100+€20 buy-in. Late night action 2x daily. Quick sessions.'
      },
    ];

    const allEvents = [...data, ...satellites, ...sideEvents];
    setTournaments(allEvents);
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
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center p-4">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Trophy className="w-16 h-16 text-yellow-400" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">WSOP Europe Prague 2026</h1>
            <p className="text-xl text-gray-300 mb-12">Tournament Tracker</p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-sm mx-auto border border-white/20">
              <p className="text-gray-200 mb-6">Sign in with your Google account to view tournaments</p>
              <GoogleLogin 
                onSuccess={handleGoogleLogin}
                onError={() => alert('Login failed')}
              />
              <p className="text-sm text-gray-400 mt-4">Authorized email: {AUTHORIZED_EMAIL}</p>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">WSOP Europe 2026</h1>
              <p className="text-sm text-purple-300">Prague Tournament Tracker</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              {user.picture && <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />}
              <p className="text-sm text-gray-300">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-purple-300 mb-4">
            <Calendar className="w-5 h-5" />
            <span>March 31 - April 12, 2026</span>
          </div>
          <p className="text-gray-400 text-lg mb-4">
            Explore all {tournaments.length} WSOP bracelet tournaments at King's Casino, Prague. Filter, sort, and track your favorite events.
          </p>
          
          {/* Info Box: Satellites & Side Events */}
          <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-lg p-4 mb-6">
            <p className="text-amber-200 text-sm">
              <strong>📌 Note:</strong> This tracker shows the <strong>15 official WSOP bracelet events</strong>. 
              For <strong>50+ side events and satellite tournaments</strong> (€50-€1,000+ buy-ins), 
              check the <strong>WSOP+ app</strong> or ask at the tournament desk. 
              <a href="https://www.wsop.com" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-100 underline ml-1">
                Learn more →
              </a>
            </p>
          </div>
        </div>

        <TournamentList tournaments={tournaments} />
      </main>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-purple-500/20 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>WSOP Europe Prague 2026 | King's Casino | Data subject to official WSOP updates</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
