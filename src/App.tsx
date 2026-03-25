import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import TournamentList from './components/TournamentList';
import MySchedule from './components/MySchedule';
import { Tournament, User } from './types';
import { Calendar, Trophy, LogOut, List } from 'lucide-react';
import { loadTournamentsFromDatabase } from './utils/databaseLoader';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '152840809437-f5g8e4st3hae8obeafinge3g233os3fb.apps.googleusercontent.com';
const AUTHORIZED_EMAIL = 'sazan4321@gmail.com';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTournaments, setSelectedTournaments] = useState<Tournament[]>([]);
  const [currentTab, setCurrentTab] = useState<'list' | 'schedule'>('list');

  useEffect(() => {
    // Load tournaments data from centralized database
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

  // Load selections from server when user logs in
  useEffect(() => {
    if (user && tournaments.length > 0) {
      loadSelectionsFromServer(user.email);
    }
  }, [user, tournaments.length]);

  const loadTournaments = () => {
    // Load all tournaments from the centralized database
    const allTournaments = loadTournamentsFromDatabase();
    setTournaments(allTournaments);
    
    // === DATA AUDIT ===
    console.log('=== WSOP EUROPE 2026 TRACKER - LOADED FROM DATABASE ===');
    console.log(`Total tournament entries: ${allTournaments.length}`);
    console.log(`✅ Database loading complete`);
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

  const loadSelectionsFromServer = async (email: string) => {
    try {
      console.log(`[API] Loading selections from server for ${email}...`);
      const response = await fetch(`/api/selections?email=${encodeURIComponent(email)}`);
      console.log(`[API] Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`[API] Server returned ${data.selections?.length || 0} selections:`, data.selections);
        const selectedIds = data.selections || [];
        
        if (selectedIds.length > 0) {
          // Server has selections - load them
          const restored = tournaments.filter(t => selectedIds.includes(t.id));
          console.log(`[API] ✅ Restored ${restored.length} tournaments from SERVER`);
          setSelectedTournaments(restored);
          // Save to localStorage as backup
          localStorage.setItem('wsop_selected_tournaments', JSON.stringify(selectedIds));
        } else {
          // Server has no selections - try localStorage as fallback
          console.log(`[API] Server has no selections, checking localStorage...`);
          const savedSelections = localStorage.getItem('wsop_selected_tournaments');
          if (savedSelections) {
            const savedIds = JSON.parse(savedSelections);
            const restored = tournaments.filter(t => savedIds.includes(t.id));
            console.log(`[API] Loaded ${restored.length} tournaments from localStorage`);
            setSelectedTournaments(restored);
          } else {
            console.log(`[API] No selections found anywhere`);
            setSelectedTournaments([]);
          }
        }
      } else {
        console.error(`[API] Server responded with status ${response.status}`);
        const errorText = await response.text();
        console.error(`[API] Error response:`, errorText);
        
        // Server error - use localStorage as fallback
        const savedSelections = localStorage.getItem('wsop_selected_tournaments');
        if (savedSelections) {
          const savedIds = JSON.parse(savedSelections);
          const restored = tournaments.filter(t => savedIds.includes(t.id));
          console.log(`[API-FALLBACK] Server error, using localStorage: ${restored.length} tournaments`);
          setSelectedTournaments(restored);
        } else {
          setSelectedTournaments([]);
        }
      }
    } catch (error) {
      console.error('[API] Failed to load selections from server:', error);
      console.log('[API] Falling back to localStorage...');
      
      // Network error - use localStorage as fallback
      const savedSelections = localStorage.getItem('wsop_selected_tournaments');
      if (savedSelections) {
        try {
          const savedIds = JSON.parse(savedSelections);
          const restored = tournaments.filter(t => savedIds.includes(t.id));
          console.log(`[API-FALLBACK] Network error, using localStorage: ${restored.length} tournaments`);
          setSelectedTournaments(restored);
        } catch (e) {
          console.error('[API-FALLBACK] Failed to parse localStorage:', e);
          setSelectedTournaments([]);
        }
      } else {
        setSelectedTournaments([]);
      }
    }
  };

  const saveSelectionsToServer = async (newSelected: Tournament[], email: string) => {
    const selectionIds = newSelected.map(t => t.id);
    
    // Always save to localStorage as backup
    console.log(`[API] Saving ${selectionIds.length} selections to localStorage`);
    localStorage.setItem('wsop_selected_tournaments', JSON.stringify(selectionIds));
    
    // Try to save to server
    try {
      console.log(`[API] Saving ${selectionIds.length} selections to server for ${email}...`);
      const response = await fetch('/api/selections?email=' + encodeURIComponent(email), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections: selectionIds })
      });
      
      console.log(`[API] Save response status: ${response.status}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Save failed: ${response.status} - ${errorText}`);
        console.warn('[API] Saved to localStorage instead');
      } else {
        console.log(`[API] ✅ Successfully saved to server`);
      }
    } catch (error) {
      console.error('[API] Failed to save selections to server:', error);
      console.warn('[API] Saved to localStorage instead');
    }
  };

  const handleSelectTournament = (tournament: Tournament) => {
    let newSelected: Tournament[];
    if (selectedTournaments.find(t => t.id === tournament.id)) {
      newSelected = selectedTournaments.filter(t => t.id !== tournament.id);
    } else {
      newSelected = [...selectedTournaments, tournament];
    }
    setSelectedTournaments(newSelected);
    // Save to server and localStorage
    if (user) {
      saveSelectionsToServer(newSelected, user.email);
    }
  };

  const handleRemoveFromSchedule = (tournamentId: number) => {
    const newSelected = selectedTournaments.filter(t => t.id !== tournamentId);
    setSelectedTournaments(newSelected);
    // Save to server and localStorage
    if (user) {
      saveSelectionsToServer(newSelected, user.email);
    }
  };

  const isTournamentSelected = (tournamentId: number): boolean => {
    return selectedTournaments.some(t => t.id === tournamentId);
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
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center border-b-4 border-blue-500">
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-600 drop-shadow-lg" />
            <div>
              <h1 className="text-xl font-bold text-blue-900 drop-shadow">WSOP Europe 2026</h1>
              <p className="text-sm text-blue-800 font-semibold drop-shadow">Prague Tracker</p>
            </div>
          </div>

          {/* Tabs in Header */}
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentTab('list')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition ${
                currentTab === 'list'
                  ? 'bg-white text-blue-700 border-2 border-blue-600 shadow-lg'
                  : 'bg-blue-300 text-blue-900 hover:bg-blue-400'
              }`}
            >
              <List className="w-5 h-5 inline mr-2" />
              Tournaments
            </button>
            <button
              onClick={() => setCurrentTab('schedule')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition relative ${
                currentTab === 'schedule'
                  ? 'bg-white text-green-700 border-2 border-green-600 shadow-lg'
                  : 'bg-green-300 text-green-900 hover:bg-green-400'
              }`}
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              My Schedule
              {selectedTournaments.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                  {selectedTournaments.length}
                </span>
              )}
            </button>
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
        {/* Tab Content */}
        {currentTab === 'list' && (
          <>
            <div className="mb-10">
              <div className="flex items-center space-x-3 text-blue-700 mb-6 text-2xl font-bold">
                <Calendar className="w-8 h-8" />
                <span>March 31 - April 12, 2026</span>
              </div>
              <p className="text-gray-700 text-2xl mb-6 font-semibold">
                Explore all {tournaments.length} WSOP tournaments at King's Casino, Prague. Click the checkbox to add tournaments to your schedule.
              </p>
            </div>

            <TournamentList 
              tournaments={tournaments}
              onSelectTournament={handleSelectTournament}
              isSelected={isTournamentSelected}
            />
          </>
        )}

        {currentTab === 'schedule' && (
          <MySchedule 
            selectedTournaments={selectedTournaments}
            onRemove={handleRemoveFromSchedule}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-300 to-green-300 border-t-4 border-blue-400 mt-20 py-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 text-center text-blue-900 font-bold text-lg">
          <p>WSOP Europe Prague 2026 | King's Casino | Data from centralized tournament database</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
