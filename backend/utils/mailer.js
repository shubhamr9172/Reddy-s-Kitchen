const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
    },
});

const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: `"Group Tracker App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP for Group Tracker App',
        text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
        html: `
      <div style="font-family: sans-serif; text-align: center; padding: 20px;">
        <h2>Group Tracker App</h2>
        <p>Your one-time password for logging in is:</p>
        <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p style="color: #6B7280; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };
