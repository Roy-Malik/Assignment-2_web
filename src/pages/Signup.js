import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import backgroundImage from '../assets/bg-image.png';
import googleLogo from '../assets/google.svg';
import appleLogo from '../assets/apple.svg';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Check theme preference directly from localStorage
  const savedTheme = localStorage.getItem('groovifyBackground');
  const darkBackground = savedTheme === 'dark';

  // Background style based on theme
  const backgroundStyle = darkBackground
    ? { backgroundColor: '#111827' }
    : { backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'repeat' };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/users/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.password
      });

      setMessage('✅ Account created successfully!');

      // Optionally login automatically
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      // window.location.href = '/'; // Or use navigate 
    } catch (error) {
      console.error('Error adding user: ', error);
      setMessage(`❌ ${error.response?.data?.message || 'Error creating account.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center"
      style={backgroundStyle}
    >
      <Navbar />

      {/* Signup Container */}
      <div className="mt-28 mb-10 flex flex-col items-center py-8 px-10 rounded-xl w-96 text-center bg-gray-800 bg-opacity-95 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
        <p className="font-bold text-3xl mb-5">Create your account</p>

        {/* Success/Error Message */}
        {message && (
          <div className={`w-full p-3 rounded mb-4 text-sm ${message.includes('✅') ? 'bg-green-600' : 'bg-red-600'
            }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col w-full mb-4">
          <label htmlFor="name" className="text-sm mt-2 mb-1 text-left">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Your name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="py-2 px-3 border-none rounded mb-4 text-sm outline-none bg-gray-700 text-white"
          />

          <label htmlFor="email" className="text-sm mt-2 mb-1 text-left">Email</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="py-2 px-3 border-none rounded mb-4 text-sm outline-none bg-gray-700 text-white"
          />

          <label htmlFor="password" className="text-sm mt-2 mb-1 text-left">Password</label>
          <input
            type="password"
            id="password"
            placeholder="At least 6 characters"
            required
            minLength="6"
            value={formData.password}
            onChange={handleInputChange}
            className="py-2 px-3 border-none rounded mb-4 text-sm outline-none bg-gray-700 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white border-none py-3 rounded-full text-base font-bold cursor-pointer hover:opacity-85 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="my-4 text-gray-400">or</div>

        <button className="w-full py-2 rounded-full border border-gray-600 bg-transparent text-white mb-3 cursor-pointer hover:bg-gray-700 transition-colors duration-300 flex justify-center items-center gap-3">
          <img className="h-5 w-5" src={googleLogo} alt="Google Logo" />
          Sign up with Google
        </button>

        <button className="w-full py-2 rounded-full border border-gray-600 bg-transparent text-white mb-3 cursor-pointer hover:bg-gray-700 transition-colors duration-300 flex justify-center items-center gap-3">
          <img className="h-5 w-5" src={appleLogo} alt="Apple Logo" />
          Sign up with Apple
        </button>

        <p className="mt-5 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-500 no-underline hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;