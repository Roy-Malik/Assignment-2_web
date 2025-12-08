import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useState, useEffect } from 'react';

function Navbar() {
  const [darkBackground, setDarkBackground] = useState(false);

  // Load theme preference on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('groovifyBackground');
    if (savedTheme === 'dark') {
      setDarkBackground(true);
    }
  }, []);

  // Toggle background and save preference
  const toggleBackground = () => {
    const newTheme = !darkBackground;
    setDarkBackground(newTheme);
    localStorage.setItem('groovifyBackground', newTheme ? 'dark' : 'image');

    // Apply theme to body or notify parent component
    document.dispatchEvent(new CustomEvent('themeChange', {
      detail: { darkBackground: newTheme }
    }));
  };

  return (
    <header className="w-full py-4 px-10 bg-gray-900 flex justify-between items-center fixed top-0 left-0 z-50">
      <div className="flex items-center gap-3">
        <Link to="/">
          <img className="h-10 w-10" src={logo} alt="Logo" />
        </Link>
        <Link className="text-purple-500 text-2xl font-extrabold no-underline" to="/">
          Groovify
        </Link>
      </div>

      <div className="flex items-center gap-5">
        {/* Background Toggle Button */}
        <button
          onClick={toggleBackground}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full text-sm font-bold transition-colors"
        >
          {darkBackground ? '🎨 Show BG' : '⚫ Solid BG'}
        </button>

        <nav className="flex gap-5">
          <Link to="/" className="text-white no-underline font-bold hover:text-purple-500 transition-colors duration-300">
            Home
          </Link>
          <Link to="/dashboard" className="text-white no-underline font-bold hover:text-purple-500 transition-colors duration-300">
            Dashboard
          </Link>
          <Link to="/login" className="text-white no-underline font-bold hover:text-purple-500 transition-colors duration-300">
            Login
          </Link>
          <Link to="/signup" className="text-white no-underline font-bold hover:text-purple-500 transition-colors duration-300">
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;