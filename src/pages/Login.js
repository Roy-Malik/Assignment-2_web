import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import backgroundImage from '../assets/bg-image.png';

function Login() {
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

  // Background style based on theme
  const backgroundStyle = darkBackground 
    ? { backgroundColor: '#111827' } // Solid dark gray
    : { backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'repeat' };

  return (
    <div 
      className="min-h-screen text-white flex flex-col"
      style={backgroundStyle}
    >
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-7 px-4 mt-16">
        <section className="flex flex-col gap-4 bg-gray-900 bg-opacity-80 border border-purple-300 border-opacity-20 rounded-xl shadow-2xl p-7 max-w-md w-full">
          <h1 className="text-2xl font-bold m-0 mb-1">Welcome back</h1>
          
          <form className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm text-gray-300">Email</label>
              <input 
                className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/25"
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                required 
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm text-gray-300">Password</label>
              <input 
                className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/25"
                id="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                minLength="6"
              />
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-400">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="text-purple-300 no-underline hover:underline">Forgot password?</a>
            </div>
            
            <button 
              className="border-none rounded-full py-3 px-4 font-extrabold cursor-pointer bg-gradient-to-r from-purple-500 to-purple-400 text-gray-900 hover:opacity-90 transition-opacity"
              type="submit"
            >
              Log in
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-300 no-underline hover:underline">
              Sign up
            </Link>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-xs py-4">
        © 2025 Groovify
      </footer>
    </div>
  );
}

export default Login;