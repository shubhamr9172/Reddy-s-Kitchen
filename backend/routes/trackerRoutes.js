const express = require('express');
const { createEntry, updateEntry, getEntries } = require('../controllers/trackerController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createEntry);
router.get('/', protect, getEntries);
router.patch('/:id', protect, updateEntry);

module.exports = router;
