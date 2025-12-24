import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import backgroundImage from '../assets/bg-image.png';

function AddSong() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        genre: 'Pop',
        duration: '',
        description: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [darkBackground, setDarkBackground] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('groovifyBackground');
        if (savedTheme === 'dark') setDarkBackground(true);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Use FormData for file upload
            const data = new FormData();
            data.append('title', formData.title);
            data.append('artist', formData.artist);
            data.append('genre', formData.genre);
            data.append('duration', formData.duration);
            data.append('description', formData.description);
            if (imageFile) {
                data.append('image', imageFile);
            }

            await api.post('/songs', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error creating song');
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
            <div className="flex-1 flex justify-center items-center py-20 px-4">
                <form onSubmit={handleSubmit} className="bg-gray-800 bg-opacity-90 p-8 rounded-xl shadow-2xl w-full max-w-lg">
                    <h2 className="text-3xl font-bold mb-6 text-center">Add New Song</h2>

                    {error && <div className="bg-red-500 p-3 rounded mb-4 text-sm">{error}</div>}

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Title</label>
                        <input
                            type="text" name="title" required
                            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.title} onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Artist</label>
                        <input
                            type="text" name="artist" required
                            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.artist} onChange={handleChange}
                        />
                    </div>

                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-gray-300 text-sm font-bold mb-2">Genre</label>
                            <select
                                name="genre"
                                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={formData.genre} onChange={handleChange}
                            >
                                <option value="Pop">Pop</option>
                                <option value="Rock">Rock</option>
                                <option value="Electronic">Electronic</option>
                                <option value="Lofi">Lofi</option>
                                <option value="Qawwali">Qawwali</option>
                                <option value="Sufi">Sufi</option>
                                <option value="HipHop">HipHop</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-300 text-sm font-bold mb-2">Duration (e.g. 3:45)</label>
                            <input
                                type="text" name="duration" required
                                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={formData.duration} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Description</label>
                        <textarea
                            name="description"
                            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                            value={formData.description} onChange={handleChange}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-bold mb-2">Cover Image</label>
                        <input
                            type="file" accept="image/*"
                            className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                            onChange={handleFileChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : 'Add Song'}
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default AddSong;
