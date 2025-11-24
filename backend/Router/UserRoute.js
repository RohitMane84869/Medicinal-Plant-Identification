import express from 'express';
import { signup, login, getUser, logout, subscribeNewsletter, submitContact, updateProfile, updatePassword, forgotPassword, verifyOTP, resetPassword, saveHistory } from '../controllers/userController.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', auth, getUser);
router.post('/logout', auth, logout);
router.post('/newsletter/subscribe', subscribeNewsletter);
router.post('/contact', submitContact);
router.put('/profile', auth, updateProfile);
router.put('/password', auth, updatePassword);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/save-history', auth, saveHistory);

export default router;