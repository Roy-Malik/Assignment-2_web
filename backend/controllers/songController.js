const Song = require('../models/Song');

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        if (this.queryString.search) {
            queryObj.$text = { $search: this.queryString.search };
        }

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

exports.getAllSongs = async (req, res) => {
    try {
        const features = new APIFeatures(Song.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const songs = await features.query;

        res.status(200).json({
            status: 'success',
            results: songs.length,
            data: {
                songs
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.createSong = async (req, res) => {
    try {
        // Add user as owner
        req.body.owner = req.user.id;

        // Add image url if file uploaded
        if (req.file) {
            // Assuming we serve static files from public/uploads
            req.body.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const newSong = await Song.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                song: newSong
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id).populate('owner', 'name email');

        if (!song) {
            return res.status(404).json({ status: 'fail', message: 'No song found with that ID' });
        }

        res.status(200).json({
            status: 'success',
            data: {
                song
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.updateSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) return res.status(404).json({ status: 'fail', message: 'No song found with that ID' });

        // Check ownership
        if (song.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ status: 'fail', message: 'You do not own this song' });
        }

        const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                song: updatedSong
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.deleteSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) return res.status(404).json({ status: 'fail', message: 'No song found with that ID' });

        if (song.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ status: 'fail', message: 'You do not own this song' });
        }

        await Song.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};
