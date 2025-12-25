const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../utils/mailer');
const crypto = require('crypto');

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const requestOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Clear existing OTPs for this email
        await OTP.deleteMany({ email });

        // Save new OTP
        await OTP.create({ email, otp, expiresAt });

        // Send email (in production, we'd wait for this, but for UX we might fire and forget or handle errors)
        try {
            await sendOTP(email, otp);
            res.status(200).json({ message: 'OTP sent to your email' });
        } catch (mailError) {
            console.error('Nodemailer Error:', mailError);
            res.status(500).json({ message: 'Failed to send OTP. Check Mailer config.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // OTP is valid - find or create user
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ email });
        }

        // Create JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        // Delete used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            groupId: user.groupId,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
    const user = await User.findById(req.user._id).populate('groupId');
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { requestOTP, verifyOTP, logout, getMe };
