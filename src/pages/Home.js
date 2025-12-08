import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import backgroundImage from '../assets/bg-image.png';
import musicData from '../data/musicData.json';
import content from "../data/content.json";
import AIChat from '../components/AIChat';
import Footer from '../components/Footer';

function Home() {
  const [musicCards, setMusicCards] = useState([]);
  const [featuredPlaylist, setFeaturedPlaylist] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkBackground, setDarkBackground] = useState(false);
  const [contentData, setContentData] = useState({});
  const [topArtists, setTopArtists] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  
  // NEW: Video playback state
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const videoRefs = useRef({});

  // Listen for theme changes from Navbar
  useEffect(() => {
    const handleThemeChange = (event) => {
      setDarkBackground(event.detail.darkBackground);
    };

    document.addEventListener('themeChange', handleThemeChange);
    setContentData(content);
    setLoading(false);
    // Load saved theme on component mount
    const savedTheme = localStorage.getItem('groovifyBackground');
    if (savedTheme === 'dark') {
      setDarkBackground(true);
    }

    return () => {
      document.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  // Load music data from API
  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        // Use the API to get songs
        const response = await api.get('/songs');
        // Add video URLs to songs (you can modify this based on your data structure)
        const songsWithVideos = response.data.data.songs.map(song => ({
          ...song,
          // Use sample video URLs or get from your database
          videoUrl: song.videoUrl || getSampleVideoUrl(song.genre)
        }));
        setMusicCards(songsWithVideos);

        // Featured playlist can stay static or come from specific endpoint
        setFeaturedPlaylist(musicData.featuredPlaylist);
      } catch (err) {
        console.error("Failed to fetch songs", err);
        setMusicCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  // Function to get sample video URLs based on genre
// Update the getSampleVideoUrl function in Home.js to match AddSong genres:

const getSampleVideoUrl = (genre) => {
  // Match the exact genres from AddSong.js
  const sampleVideos = {
    'Pop': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'Rock': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'Electronic': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'Lofi': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'Qawwali': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'Sufi': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'HipHop': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
  };
  
  // Return the video for the genre, default to Pop if genre not found
  return sampleVideos[genre] || sampleVideos['Pop'];
};

  // NEW: API call for top artists
  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        setApiLoading(true);
        // iTunes API search for Pakistani artists
        const response = await fetch('https://itunes.apple.com/search?term=pakistani+artist&entity=musicArtist&limit=6');
        const data = await response.json();
        setTopArtists(data.results.slice(0, 6)); // Get top 6 artists
        setApiError('');
      } catch (error) {
        console.error('API Error:', error);
        setApiError('Failed to load artists data');
        // Fallback data
        setTopArtists([
          { artistName: "Atif Aslam", primaryGenreName: "Pop" },
          { artistName: "Ali Zafar", primaryGenreName: "Pop" },
          { artistName: "Strings", primaryGenreName: "Rock" },
          { artistName: "Nusrat Fateh Ali Khan", primaryGenreName: "Qawwali" },
          { artistName: "Abida Parveen", primaryGenreName: "Sufi" },
          { artistName: "Rahat Fateh Ali Khan", primaryGenreName: "Qawwali" }
        ]);
      } finally {
        setApiLoading(false);
      }
    };

    fetchTopArtists();
  }, []);

  // NEW: Toggle video playback
  const toggleVideoPlayback = (cardId) => {
    if (playingVideoId === cardId) {
      // Pause and close current video
      if (videoRefs.current[cardId]) {
        videoRefs.current[cardId].pause();
      }
      setPlayingVideoId(null);
    } else {
      // Pause any currently playing video
      if (playingVideoId && videoRefs.current[playingVideoId]) {
        videoRefs.current[playingVideoId].pause();
      }
      
      // Play new video
      setPlayingVideoId(cardId);
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        if (videoRefs.current[cardId]) {
          videoRefs.current[cardId].play().catch(e => {
            console.error("Video play failed:", e);
          });
        }
      }, 100);
    }
  };

  // Background style based on theme
  const backgroundStyle = darkBackground
    ? { backgroundColor: '#111827' } // Solid dark gray
    : { backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'repeat' };

  if (loading) {
    return (
      <div
        className="min-h-screen text-white flex flex-col items-center justify-center"
        style={backgroundStyle}
      >
        <Navbar />
        <div className="mt-24 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your music...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white flex flex-col"
      style={backgroundStyle}
    >
      <Navbar />

      {/* Welcome Section */}
      <section className="mt-24 text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Groovify</h1>
        <p className="text-gray-300 text-lg">
          Fresh picks for you. Purple beats, black nights, and clean layouts.
        </p>

        <div className="mt-6 bg-purple-900 bg-opacity-50 p-4 rounded-lg max-w-md mx-auto">
          <h2 className="text-xl font-bold text-purple-300">{featuredPlaylist.title}</h2>
          <p className="text-gray-300">{featuredPlaylist.description}</p>
        </div>
      </section>

      {/* Video Section */}
      <section className="text-center mb-8 px-8">
        <h2 className="text-2xl font-bold mb-4">Featured Music Video</h2>
        <div className="max-w-2xl mx-auto">
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/jfKfPfyJRdk"
              title="Lofi Hip Hop Radio 📚 - beats to relax/study to"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-gray-300 mt-3">Relaxing lofi beats to study and code to</p>
        </div>
      </section>

      {/* NEW: API Data Section - Top Artists */}
      <section className="text-center mb-8 px-8">
        <h2 className="text-2xl font-bold mb-4">Popular Pakistani Artists</h2>

        {apiLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-3">Loading artists...</span>
          </div>
        ) : apiError ? (
          <p className="text-yellow-500">{apiError} (Showing fallback data)</p>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {topArtists.map((artist, index) => (
            <div
              key={index}
              className="bg-gray-800 bg-opacity-80 p-4 rounded-lg text-center hover:bg-gray-700 transition-colors duration-300"
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-xl">
                {artist.artistName ? artist.artistName.charAt(0) : 'A'}
              </div>
              <h3 className="font-bold text-lg mb-1">
                {artist.artistName || artist.artistName}
              </h3>
              <p className="text-purple-300 text-sm">
                {artist.primaryGenreName || 'Various Genres'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Music Cards Section - UPDATED with video player */}
      <section className="flex flex-col items-start gap-5 p-8 w-full max-w-7xl mx-auto">
        {musicCards.map(card => (
          <div
            key={card._id || card.id}
            className="bg-gray-800 bg-opacity-95 p-5 rounded-xl text-left shadow-lg hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 w-11/12 max-w-none"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-gray-300 mb-1">{card.description}</p>
                <span className="text-sm text-purple-400">Genre: {card.genre}</span>
              </div>
              <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
                {card.duration}
              </span>
            </div>

            {/* Video Player - Conditionally rendered */}
            {playingVideoId === (card._id || card.id) && (
              <div className="mt-4 mb-4 rounded-xl overflow-hidden shadow-lg">
                <video
                  ref={el => videoRefs.current[card._id || card.id] = el}
                  className="w-full max-h-64 object-cover"
                  controls
                  onEnded={() => setPlayingVideoId(null)}
                >
                  <source src={card.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            <button 
              onClick={() => toggleVideoPlayback(card._id || card.id)}
              className="mt-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white border-none py-2 px-5 rounded-full text-sm font-bold cursor-pointer hover:opacity-85 transition-opacity duration-300 flex items-center gap-2"
            >
              {playingVideoId === (card._id || card.id) ? (
                <>
                  <span>⏸️</span> Pause Video
                </>
              ) : (
                <>
                  <span>▶</span> Play Video
                </>
              )}
            </button>
          </div>
        ))}
      </section>

      {/* NEW: AI Chat Section */}
      <section className="text-center mb-8 px-8">
        <h2 className="text-2xl font-bold mb-4">Ask AI About Music</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Get personalized music recommendations and learn about artists with our AI assistant!
        </p>
        <AIChat />
      </section>
      <Footer />
    </div>
  );
}

export default Home;