const Group = require('../models/Group');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const crypto = require('crypto');

const createGroup = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Group name is required' });
    }

    try {
        // Check if user already in a group
        if (req.user.groupId) {
            return res.status(400).json({ message: 'User already belongs to a group' });
        }

        const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        const group = await Group.create({
            name,
            adminId: req.user._id,
            inviteCode,
            members: [req.user._id],
        });

        // Update user role to Admin and set groupId
        req.user.role = 'Admin';
        req.user.groupId = group._id;
        await req.user.save();

        await ActivityLog.create({
            type: 'MemberJoin',
            description: `${req.user.email} created the group "${name}"`,
            groupId: group._id,
            userId: req.user._id,
        });

        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const joinGroup = async (req, res) => {
    const { inviteCode } = req.body;

    if (!inviteCode) {
        return res.status(400).json({ message: 'Invite code is required' });
    }

    try {
        const group = await Group.findOne({ inviteCode });

        if (!group) {
            return res.status(404).json({ message: 'Invalid invite code' });
        }

        if (group.members.length >= 10) {
            return res.status(400).json({ message: 'Group is full (max 10 members)' });
        }

        if (group.members.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already a member of this group' });
        }

        group.members.push(req.user._id);
        await group.save();

        req.user.groupId = group._id;
        req.user.role = 'Member';
        await req.user.save();

        await ActivityLog.create({
            type: 'MemberJoin',
            description: `${req.user.email} joined the group`,
            groupId: group._id,
            userId: req.user._id,
        });

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGroupDetails = async (req, res) => {
    try {
        if (!req.user.groupId) {
            return res.status(404).json({ message: 'User not in a group' });
        }

        const group = await Group.findById(req.user.groupId).populate('members', 'name email role');
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createGroup, joinGroup, getGroupDetails };
