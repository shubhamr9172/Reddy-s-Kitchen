# OTP Email Setup Guide (Gmail SMTP)

To enable email OTPs in the Group Tracker App, follow these steps:

### 1. Enable 2-Step Verification
1. Go to your **Google Account** settings.
2. Select **Security**.
3. Enable **2-Step Verification** if not already active.

### 2. Create an App Password
1. In the same **Security** tab, search for "App passwords".
2. Select **App passwords** (you might need to sign in again).
3. Under "Select app", choose **Other (Custom name)** and enter `Group Tracker App`.
4. Click **Generate**.
5. Copy the **16-character password** shown (this is your `EMAIL_PASS`).

### 3. Backend Configuration
Add the following to your `.env` file in the `backend` folder:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### Common Issues & Fixes
- **Error: Invalid login**: Ensure your app password is correct and 2-Step verification is ON.
- **Port 465 vs 587**: Nodemailer defaults to port 587 with `service: 'gmail'`. No additional config is usually needed.
- **Rate limiting**: Google limits emails. This app is for 5-10 users, so it won't hit limits.
