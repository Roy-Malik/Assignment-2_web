import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import backgroundImage from '../assets/bg-image.png';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: '', email: '' });
    const [passData, setPassData] = useState({ passwordCurrent: '', password: '', passwordConfirm: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [darkBackground, setDarkBackground] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await api.get('/users/me');
                setUser({ name: res.data.data.user.name, email: res.data.data.user.email });
            } catch (err) {
                console.error(err);
            }
        };
        loadUser();

        const savedTheme = localStorage.getItem('groovifyBackground');
        if (savedTheme === 'dark') setDarkBackground(true);
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(''); setError('');
        try {
            const res = await api.patch('/users/updateMe', user);
            setMessage('Profile updated successfully!');
            setUser({ name: res.data.data.user.name, email: res.data.data.user.email });
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(''); setError('');
        try {
            await api.patch('/users/updateMyPassword', passData);
            setMessage('Password updated successfully!');
            setPassData({ passwordCurrent: '', password: '', passwordConfirm: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Error changing password');
        } finally {
            setLoading(false);
        }
    };

    const backgroundStyle = darkBackground
        ? { backgroundColor: '#111827' }
        : { backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'repeat' };

    return (
        <div className="min-h-screen text-white flex flex-col" style={backgroundStyle}>
            <Navbar />
            <div className="flex-1 container mx-auto px-4 py-8 mt-20 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-center">My Profile settings</h1>

                {message && <div className="bg-green-600 p-3 rounded mb-4 text-center">{message}</div>}
                {error && <div className="bg-red-600 p-3 rounded mb-4 text-center">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Update Profile Form */}
                    <div className="bg-gray-800 bg-opacity-90 p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Edit Details</h2>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-1">Name</label>
                                <input
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-1">Email</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>

                    {/* Change Password Form */}
                    <div className="bg-gray-800 bg-opacity-90 p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Change Password</h2>
                        <form onSubmit={handleChangePassword}>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-1">Current Password</label>
                                <input
                                    type="password" required
                                    value={passData.passwordCurrent}
                                    onChange={(e) => setPassData({ ...passData, passwordCurrent: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-1">New Password</label>
                                <input
                                    type="password" required minLength="8"
                                    value={passData.password}
                                    onChange={(e) => setPassData({ ...passData, password: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-1">Confirm New Password</label>
                                <input
                                    type="password" required minLength="8"
                                    value={passData.passwordConfirm}
                                    onChange={(e) => setPassData({ ...passData, passwordConfirm: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors"
                            >
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Profile;
