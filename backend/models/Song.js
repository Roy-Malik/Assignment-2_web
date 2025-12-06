const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A song must have a title'],
        trim: true
    },
    artist: {
        type: String,
        required: [true, 'A song must have an artist'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    genre: {
        type: String,
        required: [true, 'A song must have a genre'],
        enum: {
            values: ['Pop', 'Rock', 'Electronic', 'Lofi', 'Study', 'Fusion', 'Acoustic', 'Jazz', 'Classical', 'HipHop', 'Qawwali', 'Sufi'],
            message: 'Genre is either: Pop, Rock, Electronic, Lofi, Study, Fusion, Acoustic, Jazz, Classical, HipHop, Qawwali, Sufi'
        }
    },
    duration: {
        type: String,
        required: [true, 'A song must have a duration (e.g., 3:45)']
    },
    imageUrl: {
        type: String,
        default: 'default-music.jpg'
    },
    audioUrl: {
        type: String,
        // Not strictly required for now if we just list metadata
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A song must belong to a user']
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
});

// Query Middleware to populate owner details optionally or other logic?
// simpler to just index for now
songSchema.index({ title: 'text', artist: 'text' });

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
