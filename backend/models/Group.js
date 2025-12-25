const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    inviteCode: {
        type: String,
        required: true,
        unique: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

// Limit group size to 10
groupSchema.path('members').validate(function (value) {
    return value.length <= 10;
}, 'Group size cannot exceed 10 users.');

module.exports = mongoose.model('Group', groupSchema);
