const User = require('../models/User');
const Song = require('../models/Song');

exports.getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const songCount = await Song.countDocuments();
        const genreStats = await Song.aggregate([
            {
                $group: {
                    _id: '$genre',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                totalUsers: userCount,
                totalSongs: songCount,
                genreDistribution: genreStats
            }
        });

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};
