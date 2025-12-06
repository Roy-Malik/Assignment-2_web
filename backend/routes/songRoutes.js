const express = require('express');
const songController = require('../controllers/songController');
const authController = require('../controllers/authController');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
    .get(songController.getAllSongs)
    .post(authController.protect, upload.single('image'), songController.createSong);

router.route('/:id')
    .get(songController.getSong)
    .patch(authController.protect, songController.updateSong)
    .delete(authController.protect, songController.deleteSong);

module.exports = router;
