import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { AttractionCard } from './components/AttractionCard';
import { AttractionMap } from './components/Map';
import { Auth } from './components/Auth';
import { Attraction } from './types';
import { MapPin, LogOut, Map, List } from 'lucide-react';
import { fetchAttractions } from './services/attractionService';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadAttractions = async () => {
      try {
        setLoading(true);
        const data = await fetchAttractions();
        setAttractions(data);
        setError(null);
      } catch (err) {
        setError('Failed to load attractions. Please try again later.');
        console.error('Error loading attractions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAttractions();
  }, [user]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const toggleMap = () => {
    setShowMap(prev => !prev);
    setSelectedAttraction(null);
  };

  if (!user) {
    return <Auth />;
  }

  const filteredAttractions = attractions.filter((attraction) =>
    attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attraction.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attraction.location.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attractions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <MapPin className="text-blue-600 h-6 w-6 sm:h-8 sm:w-8" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">USA Attractions</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMap}
                className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {showMap ? (
                  <>
                    <List className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Show List</span>
                  </>
                ) : (
                  <>
                    <Map className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Show Map</span>
                  </>
                )}
              </button>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className={`flex items-center px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
                  isSigningOut 
                    ? 'opacity-75 cursor-not-allowed' 
                    : 'hover:bg-gray-300 active:bg-gray-400'
                }`}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showMap ? (
          <div className="h-[calc(100vh-200px)] rounded-lg overflow-hidden shadow-lg">
            <AttractionMap
              attractions={filteredAttractions}
              selectedAttraction={selectedAttraction}
              onSelectAttraction={setSelectedAttraction}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttractions.length > 0 ? (
              filteredAttractions.map((attraction) => (
                <AttractionCard
                  key={attraction.id}
                  attraction={attraction}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No attractions found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;