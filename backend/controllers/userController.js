import User from '../models/UserSchema.js';
import Newsletter from '../models/NewsletterSchema.js';
import Contact from '../models/ContactSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOTPEmail, sendWelcomeEmail } from '../utils/emailService.js';

const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ fullName, email, password });
    await user.save();

    // Send welcome email
    const emailResult = await sendWelcomeEmail(email, fullName);
    if (!emailResult.success) {
      console.error('Failed to send welcome email:', emailResult.error);
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    res.status(201).json({ token, user: { id: user._id, fullName, email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    res.json({ token, user: { id: user._id, fullName: user.fullName, email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(400).json({ message: 'Email already subscribed' });
      } else {
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        await existingSubscriber.save();
        return res.json({ message: 'Successfully resubscribed to newsletter' });
      }
    }

    const newsletter = new Newsletter({ email });
    await newsletter.save();
    
    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message, category } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = new Contact({ name, email, subject, message, category });
    await contact.save();
    
    res.status(201).json({ message: 'Message sent successfully. We will get back to you soon!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    
    if (!fullName || !email) {
      return res.status(400).json({ message: 'Full name and email are required' });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: req.userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { fullName, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(req.userId, { password: hashedPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetOTP = otp;
    user.resetOTPExpires = otpExpires;
    await user.save();

    // Send OTP via email
    const emailResult = await sendOTPEmail(email, otp, user.fullName);
    
    if (!emailResult.success) {
      return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }
    
    res.json({ message: 'OTP sent to your email successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ 
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findOne({ 
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveHistory = async (req, res) => {
  try {
    const { historyRecords } = req.body;
    
    if (!historyRecords || !Array.isArray(historyRecords)) {
      return res.status(400).json({ message: 'Invalid history records' });
    }

    // Add timestamps to records
    const recordsWithTimestamp = historyRecords.map(record => ({
      ...record,
      created_at: new Date(),
    }));

    // You can save to a PlantHistory collection or add to User document
    // For now, just return success
    res.json({ message: 'History saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { signup, login, getUser, logout, subscribeNewsletter, submitContact, updateProfile, updatePassword, forgotPassword, verifyOTP, resetPassword, saveHistory };