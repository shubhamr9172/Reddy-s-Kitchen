const ActivityLog = require('../models/ActivityLog');

const getActivityLogs = async (req, res) => {
    try {
        if (!req.user.groupId) {
            return res.status(400).json({ message: 'User not in a group' });
        }

        const logs = await ActivityLog.find({ groupId: req.user.groupId })
            .populate('userId', 'name email')
            .sort({ timestamp: -1 })
            .limit(50);

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getActivityLogs };
