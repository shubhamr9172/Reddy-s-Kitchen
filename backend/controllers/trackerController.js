const TrackerEntry = require('../models/TrackerEntry');
const ActivityLog = require('../models/ActivityLog');

const createEntry = async (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    if (!req.user.groupId) {
        return res.status(400).json({ message: 'No group found for this user' });
    }

    try {
        const entry = await TrackerEntry.create({
            title,
            description,
            groupId: req.user.groupId,
            createdBy: req.user._id,
            lastUpdatedBy: req.user._id,
        });

        await ActivityLog.create({
            type: 'EntryCreate',
            description: `New task created: ${title}`,
            groupId: req.user.groupId,
            userId: req.user._id,
        });

        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEntry = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
        const entry = await TrackerEntry.findById(id);

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        if (entry.groupId.toString() !== req.user.groupId.toString()) {
            return res.status(403).json({ message: 'Unauthorized to update this group entry' });
        }

        entry.title = title || entry.title;
        entry.description = description || entry.description;
        entry.status = status || entry.status;
        entry.lastUpdatedBy = req.user._id;

        await entry.save();

        await ActivityLog.create({
            type: 'EntryUpdate',
            description: `Task updated: ${entry.title} (${entry.status})`,
            groupId: req.user.groupId,
            userId: req.user._id,
        });

        res.status(200).json(entry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEntries = async (req, res) => {
    try {
        if (!req.user.groupId) {
            return res.status(400).json({ message: 'User not in a group' });
        }

        const entries = await TrackerEntry.find({ groupId: req.user.groupId })
            .populate('createdBy', 'name email')
            .populate('lastUpdatedBy', 'name email')
            .sort({ updatedAt: -1 });

        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createEntry, updateEntry, getEntries };
