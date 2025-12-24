import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import backgroundImage from '../assets/bg-image.png';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkBackground, setDarkBackground] = useState(false);

  // Listen for theme changes from Navbar
  useEffect(() => {
    const handleThemeChange = (event) => {
      setDarkBackground(event.detail.darkBackground);
    };

    document.addEventListener('themeChange', handleThemeChange);
    
    // Load saved theme on component mount
    const savedTheme = localStorage.getItem('groovifyBackground');
    if (savedTheme === 'dark') {
      setDarkBackground(true);
    }

    return () => {
      document.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userRes = await api.get('/users/me');
        setUser(userRes.data.data.user);
      } catch (err) {
        console.error('Dashboard error', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // FIXED: Use the same background style pattern as Login.js and Home.js
  const backgroundStyle = darkBackground
    ? { backgroundColor: '#111827' }
    : { backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'repeat' };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p className="text-lg animate-pulse">Loading dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen text-white flex flex-col" style={backgroundStyle}>
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-10 mt-20">
        {/* Top header - REMOVED: "Add Song" button from top */}
        <div className="mb-8 bg-gray-800 bg-opacity-80 border border-purple-500/30 rounded-2xl px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-purple-300/80">
              Dashboard
            </p>
            <h1 className="mt-1 text-3xl md:text-4xl font-extrabold">
              Welcome, <span className="text-purple-300">{user.name}</span>
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Manage your profile, explore your songs, and enjoy your Groovify experience.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-red-500/30 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Account overview at the top - UPDATED: Solid gray */}
        <div className="mb-6 bg-gray-800 bg-opacity-80 rounded-2xl p-6 border border-purple-500/30 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-xl font-bold">📊</span>
            </div>
            <h2 className="text-2xl font-bold">Account Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 bg-opacity-80 p-4 rounded-xl border border-gray-600">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Profile Status</h3>
              <p className="text-sm text-slate-300">
                Your profile is <span className="text-emerald-400 font-semibold">complete</span>. Keep your information up to date.
              </p>
            </div>
            <div className="bg-gray-700 bg-opacity-80 p-4 rounded-xl border border-gray-600">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Quick Actions</h3>
              <p className="text-sm text-slate-300">
                Update profile, manage songs, or explore new features.
              </p>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card - UPDATED: Solid gray */}
          <div className="lg:col-span-2 bg-gray-800 bg-opacity-80 rounded-2xl p-6 shadow-xl border border-purple-500/40">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-bold shadow-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold leading-tight">{user.name}</h2>
                <p className="text-sm text-slate-300">{user.email}</p>
                <span className="inline-flex mt-2 items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-purple-900/70 text-purple-200 border border-purple-500/40 uppercase">
                  Member
                </span>
              </div>
            </div>

            {/* Action tabs - UPDATED: Solid gray */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => navigate('/profile')}
                className="w-full bg-gray-700 hover:bg-gray-600 rounded-xl px-4 py-2.5 text-sm font-semibold text-white border border-gray-500 transition shadow-md"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>✏️</span>
                  Edit Profile
                </div>
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-700 hover:bg-gray-600 rounded-xl px-4 py-2.5 text-sm font-semibold text-white border border-gray-500 transition shadow-md"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>🎵</span>
                  View Songs
                </div>
              </button>
              <button
                onClick={() => navigate('/add-song')}
                className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-500/40 transition"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">＋</span>
                  Add New Song
                </div>
              </button>
            </div>
          </div>

          {/* Quick start section - UPDATED: Solid gray */}
          <div className="bg-gray-800 bg-opacity-80 rounded-2xl p-6 border border-purple-500/30 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-xl">🎧</span>
              </div>
              <h2 className="text-xl font-bold">Start Your Groove</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-700 bg-opacity-80 p-4 rounded-xl border border-gray-600">
                <h3 className="font-semibold text-purple-300 mb-2">🎵 Add Your First Song</h3>
                <p className="text-sm text-slate-300 mb-3">
                  Share your favorite tracks with the community.
                </p>
                <button
                  onClick={() => navigate('/add-song')}
                  className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition"
                >
                  Add Song
                </button>
              </div>

              <div className="bg-gray-700 bg-opacity-80 p-4 rounded-xl border border-gray-600">
                <h3 className="font-semibold text-blue-300 mb-2">👤 Update Profile</h3>
                <p className="text-sm text-slate-300 mb-3">
                  Keep your profile information current.
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips Section - UPDATED: Solid gray */}
        <div className="mt-6 bg-gray-800 bg-opacity-80 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Quick Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 bg-opacity-80 p-4 rounded-xl border border-gray-600">
              <h3 className="font-semibold text-purple-300 mb-2">🔐 Login Required</h3>
              <p className="text-sm text-slate-300">
                You must be logged in to add songs in the community.
              </p>
            </div>
            <div className="bg-gray-700 bg-opacity-80 p-4 rounded-xl border border-gray-600">
              <h3 className="font-semibold text-amber-300 mb-2">🎨 Theme Toggle</h3>
              <p className="text-sm text-slate-300">
                Use the "Show BG" button in the navbar to switch between backgrounds.
              </p>
            </div>
            <div className="bg-gray-700 bg-opacity-80 p-4 rounded-xl border border-gray-600">
              <h3 className="font-semibold text-cyan-300 mb-2">🔒 Secure Account</h3>
              <p className="text-sm text-slate-300">
                Your data is protected with industry-standard security practices.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;