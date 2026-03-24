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
  }, []);

  const loadTournaments = () => {
    // WSOP Europe Prague 2026 tournaments
    const data: Tournament[] = [
      {
        id: 1,
        number: '1',
        name: 'Opening Event',
        buyIn: 500,
        currency: '€',
        startDate: '2026-03-31',
        location: 'King\'s Casino, Prague',
        maxPlayers: 5000,
        bracketType: 'Single',
        guaranteedPrizepool: 2000000,
        description: 'The opening tournament of WSOP Europe Prague 2026'
      },
      {
        id: 2,
        number: '2',
        name: 'Pot-Limit Omaha',
        buyIn: 1000,
        currency: '€',
        startDate: '2026-04-01',
        location: 'King\'s Casino, Prague',
        maxPlayers: 2000,
        bracketType: 'Single',
        guaranteedPrizepool: 1500000,
        description: 'High-stakes PLO tournament with excellent field'
      },
      {
        id: 3,
        number: '3',
        name: 'No-Limit Hold\'em',
        buyIn: 2500,
        currency: '€',
        startDate: '2026-04-02',
        location: 'King\'s Casino, Prague',
        maxPlayers: 1500,
        bracketType: 'Single',
        guaranteedPrizepool: 2500000,
        description: 'Classic NLHE tournament'
      },
      {
        id: 4,
        number: '4',
        name: 'Mixed Game',
        buyIn: 3000,
        currency: '€',
        startDate: '2026-04-03',
        location: 'King\'s Casino, Prague',
        maxPlayers: 800,
        bracketType: 'Single',
        guaranteedPrizepool: 1800000,
        description: 'Mix of HOLDEM, OMAHA, STUD, RAZZ'
      },
      {
        id: 5,
        number: '5',
        name: 'High Roller',
        buyIn: 5300,
        currency: '€',
        startDate: '2026-04-04',
        location: 'King\'s Casino, Prague',
        maxPlayers: 500,
        bracketType: 'Single',
        guaranteedPrizepool: 2000000,
        description: 'Elite-level high roller event'
      },
      {
        id: 6,
        number: '6',
        name: 'Ladies Championship',
        buyIn: 1500,
        currency: '€',
        startDate: '2026-04-05',
        location: 'King\'s Casino, Prague',
        maxPlayers: 1000,
        bracketType: 'Single',
        guaranteedPrizepool: 1000000,
        description: 'Exclusive tournament for women poker players'
      },
      {
        id: 7,
        number: '7',
        name: 'Main Event',
        buyIn: 10000,
        currency: '€',
        startDate: '2026-04-06',
        location: 'King\'s Casino, Prague',
        maxPlayers: 3000,
        bracketType: 'Multi-day',
        guaranteedPrizepool: 10000000,
        description: 'The flagship tournament of WSOP Europe with €10M guaranteed'
      },
      {
        id: 8,
        number: '8',
        name: 'Circuit Championship',
        buyIn: 3500,
        currency: '€',
        startDate: '2026-04-09',
        location: 'King\'s Casino, Prague',
        maxPlayers: 1200,
        bracketType: 'Single',
        guaranteedPrizepool: 1500000,
        description: 'Circuit Championship event with golden ring'
      },
      {
        id: 9,
        number: '9',
        name: 'Heads-Up Championship',
        buyIn: 2000,
        currency: '€',
        startDate: '2026-04-10',
        location: 'King\'s Casino, Prague',
        maxPlayers: 256,
        bracketType: 'Heads-Up',
        guaranteedPrizepool: 500000,
        description: 'Ultimate one-on-one poker competition'
      },
      {
        id: 10,
        number: '10',
        name: 'Six-Handed',
        buyIn: 1500,
        currency: '€',
        startDate: '2026-04-11',
        location: 'King\'s Casino, Prague',
        maxPlayers: 2000,
        bracketType: 'Single',
        guaranteedPrizepool: 1200000,
        description: 'Fast-paced six-handed no-limit hold\'em'
      }
    ];
    setTournaments(data);
  };

  const handleGoogleLogin = (credentialResponse: any) => {
    try {
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      if (decoded.email === AUTHORIZED_EMAIL) {
        setUser({
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture
        });
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
          <p className="text-gray-400 text-lg">
            Explore all {tournaments.length} tournaments at King's Casino, Prague. Filter, sort, and track your favorite events.
          </p>
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
