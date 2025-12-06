const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = require('../app');
const User = require('../models/User');
const Song = require('../models/Song');

beforeAll(async () => {
    // Connect to a test database or the local one
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/groovify-test');
});

afterAll(async () => {
    await User.deleteMany({});
    await Song.deleteMany({});
    await mongoose.connection.close();
});

describe('Song API', () => {
    let token;
    let userId;
    let songId;

    beforeAll(async () => {
        // 1. Create a user
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            passwordConfirm: 'password123',
            role: 'admin' // Admin to bypass ownership checks simplify
        };
        await request(app).post('/api/users/signup').send(userData);

        // 2. Login to get token
        const res = await request(app).post('/api/users/login').send({
            email: 'test@example.com',
            password: 'password123'
        });
        token = res.body.token;
        userId = res.body.data.user._id;
    });

    test('POST /api/songs - Create a new Song', async () => {
        const res = await request(app)
            .post('/api/songs')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Song',
                artist: 'Test Artist',
                genre: 'Pop',
                duration: '3:00'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.data.song.title).toBe('Test Song');
        songId = res.body.data.song._id;
    });

    test('PATCH /api/songs/:id - Update Song', async () => {
        const res = await request(app)
            .patch(`/api/songs/${songId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Updated Song Title'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.song.title).toBe('Updated Song Title');
    });

    test('POST /api/songs - Fail without Auth', async () => {
        const res = await request(app)
            .post('/api/songs')
            .send({
                title: 'Fail Song',
                artist: 'Fail Artist',
                genre: 'Pop',
                duration: '3:00'
            });

        expect(res.statusCode).toBe(401);
    });
});
