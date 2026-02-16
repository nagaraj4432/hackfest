import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import Notification from '../models/Notification.js';
import OTP from '../models/OTP.js';
import { generateOTP } from '../utils/otpService.js';
import { sendEmail } from '../utils/emailService.js';

export const updateProfile = async (req, res) => {
  try {
    const { name, branch, section } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, branch, section },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const { newEmail } = req.body;
    
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Generate OTP for verification
    const otp = generateOTP();
    const otpDoc = new OTP({
      userId: req.userId,
      otp
    });
    await otpDoc.save();

    // Send OTP email
    await sendEmail(
      newEmail,
      '🔐 Email Verification OTP - Aptitude Tracker',
      `<p>Your OTP for email verification is: <strong>${otp}</strong></p><p>This OTP will expire in 10 minutes.</p>`
    );

    res.json({ message: 'OTP sent to new email', requiresVerification: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyEmailOTP = async (req, res) => {
  try {
    const { otp, newEmail } = req.body;

    const otpDoc = await OTP.findOne({ userId: req.userId, otp, verified: false });
    if (!otpDoc) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Update email
    await User.findByIdAndUpdate(req.userId, { email: newEmail });
    await OTP.findByIdAndDelete(otpDoc._id);

    res.json({ message: 'Email updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.userId, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ sentAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNotificationCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({ 
      userId: req.userId, 
      read: false 
    });

    res.json({ unreadCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const enableEmailNotifications = async (req, res) => {
  try {
    const { emailNotifications } = req.body;
    
    await User.findByIdAndUpdate(req.userId, { emailNotifications });
    res.json({ message: 'Email notification settings updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTwoFactorStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('twoFactorEnabled');
    res.json({ twoFactorEnabled: user.twoFactorEnabled || false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const enable2FA = async (req, res) => {
  try {
    const otp = generateOTP();
    const otpDoc = new OTP({
      userId: req.userId,
      otp
    });
    await otpDoc.save();

    const user = await User.findById(req.userId);
    await sendEmail(
      user.email,
      '🔐 Enable Two-Factor Authentication - Aptitude Tracker',
      `<p>Your OTP to enable 2FA is: <strong>${otp}</strong></p><p>This OTP will expire in 10 minutes.</p>`
    );

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verify2FA = async (req, res) => {
  try {
    const { otp } = req.body;

    const otpDoc = await OTP.findOne({ userId: req.userId, otp, verified: false });
    if (!otpDoc) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    await User.findByIdAndUpdate(req.userId, { twoFactorEnabled: true });
    await OTP.findByIdAndDelete(otpDoc._id);

    res.json({ message: '2FA enabled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const disable2FA = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { twoFactorEnabled: false });
    res.json({ message: '2FA disabled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
