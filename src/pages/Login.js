import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthForm from '../components/AuthForm';
import backgroundImage from '../assets/bg-image.png';

function Login() {
  const [darkBackground, setDarkBackground] = useState(false);

  useEffect(() => {
    const handleThemeChange = (event) => {
      setDarkBackground(event.detail.darkBackground);
    };

    document.addEventListener('themeChange', handleThemeChange);

    // Load saved theme on mount
    const savedTheme = localStorage.getItem('groovifyBackground');
    if (savedTheme === 'dark') {
      setDarkBackground(true);
    }

    return () => {
      document.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  const backgroundStyle = darkBackground
    ? { backgroundColor: '#111827' }
    : { backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'repeat' };

  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (data) => {
    setError('');
    try {
      const response = await api.post('/users/login', {
        email: data.email,
        password: data.password
      });

      // Login successful
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user)); // Adjust based on actual response structure

      navigate('/');
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

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

          {error && (
            <div className="bg-red-500 bg-opacity-80 border border-red-500 text-white text-sm p-3 rounded mb-4">
              {error}
            </div>
          )}

          <AuthForm type="login" onSubmit={handleLogin} />

          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-300 no-underline hover:underline">
              Sign up
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Login;
